import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateReportPDF = async (userId: string): Promise<void> => {
  try {
    // Create a temporary div to render the report content
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    tempDiv.style.width = "800px";
    tempDiv.style.backgroundColor = "white";
    tempDiv.style.padding = "20px";
    tempDiv.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    document.body.appendChild(tempDiv);

    // Fetch all the same data that ReportDialog uses
    const [
      reportRes,
      personalityRes,
      preCMRes,
      postCMRes,
      wpreRes,
      wpostRes,
      sdqPreRes,
      sdqPostRes,
      preInterventionRes,
      postInterventionRes,
    ] = await Promise.all([
      fetch("/api/journey/report"),
      fetch("/api/journey/sessions/2/q/personality-test"),
      fetch("/api/journey/sessions/1/a/career-maturity/insights"),
      fetch("/api/journey/sessions/8/a/post-career-maturity/insights"),
      fetch("/api/journey/sessions/1/q/psychological-wellbeing"),
      fetch("/api/journey/sessions/8/q/post-psychological-wellbeing"),
      fetch("/api/journey/sessions/1/q/pre-coaching-strength-difficulty"),
      fetch("/api/journey/sessions/8/q/post-coaching-strength-difficulty"),
      fetch("/api/journey/sessions/1/q/pre-assessment"),
      fetch("/api/journey/sessions/8/q/post-coaching"),
    ]);

    // Parse all responses
    const reportData = reportRes.ok ? await reportRes.json() : null;
    const personalityData = personalityRes.ok
      ? await personalityRes.json()
      : null;
    const careerMaturityPre = preCMRes.ok ? await preCMRes.json() : null;
    const careerMaturityPost = postCMRes.ok ? await postCMRes.json() : null;
    const wellbeingPre = wpreRes.ok ? await wpreRes.json() : null;
    const wellbeingPost = wpostRes.ok ? await wpostRes.json() : null;
    const sdqPre = sdqPreRes.ok ? await sdqPreRes.json() : null;
    const sdqPost = sdqPostRes.ok ? await sdqPostRes.json() : null;
    const preInterventionAnswers = preInterventionRes.ok
      ? (await preInterventionRes.json())?.answers
      : null;
    const postInterventionAnswers = postInterventionRes.ok
      ? (await postInterventionRes.json())?.answers
      : null;

    // Render the report content in the temporary div
    tempDiv.innerHTML = createReportHTML({
      reportData,
      personalityData,
      careerMaturityPre,
      careerMaturityPost,
      wellbeingPre,
      wellbeingPost,
      sdqPre,
      sdqPost,
      preInterventionAnswers,
      postInterventionAnswers,
    });

    // Wait a bit for content to render
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 800,
      height: tempDiv.scrollHeight,
    });

    // Remove temporary div
    document.body.removeChild(tempDiv);

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Download the PDF
    const currentDate = new Date().toISOString().split("T")[0];
    pdf.save(`career-journey-report-${currentDate}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// RIASEC category mapping
const RIASEC_CATEGORIES = {
  R: {
    name: "Realistic",
    description: "Hands-on, practical work with tools, machines, or nature",
    color: "blue",
  },
  I: {
    name: "Investigative",
    description: "Scientific, analytical, and research-oriented work",
    color: "green",
  },
  A: {
    name: "Artistic",
    description: "Creative, expressive, and aesthetic work",
    color: "purple",
  },
  S: {
    name: "Social",
    description: "Helping, teaching, and working with people",
    color: "pink",
  },
  E: {
    name: "Enterprising",
    description: "Leadership, persuasion, and business-oriented work",
    color: "orange",
  },
  C: {
    name: "Conventional",
    description: "Organized, detail-oriented, and systematic work",
    color: "gray",
  },
};

// Helper functions
const preAssessmentQuestionTexts = [
  "How clear are your current career goals?",
  "How confident are you that you will achieve your career goals?",
  "How confident are you in your ability to overcome obstacles in your career?",
  "How would you rate your current level of stress related to work or personal life?",
  "How well do you understand your own thought patterns and behaviors?",
  "How satisfied are you with your current work-life balance?",
  "How satisfied are you with your current job and overall well-being?",
  "How ready are you to make changes in your professional or personal life?",
];

const getPreQuestionLabelFromKey = (key: string): string => {
  if (key.startsWith("q")) {
    const idx = parseInt(key.slice(1), 10) - 1;
    if (!isNaN(idx) && preAssessmentQuestionTexts[idx]) {
      return preAssessmentQuestionTexts[idx];
    }
  }
  return key;
};

const getCorrespondingPostKeyFromPreKey = (key: string): string | null => {
  if (key.startsWith("q")) return key;
  const idx = preAssessmentQuestionTexts.findIndex((t) => t === key);
  return idx >= 0 ? `q${idx + 1}` : null;
};

const toTitleCaseLabel = (key: string): string => {
  const withSpaces = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return withSpaces
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .trim();
};

const personalitySubscaleMax: Record<string, number> = {
  extraversion: 8,
  agreeableness: 9,
  conscientiousness: 9,
  neuroticism: 8,
  openness: 10,
};

const createReportHTML = (data: any): string => {
  const {
    reportData,
    personalityData,
    careerMaturityPre,
    careerMaturityPost,
    wellbeingPre,
    wellbeingPost,
    sdqPre,
    sdqPost,
    preInterventionAnswers,
    postInterventionAnswers,
  } = data;

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #10b981;">
        <h1 style="color: #0f172a; font-size: 32px; margin-bottom: 8px; font-weight: bold;">Career Journey Report</h1>
        <p style="color: #64748b; font-size: 16px; margin-bottom: 8px;">Personal Development Assessment</p>
        <p style="color: #64748b; font-size: 14px;">Generated on ${new Date().toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</p>
      </div>

      <!-- Career Interest Profile -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          🏆 Career Interest Profile
        </h2>
        
        ${
          reportData?.riasecData
            ? `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
            ${reportData.riasecData.topCategories
              .map((category: any) => {
                const categoryInfo =
                  RIASEC_CATEGORIES[
                    category.code as keyof typeof RIASEC_CATEGORIES
                  ];
                return `
                <div style="padding: 20px; border: 2px solid #e2e8f0; border-radius: 12px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                      ${category.code}
                    </div>
                    <div>
                      <h3 style="color: #1e293b; font-size: 18px; margin: 0; font-weight: bold;">${category.name}</h3>
                    </div>
                  </div>
                  <p style="color: #64748b; font-size: 14px; margin-bottom: 15px; line-height: 1.5;">
                    ${category.description}
                  </p>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #64748b; font-size: 14px;">Percentage</span>
                    <span style="color: #1e293b; font-weight: bold; font-size: 16px;">${category.percentage}%</span>
                  </div>
                  <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: #3b82f6; width: ${category.percentage}%; border-radius: 4px;"></div>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Interest Assessment Not Completed</h3>
            <p style="color: #64748b; font-size: 14px;">Complete the RIASEC interest assessment to discover your career interest profile.</p>
          </div>
        `
        }
      </div>

      <!-- Personality Assessment -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          👤 Personality Assessment
        </h2>
        
        ${
          personalityData
            ? `
          <div style="padding: 25px; background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px solid #10b981; border-radius: 12px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; align-items: center;">
              <div>
                <h3 style="color: #065f46; font-size: 16px; margin-bottom: 20px; font-weight: bold;">Personality Traits</h3>
                <div style="display: grid; gap: 15px;">
                  ${Object.entries(personalityData.subscaleScores)
                    .map(([trait, rawScore]: [string, any]) => {
                      const maxItems = personalitySubscaleMax[trait] || 10;
                      const pct = Math.max(
                        0,
                        Math.min(100, (rawScore / maxItems) * 100)
                      );
                      return `
                      <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                          <span style="color: #065f46; font-weight: 600; text-transform: capitalize;">${trait}</span>
                          <span style="color: #065f46; font-weight: bold;">${Math.round(
                            pct
                          )}%</span>
                        </div>
                        <div style="width: 100%; height: 8px; background: #bbf7d0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #10b981, #059669); width: ${pct}%; border-radius: 4px;"></div>
                        </div>
                      </div>
                    `;
                    })
                    .join("")}
                </div>
              </div>
              <div style="text-align: center;">
                <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
                  <span style="color: white; font-size: 28px; font-weight: bold;">${Math.round(
                    parseFloat(personalityData.score)
                  )}%</span>
                </div>
                <h4 style="color: #065f46; font-size: 14px; font-weight: bold; margin: 0;">Overall Personality Score</h4>
              </div>
            </div>
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">👤</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Personality Assessment Not Completed</h3>
            <p style="color: #64748b; font-size: 14px;">Complete the Big Five personality assessment to view your trait scores.</p>
          </div>
        `
        }
      </div>

      <!-- Career Maturity Progress -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          📊 Career Maturity Progress
        </h2>
        
        ${
          careerMaturityPre?.insights?.score ||
          careerMaturityPost?.insights?.score
            ? `
          <div style="padding: 25px; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 2px solid #3b82f6; border-radius: 12px;">
            <h3 style="color: #1e40af; font-size: 16px; margin-bottom: 20px; font-weight: bold;">Scale Changes (Before vs After)</h3>
            <div style="display: grid; gap: 12px;">
              ${Object.keys(
                careerMaturityPre?.insights?.score ||
                  careerMaturityPost?.insights?.score ||
                  {}
              )
                .map((scale) => {
                  const before =
                    careerMaturityPre?.insights?.score?.[scale] ?? 0;
                  const after =
                    careerMaturityPost?.insights?.score?.[scale] ?? 0;
                  const delta = parseFloat((after - before).toFixed(2));
                  const deltaPositive = delta >= 0;

                  return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border: 1px solid #cbd5e1;">
                    <div style="font-weight: 600; color: #1e293b; min-width: 140px;">${scale}</div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <span style="padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        Before: ${Math.round(before)}%
                      </span>
                      <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        After: ${Math.round(after)}%
                      </span>
                      <span style="padding: 4px 12px; background: ${
                        deltaPositive ? "#dcfce7" : "#fed7d7"
                      }; color: ${
                    deltaPositive ? "#166534" : "#dc2626"
                  }; border-radius: 16px; font-size: 12px; font-weight: bold;">
                        ${deltaPositive ? "+" : ""}${delta}%
                      </span>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Career Maturity Assessments Not Completed</h3>
            <p style="color: #64748b; font-size: 14px;">Complete both pre and post career maturity assessments to view progress.</p>
          </div>
        `
        }
      </div>

      <!-- Psychological Wellbeing Progress -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          💖 Psychological Wellbeing Progress
        </h2>
        
        ${
          wellbeingPre || wellbeingPost
            ? `
          <div style="padding: 25px; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px solid #ec4899; border-radius: 12px;">
            <h3 style="color: #be185d; font-size: 16px; margin-bottom: 20px; font-weight: bold;">Wellbeing Dimensions</h3>
            <div style="display: grid; gap: 12px; margin-bottom: 20px;">
              ${Array.from(
                new Set([
                  ...Object.keys(wellbeingPre?.subscaleScores || {}),
                  ...Object.keys(wellbeingPost?.subscaleScores || {}),
                ])
              )
                .map((dim) => {
                  const before = wellbeingPre?.subscaleScores?.[dim] ?? 0;
                  const after = wellbeingPost?.subscaleScores?.[dim] ?? 0;
                  const maxRaw = 49;
                  const beforePct = Math.round(
                    Math.max(0, Math.min(100, (before / maxRaw) * 100))
                  );
                  const afterPct = Math.round(
                    Math.max(0, Math.min(100, (after / maxRaw) * 100))
                  );
                  const delta = parseFloat((afterPct - beforePct).toFixed(2));
                  const deltaPositive = delta >= 0;

                  return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border: 1px solid #cbd5e1;">
                    <div style="font-weight: 600; color: #1e293b; min-width: 160px;">${toTitleCaseLabel(
                      dim
                    )}</div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <span style="padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        Before: ${beforePct}%
                      </span>
                      <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        After: ${afterPct}%
                      </span>
                      <span style="padding: 4px 12px; background: ${
                        deltaPositive ? "#dcfce7" : "#fed7d7"
                      }; color: ${
                    deltaPositive ? "#166534" : "#dc2626"
                  }; border-radius: 16px; font-size: 12px; font-weight: bold;">
                        ${deltaPositive ? "+" : ""}${delta}%
                      </span>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
            
            <!-- Overall Wellbeing -->
            <div style="padding-top: 20px; border-top: 2px solid #ec4899;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border: 1px solid #cbd5e1;">
                <div style="font-weight: 600; color: #1e293b; min-width: 160px;">Overall Wellbeing Score</div>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <span style="padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 16px; font-size: 12px; font-weight: 600;">
                    Before: ${
                      wellbeingPre
                        ? Math.round(parseFloat(wellbeingPre.score))
                        : "—"
                    }%
                  </span>
                  <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 16px; font-size: 12px; font-weight: 600;">
                    After: ${
                      wellbeingPost
                        ? Math.round(parseFloat(wellbeingPost.score))
                        : "—"
                    }%
                  </span>
                  ${(() => {
                    const b = wellbeingPre ? parseFloat(wellbeingPre.score) : 0;
                    const a = wellbeingPost
                      ? parseFloat(wellbeingPost.score)
                      : 0;
                    const d = parseFloat((a - b).toFixed(2));
                    const pos = d >= 0;
                    return `
                      <span style="padding: 4px 12px; background: ${
                        pos ? "#dcfce7" : "#fed7d7"
                      }; color: ${
                      pos ? "#166534" : "#dc2626"
                    }; border-radius: 16px; font-size: 12px; font-weight: bold;">
                        ${pos ? "+" : ""}${d}%
                      </span>
                    `;
                  })()}
                </div>
              </div>
            </div>
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">💖</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Psychological Wellbeing Assessments Not Completed</h3>
            <p style="color: #64748b; font-size: 14px;">Complete both pre and post wellbeing assessments to view progress.</p>
          </div>
        `
        }
      </div>

      <!-- Strengths & Difficulties Progress -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          🏅 Strengths & Difficulties Progress
        </h2>
        
        ${
          sdqPre || sdqPost
            ? `
          <div style="padding: 25px; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #f59e0b; border-radius: 12px;">
            <h3 style="color: #92400e; font-size: 16px; margin-bottom: 20px; font-weight: bold;">SDQ Subscales</h3>
            <div style="display: grid; gap: 12px; margin-bottom: 20px;">
              ${Array.from(
                new Set([
                  ...Object.keys(sdqPre?.subscaleScores || {}),
                  ...Object.keys(sdqPost?.subscaleScores || {}),
                ])
              )
                .map((dim) => {
                  const before = sdqPre?.subscaleScores?.[dim] ?? 0;
                  const after = sdqPost?.subscaleScores?.[dim] ?? 0;
                  const maxRaw = 10;
                  const beforePct = Math.round(
                    Math.max(0, Math.min(100, (before / maxRaw) * 100))
                  );
                  const afterPct = Math.round(
                    Math.max(0, Math.min(100, (after / maxRaw) * 100))
                  );
                  const delta = parseFloat((afterPct - beforePct).toFixed(2));
                  const deltaPositive = delta >= 0;

                  return `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border: 1px solid #cbd5e1;">
                    <div style="font-weight: 600; color: #1e293b; min-width: 160px;">${toTitleCaseLabel(
                      dim
                    )}</div>
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <span style="padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        Before: ${beforePct}%
                      </span>
                      <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 16px; font-size: 12px; font-weight: 600;">
                        After: ${afterPct}%
                      </span>
                      <span style="padding: 4px 12px; background: ${
                        deltaPositive ? "#dcfce7" : "#fed7d7"
                      }; color: ${
                    deltaPositive ? "#166534" : "#dc2626"
                  }; border-radius: 16px; font-size: 12px; font-weight: bold;">
                        ${deltaPositive ? "+" : ""}${delta}%
                      </span>
                    </div>
                  </div>
                `;
                })
                .join("")}
            </div>
            
            <!-- Overall SDQ -->
            <div style="padding-top: 20px; border-top: 2px solid #f59e0b;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; border: 1px solid #cbd5e1;">
                <div style="font-weight: 600; color: #1e293b; min-width: 160px;">Overall SDQ Score</div>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <span style="padding: 4px 12px; background: #f1f5f9; color: #475569; border-radius: 16px; font-size: 12px; font-weight: 600;">
                    Before: ${
                      sdqPre
                        ? Math.round(Math.min((sdqPre.score / 40) * 100, 100))
                        : "—"
                    }%
                  </span>
                  <span style="padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 16px; font-size: 12px; font-weight: 600;">
                    After: ${
                      sdqPost
                        ? Math.round(Math.min((sdqPost.score / 40) * 100, 100))
                        : "—"
                    }%
                  </span>
                  ${(() => {
                    const b = sdqPre
                      ? Math.min((sdqPre.score / 40) * 100, 100)
                      : 0;
                    const a = sdqPost
                      ? Math.min((sdqPost.score / 40) * 100, 100)
                      : 0;
                    const d = parseFloat((a - b).toFixed(2));
                    const pos = d >= 0;
                    return `
                      <span style="padding: 4px 12px; background: ${
                        pos ? "#dcfce7" : "#fed7d7"
                      }; color: ${
                      pos ? "#166534" : "#dc2626"
                    }; border-radius: 16px; font-size: 12px; font-weight: bold;">
                        ${pos ? "+" : ""}${d}%
                      </span>
                    `;
                  })()}
                </div>
              </div>
            </div>
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">🏅</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Strengths & Difficulties Assessments Not Completed</h3>
            <p style="color: #64748b; font-size: 14px;">Complete both pre and post SDQ assessments to view progress.</p>
          </div>
        `
        }
      </div>

      <!-- Before vs After Intervention -->
      <div style="margin-bottom: 40px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: bold; display: flex; align-items: center;">
          📋 Before vs After Intervention
        </h2>
        
        ${
          preInterventionAnswers && postInterventionAnswers
            ? `
          <div style="padding: 25px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px; text-align: left; font-weight: bold; color: #1e293b;">Question</th>
                  <th style="padding: 12px; text-align: center; font-weight: bold; color: #1e293b;">Before</th>
                  <th style="padding: 12px; text-align: center; font-weight: bold; color: #1e293b;">After</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(preInterventionAnswers)
                  .slice(0, 8)
                  .map(([key, beforeVal]: [string, any]) => {
                    const question = getPreQuestionLabelFromKey(key);
                    const postKey =
                      getCorrespondingPostKeyFromPreKey(key) || key;
                    const afterVal = postInterventionAnswers?.[postKey];
                    return `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px; color: #1e293b; line-height: 1.5;">${question}</td>
                      <td style="padding: 12px; text-align: center; font-weight: 600; color: #475569;">${beforeVal}</td>
                      <td style="padding: 12px; text-align: center; font-weight: 600; color: #475569;">
                        ${
                          typeof afterVal === "number" ||
                          typeof afterVal === "string"
                            ? afterVal
                            : "—"
                        }
                      </td>
                    </tr>
                  `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : `
          <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
            <h3 style="color: #64748b; font-size: 18px; margin-bottom: 12px;">Intervention Comparison Not Available</h3>
            <p style="color: #64748b; font-size: 14px;">Complete both pre-assessment and post-coaching to view side-by-side ratings.</p>
          </div>
        `
        }
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 50px; padding-top: 25px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 12px;">
        <p style="margin-bottom: 5px;">This report was generated as part of your career journey assessment.</p>
        <p style="margin: 0;">For questions or support, please contact our career guidance team.</p>
      </div>
    </div>
  `;
};
