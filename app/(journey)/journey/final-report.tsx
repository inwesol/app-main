"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Activity,
  BookOpen,
  User,
  MapPin,
  Briefcase,
  Award,
  MessageSquare,
  Sparkles,
  Grid3X3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/global/icons";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReportData {
  userId: string;
  currentSession: number;
  completedSessions: number[];
  totalScore: number;
  lastActiveDate: string;
  sessionProgress: Array<{
    id: number;
    title: string;
    status: "completed" | "current" | "locked";
    score?: number;
    completedDate?: string;
  }>;
  overallInsights: {
    strengths: string[];
    values: string[];
    areasForImprovement: string[];
    nextSteps: string[];
  };
  riasecData?: {
    interestCode: string;
    categoryCounts: Record<string, number>;
    topCategories: Array<{
      code: string;
      name: string;
      description: string;
      count: number;
      percentage: number;
      color: string;
    }>;
  };
}

// ── Static lookup tables (mirrors report-dialog.tsx) ──────────────────────────

const RIASEC_COLORS: Record<
  string,
  { bg: string; text: string; border: string; iconBg: string }
> = {
  R: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", iconBg: "#3b82f6" },
  I: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", iconBg: "#22c55e" },
  A: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff", iconBg: "#a855f7" },
  S: { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8", iconBg: "#ec4899" },
  E: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", iconBg: "#f97316" },
  C: { bg: "#f9fafb", text: "#374151", border: "#d1d5db", iconBg: "#6b7280" },
};

const RIASEC_DESCRIPTIONS: Array<{
  code: string;
  name: string;
  measurement: string;
  highScore: string;
}> = [
  {
    code: "R",
    name: "Realistic",
    measurement:
      "The Realistic dimension measures an individual's preference for practical, hands-on tasks involving physical objects, tools, machines, or animals.",
    highScore:
      "Individuals with a high score in the Realistic dimension tend to enjoy problem-solving that yields tangible results and often prefer working outdoors or with equipment. They are drawn to occupations requiring mechanical, athletic, or technical skills and clear, structured activities.",
  },
  {
    code: "I",
    name: "Investigative",
    measurement:
      "The Investigative dimension measures an individual's preference for analytical, intellectual, and scientific tasks that involve observing, learning, and solving abstract problems.",
    highScore:
      "Individuals with a high score in the Investigative dimension tend to enjoy exploring theories, conducting experiments, and analyzing data to understand complex phenomena.",
  },
  {
    code: "A",
    name: "Artistic",
    measurement:
      "The Artistic dimension measures an individual's preference for creative, expressive, and unstructured activities that allow for originality and imagination.",
    highScore:
      "Individuals with a high score in the Artistic dimension tend to enjoy writing, drawing, performing, and engaging in cultural or aesthetic experiences.",
  },
  {
    code: "S",
    name: "Social",
    measurement:
      "The Social dimension measures an individual's preference for interpersonal, helping, and collaborative activities centered on communication and empathy.",
    highScore:
      "Individuals with a high score in the Social dimension tend to enjoy teaching, mentoring, and supporting others in solving their problems. They prefer environments where they can interact, connect, and make a positive impact on people's lives.",
  },
  {
    code: "E",
    name: "Enterprising",
    measurement:
      "The Enterprising dimension measures an individual's preference for persuasive, leadership, and goal-oriented activities that involve influencing and motivating others.",
    highScore:
      "Individuals with a high score in Enterprising tend to enjoy taking initiative, setting objectives, and driving projects or ventures forward. They may prefer roles in management, sales, entrepreneurship, and politics where they can lead and achieve results.",
  },
  {
    code: "C",
    name: "Conventional",
    measurement:
      "The Conventional dimension measures an individual's preference for structured, detail-oriented, and data-driven activities that involve organization and precision.",
    highScore:
      "Individuals with a high score in the Conventional dimension tend to enjoy tasks like filing, record-keeping, and working with numbers or charts, following established procedures. They prefer work environments that value reliability, consistency, and clear guidelines.",
  },
];

const PERSONALITY_TRAITS: Record<
  string,
  { name: string; description: string }
> = {
  extraversion: {
    name: "Extraversion",
    description:
      "The tendency to be outgoing, energetic, and seek social interaction and stimulation.",
  },
  agreeableness: {
    name: "Agreeableness",
    description:
      "The inclination to be cooperative, compassionate, and prioritize harmony in relationships.",
  },
  conscientiousness: {
    name: "Conscientiousness",
    description:
      "The degree to which someone is organized, disciplined, and goal-oriented in their behavior.",
  },
  neuroticism: {
    name: "Neuroticism",
    description:
      "The tendency to experience negative emotions like anxiety, worry, and emotional instability.",
  },
  openness: {
    name: "Openness",
    description:
      "The extent to which someone is curious, imaginative, and receptive to new experiences and ideas.",
  },
};

const BIG_FIVE_DESCRIPTIONS: Array<{
  key: string;
  name: string;
  definition: string;
  highScore: string;
}> = [
  {
    key: "openness",
    name: "Openness",
    definition:
      "Openness to Experience refers to the extent to which an individual is imaginative, curious, and open-minded.",
    highScore:
      "Individuals with a high score on openness tend to appreciate art, new ideas, creativity, and prefer variety and intellectual exploration.",
  },
  {
    key: "conscientiousness",
    name: "Conscientiousness",
    definition:
      "Conscientiousness refers to the extent to which an individual is organized, persistent, and goal-directed in behavior.",
    highScore:
      "Individuals with a high score on conscientiousness tend to be reliable, disciplined, thorough, and often good at planning, following rules, and completing tasks.",
  },
  {
    key: "extraversion",
    name: "Extraversion",
    definition:
      "Extraversion refers to the degree to which an individual is outgoing, energetic, and sociable.",
    highScore:
      "Individuals with a high score in extraversion tend to be talkative, assertive, enthusiastic, and enjoy being around others, often seeking out social stimulation and excitement.",
  },
  {
    key: "agreeableness",
    name: "Agreeableness",
    definition:
      "Agreeableness refers to the tendency to be compassionate, cooperative, and trusting toward others.",
    highScore:
      "Individuals with a high score on agreeableness tend to be warm, helpful, forgiving, and considerate, valuing getting along with others and showing empathy.",
  },
  {
    key: "neuroticism",
    name: "Neuroticism",
    definition:
      "Neuroticism refers to emotional stability and the tendency to experience negative emotions.",
    highScore:
      "Individuals with a high score on neuroticism tend to feel anxious, moody, tense, or vulnerable to stress, and may struggle with emotional regulation.",
  },
];

const CAREER_MATURITY_SCALES: Record<
  string,
  { name: string; description: string }
> = {
  Concern: {
    name: "Concern",
    description:
      "Degree of involvement and care about career decision-making versus apathy or indifference about the future.",
  },
  Curiosity: {
    name: "Curiosity",
    description:
      "Interest in exploring the world of work and understanding oneself in relation to career options.",
  },
  Confidence: {
    name: "Confidence",
    description:
      "Belief in one's ability to make career decisions and solve career-related problems.",
  },
  Consultation: {
    name: "Consultation",
    description:
      "Willingness to seek and use advice from others in career choices while maintaining independence.",
  },
};

const CAREER_MATURITY_DESCRIPTIONS: Array<{
  key: string;
  name: string;
  definition: string;
  highScore: string;
}> = [
  {
    key: "Concern",
    name: "Concern",
    definition:
      "Concern refers to an individual's awareness of the importance of career planning and their orientation toward the future. It reflects how much an individual thinks about, prepares for, and feels responsible for their career development.",
    highScore:
      "A high score on Concern indicates proactive engagement in planning for future career tasks. Concern is crucial for recognizing and preparing for career-related decisions and transitions.",
  },
  {
    key: "Curiosity",
    name: "Curiosity",
    definition:
      "Curiosity refers to how an individual seeks information about themselves and the world of work. It involves exploring career options, investigating job requirements, and reflecting on personal interests and values in relation to potential careers.",
    highScore:
      "A high score on Curiosity indicates active information-seeking and openness to new experiences.",
  },
  {
    key: "Confidence",
    name: "Confidence",
    definition:
      "Confidence refers to an individual's belief in their ability to make and implement career decisions successfully. It reflects self-assurance in overcoming obstacles, solving problems, and following through with career plans.",
    highScore:
      "A high score on Confidence indicates persistence in planning and executing career plans.",
  },
  {
    key: "Consultation",
    name: "Consultation",
    definition:
      "Consultation refers to the willingness to seek and utilize advice from others, such as parents, friends, teachers, or career counselors, during the career decision-making process. It reflects an individual's openness to external input and the value placed on collaborative decision-making.",
    highScore:
      "A high score on Consultation indicates a readiness to gather diverse perspectives and support.",
  },
];

const WELLBEING_SUBSCALES: Record<
  string,
  { name: string; description: string }
> = {
  autonomy: {
    name: "Autonomy",
    description:
      "Self-determination and independence; ability to resist social pressure and regulate behavior from within.",
  },
  environmentalMastery: {
    name: "Environmental Mastery",
    description:
      "Sense of competence in managing everyday life, activities, and surrounding circumstances.",
  },
  personalGrowth: {
    name: "Personal Growth",
    description:
      "Openness to new experiences and sense of continued development and potential.",
  },
  positiveRelations: {
    name: "Positive Relations",
    description:
      "Warm, trusting relationships with others; capacity for empathy, affection, and intimacy.",
  },
  purposeInLife: {
    name: "Purpose in Life",
    description:
      "Having goals and a sense of direction; feeling that life has meaning.",
  },
  selfAcceptance: {
    name: "Self-Acceptance",
    description:
      "Positive attitude toward oneself; acceptance of multiple aspects of self, including past life.",
  },
};

const WELLBEING_DESCRIPTIONS: Array<{
  key: string;
  name: string;
  definition: string;
  highScore: string;
}> = [
  {
    key: "autonomy",
    name: "Autonomy",
    definition:
      "Autonomy refers to the extent to which an individual experiences a sense of independence, self-determination, and resistance to social pressures.",
    highScore:
      "Individuals with a high score on Autonomy tend to be confident in their opinions, even when they differ from others, and are not overly concerned about the approval of others. Autonomy is helpful in understanding individuals' sense of internal control and self-reliance.",
  },
  {
    key: "environmentalMastery",
    name: "Environmental Mastery",
    definition:
      "Environmental Mastery refers to the extent to which an individual feels competent and is able to manage their environment and daily responsibilities effectively.",
    highScore:
      "Individuals with a high score on Environmental Mastery tend to feel in control of their surroundings, capable of creating living environments that suit their needs, and able to handle the demands of daily life. Environmental Mastery is helpful in understanding individuals' perceived ability to shape and manage their external world.",
  },
  {
    key: "personalGrowth",
    name: "Personal Growth",
    definition:
      "Personal Growth refers to an individual's sense of continued development, openness to new experiences, and the feeling of realizing their potential over time.",
    highScore:
      "Individuals with high scores on Personal Growth tend to be open to embracing new challenges and have a sense of improvement as a person. Personal Growth is helpful in understanding individuals' tendency towards continuous learning and self-improvement.",
  },
  {
    key: "positiveRelations",
    name: "Positive Relations with Others",
    definition:
      "Positive Relations with Others refers to an individual's relationships with others, including the ability to form close, trusting relationships and the capacity for empathy and affection.",
    highScore:
      "Individuals with high scores on Positive Relations with Others tend to have satisfying and supportive relationships characterized by trust, warmth, and mutual understanding. Positive Relations with Others are helpful in understanding individuals' tendency towards maintaining healthy relationships.",
  },
  {
    key: "purposeInLife",
    name: "Purpose in Life",
    definition:
      "Purpose in Life refers to the extent to which an individual has goals, a sense of direction, and a feeling that their life has meaning.",
    highScore:
      "Individuals with high scores on Purpose in Life tend to have a strong sense of purpose, a clear understanding of life goals, and a feeling that one's daily activities are meaningful and important. Purpose in Life is helpful in understanding individuals' sense of direction.",
  },
  {
    key: "selfAcceptance",
    name: "Self-Acceptance",
    definition:
      "Self-Acceptance refers to the degree to which individuals hold a positive attitude toward themselves, acknowledge both their strengths and weaknesses, and are satisfied with their past lives.",
    highScore:
      "Individuals with high scores on Self-Acceptance tend to have a positive view of themselves, acceptance of personal flaws, and satisfaction with their life history. Self-Acceptance is helpful in understanding how individuals view and accept themselves.",
  },
];

const SDQ_SUBSCALES: Record<string, { name: string; description: string }> = {
  emotionalSymptoms: {
    name: "Emotional Symptoms",
    description:
      "Anxiety, depression, somatic complaints, and emotional distress.",
  },
  conductProblems: {
    name: "Conduct Problems",
    description:
      "Behavioral problems such as lying, stealing, fighting, and temper.",
  },
  hyperactivityInattention: {
    name: "Hyperactivity/Inattention",
    description:
      "Restlessness, concentration difficulties, and impulsive behavior.",
  },
  peerProblems: {
    name: "Peer Problems",
    description:
      "Difficulties in getting along with other young people and being liked.",
  },
  prosocialBehavior: {
    name: "Prosocial Behavior",
    description:
      "Considerate behavior, sharing, and helping others; strengths in relationships.",
  },
};

const PRE_ASSESSMENT_QUESTIONS: string[] = [
  "How clear are your current career goals?",
  "How confident are you that you will achieve your career goals?",
  "How confident are you in your ability to overcome obstacles in your career?",
  "How would you rate your current level of stress related to work or personal life?",
  "How well do you understand your own thought patterns and behaviors?",
  "How satisfied are you with your current work-life balance?",
  "How satisfied are you with your current job and overall well-being?",
  "How ready are you to make changes in your professional or personal life?",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toTitleCaseLabel(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ")
    .trim();
}

function getPreQuestionLabel(key: string): string {
  if (key.startsWith("q")) {
    const idx = Number.parseInt(key.slice(1), 10) - 1;
    if (!Number.isNaN(idx) && PRE_ASSESSMENT_QUESTIONS[idx]) {
      return PRE_ASSESSMENT_QUESTIONS[idx];
    }
  }
  return key;
}

function getPostKey(key: string): string {
  if (key.startsWith("q")) return key;
  const idx = PRE_ASSESSMENT_QUESTIONS.findIndex((t) => t === key);
  return idx >= 0 ? `q${idx + 1}` : key;
}

// ── Journey Insights interfaces ───────────────────────────────────────────────

interface ProsConsData {
  pros: string;
  cons: {
    thought: string;
    emotions: string;
    behaviour: string;
  };
}

interface SummaryPortraitData {
  selfStatement: string;
  settingStatement: string;
  plotDescription: string;
  plotActivities: string;
  ableToBeStatement: string;
  placesWhereStatement: string;
  soThatStatement: string;
  mottoStatement: string;
}

interface StoryCell {
  id: string;
  content: string;
  createdAt: Date | string;
}

interface Storyboard {
  id: string;
  name: string;
  cells: StoryCell[];
  createdAt: Date | string;
}

// ── Main Component ────────────────────────────────────────────────────────────

interface FinalReportProps {
  fullName?: string;
}

export const FinalReport: React.FC<FinalReportProps> = ({
  fullName = "John Doe",
}) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── State (mirrors report-dialog.tsx) ──────────────────────────────
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [personalityData, setPersonalityData] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
  } | null>(null);
  const [careerMaturityPre, setCareerMaturityPre] = useState<{
    insights?: { score?: Record<string, number> };
  } | null>(null);
  const [careerMaturityPost, setCareerMaturityPost] = useState<{
    insights?: { score?: Record<string, number> };
  } | null>(null);
  const [wellbeingPre, setWellbeingPre] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
  } | null>(null);
  const [wellbeingPost, setWellbeingPost] = useState<{
    score: string;
    subscaleScores: Record<string, number>;
  } | null>(null);
  const [sdqPre, setSdqPre] = useState<{
    score: number;
    subscaleScores: Record<string, number>;
  } | null>(null);
  const [sdqPost, setSdqPost] = useState<{
    score: number;
    subscaleScores: Record<string, number>;
  } | null>(null);
  const [preInterventionAnswers, setPreInterventionAnswers] = useState<Record<
    string,
    number
  > | null>(null);
  const [postInterventionAnswers, setPostInterventionAnswers] = useState<Record<
    string,
    number | string
  > | null>(null);

  // ── Journey Insights state ──────────────────────────────────────────
  const [insightValues, setInsightValues] = useState<string[]>([]);
  const [insightStrengths, setInsightStrengths] = useState<string[]>([]);
  const [insightProsCons, setInsightProsCons] = useState<ProsConsData>({
    pros: "",
    cons: { thought: "", emotions: "", behaviour: "" },
  });
  const [insightRewrittenStory, setInsightRewrittenStory] =
    useState<string>("");
  const [insightSummaryPortrait, setInsightSummaryPortrait] =
    useState<SummaryPortraitData>({
      selfStatement: "",
      settingStatement: "",
      plotDescription: "",
      plotActivities: "",
      ableToBeStatement: "",
      placesWhereStatement: "",
      soThatStatement: "",
      mottoStatement: "",
    });
  const [insightStoryboard, setInsightStoryboard] = useState<Storyboard | null>(
    null,
  );

  // ── Journey Insights loaders ────────────────────────────────────────
  const loadInsightValues = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/journey/sessions/1/a/career-story-1/insights`,
      );
      if (res.ok) {
        const d = await res.json();
        setInsightValues(d.insights?.values || []);
      }
    } catch {}
  }, []);

  const loadInsightStrengths = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/journey/sessions/3/a/career-story-2/insights`,
      );
      if (res.ok) {
        const d = await res.json();
        setInsightStrengths(d.insights?.values || []);
      }
    } catch {}
  }, []);

  const loadInsightProsCons = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/journey/sessions/2/a/my-life-collage/insights`,
      );
      if (res.ok) {
        const d = await res.json();
        const ins = d.insights || {};
        setInsightProsCons({
          pros: ins.pros || "",
          cons: {
            thought: ins.cons?.thought || "",
            emotions: ins.cons?.emotions || "",
            behaviour: ins.cons?.behaviour || "",
          },
        });
      }
    } catch {}
  }, []);

  const loadInsightRewrittenStory = useCallback(async () => {
    try {
      const res = await fetch(`/api/journey/sessions/5/a/career-story-4`);
      if (res.ok) {
        const d = await res.json();
        setInsightRewrittenStory(d.rewrittenStory || "");
      }
    } catch {}
  }, []);

  const loadInsightSummaryPortrait = useCallback(async () => {
    try {
      const res = await fetch(`/api/journey/sessions/4/a/career-story-3`);
      if (res.ok) {
        const d = await res.json();
        setInsightSummaryPortrait({
          selfStatement: d.selfStatement || "",
          settingStatement: d.settingStatement || "",
          plotDescription: d.plotDescription || "",
          plotActivities: d.plotActivities || "",
          ableToBeStatement: d.ableToBeStatement || "",
          placesWhereStatement: d.placesWhereStatement || "",
          soThatStatement: d.soThatStatement || "",
          mottoStatement: d.mottoStatement || "",
        });
      }
    } catch {}
  }, []);

  const loadInsightStoryboard = useCallback(async () => {
    try {
      const res = await fetch(`/api/journey/sessions/7/a/career-story-6`);
      if (res.ok) {
        const d = await res.json();
        if (d.storyboard_data) {
          const parsed: Storyboard = {
            ...d.storyboard_data,
            createdAt: d.storyboard_data.createdAt
              ? new Date(d.storyboard_data.createdAt)
              : new Date(),
            cells: (d.storyboard_data.cells || []).map((cell: StoryCell) => ({
              ...cell,
              createdAt: cell.createdAt ? new Date(cell.createdAt) : new Date(),
            })),
          };
          setInsightStoryboard(parsed);
        }
      }
    } catch {}
  }, []);

  // ── Fetch (same endpoints as report-dialog.tsx) ────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
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

        if (reportRes.ok) setReportData(await reportRes.json());
        if (personalityRes.ok) setPersonalityData(await personalityRes.json());
        if (preCMRes.ok) setCareerMaturityPre(await preCMRes.json());
        if (postCMRes.ok) setCareerMaturityPost(await postCMRes.json());
        if (wpreRes.ok) setWellbeingPre(await wpreRes.json());
        if (wpostRes.ok) setWellbeingPost(await wpostRes.json());
        if (sdqPreRes.ok) setSdqPre(await sdqPreRes.json());
        if (sdqPostRes.ok) setSdqPost(await sdqPostRes.json());
        if (preInterventionRes.ok) {
          const d = await preInterventionRes.json();
          setPreInterventionAnswers(d?.answers ?? null);
        }
        if (postInterventionRes.ok) {
          const d = await postInterventionRes.json();
          setPostInterventionAnswers(d?.answers ?? null);
        }
      } catch {
        // Silently ignore – component still renders with null data
      }
    };
    fetchAll();
    Promise.all([
      loadInsightValues(),
      loadInsightStrengths(),
      loadInsightProsCons(),
      loadInsightRewrittenStory(),
      loadInsightSummaryPortrait(),
      loadInsightStoryboard(),
    ]);
  }, [
    loadInsightValues,
    loadInsightStrengths,
    loadInsightProsCons,
    loadInsightRewrittenStory,
    loadInsightSummaryPortrait,
    loadInsightStoryboard,
  ]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div
      id="pdf-content"
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#1a202c",
        background: "#ffffff",
        maxWidth: "800px",
        margin: "0 auto",
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      {/* ── PDF Header (hidden in DOM, revealed in clone before export) ── */}
      <div
        id="pdf-header"
        className="hidden"
        style={{
          background: "#ffffff",
          padding: "20px 40px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "4px solid #00B24B",
          //   borderTop: "4px solid #00B24B",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <Icons.logoWithText width={140} height={34} />
          <div style={{ color: "#6b7280", fontSize: "10px", marginTop: "2px" }}>
            Empowering Careers, Transforming Lives
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{ color: "#00B24B", fontSize: "13px", fontWeight: "600" }}
          >
            Coaching Journey Report
          </div>
          <div style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px" }}>
            Confidential · {today}
          </div>
        </div>
      </div>

      {/* ── Report Body ──────────────────────────────────────────────── */}
      <div style={{ padding: "32px 44px 40px" }}>
        {/* Title */}
        <div
          style={{
            borderLeft: "5px solid #1b6ca8",
            paddingLeft: "16px",
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0f4c75",
              margin: "0 0 4px",
            }}
          >
            Coaching Journey Report
          </h1>
          <p style={{ margin: 0, color: "#4a5568", fontSize: "13px" }}>
            Prepared for:{" "}
            <strong style={{ color: "#1a202c" }}>{fullName}</strong>
            &nbsp;·&nbsp;Date: {today}
          </p>
        </div>

        {/* ── 1. Career Interest Profile (RIASEC) ──────────────────── */}
        <InterpretationGuidelines />
        <PdfSection title="Career Interest Profile">
          {reportData?.riasecData ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {reportData.riasecData.topCategories.map((cat) => {
                const colors = RIASEC_COLORS[cat.code] ?? RIASEC_COLORS.C;
                return (
                  <div
                    key={cat.code}
                    style={{
                      flex: "1 1 220px",
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      padding: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: colors.iconBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "13px",
                          flexShrink: 0,
                        }}
                      >
                        {cat.code}
                      </div>
                      <span
                        style={{
                          fontWeight: "700",
                          color: colors.text,
                          fontSize: "13px",
                        }}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "11px",
                        color: "#4a5568",
                        lineHeight: "1.5",
                      }}
                    >
                      {cat.description}
                    </p>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#718096",
                        marginBottom: "4px",
                      }}
                    >
                      <span>Percentage </span>
                      <span style={{ fontWeight: "700", color: colors.text }}>
                        {cat.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${cat.percentage}%`,
                          background: colors.iconBg,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NotCompleted
              label="Interest Assessment Not Completed"
              note="Complete the RIASEC interest assessment to discover your career interest profile."
            />
          )}

          {/* ── RIASEC dimension descriptions (always shown, kept on one page) ── */}
          <div className="html2pdf__page-break" />
          <div
            style={{
              marginTop: "20px",
              breakInside: "avoid",
              pageBreakInside: "avoid",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Block title */}
            <div
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0f4c75",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Explanation of Dimensions
              </h3>
            </div>

            {/* All six dimensions in one unified block */}
            <div style={{ padding: "0 16px" }}>
              {RIASEC_DESCRIPTIONS.map((dim, idx) => {
                const colors = RIASEC_COLORS[dim.code] ?? RIASEC_COLORS.C;
                const isLast = idx === RIASEC_DESCRIPTIONS.length - 1;
                return (
                  <div
                    key={dim.code}
                    style={{
                      padding: "12px 0",
                      borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                    }}
                  >
                    {/* Dimension header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "6px",
                      }}
                    >
                      <span
                        style={{
                          background: colors.iconBg,
                          color: "#ffffff",
                          fontWeight: "700",
                          fontSize: "11px",
                          borderRadius: "4px",
                          padding: "2px 7px",
                          flexShrink: 0,
                        }}
                      >
                        {dim.code}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "13px",
                          color: "#1a202c",
                        }}
                      >
                        {dim.name}
                      </span>
                    </div>
                    {/* Measurement */}
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: "1.55",
                      }}
                    >
                      {dim.measurement}
                    </p>
                    {/* High-score behaviour */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: "1.55",
                        fontStyle: "italic",
                      }}
                    >
                      {dim.highScore}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Source note */}
            <div
              style={{
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Note: The above content is written based on the test content of
                the RIASEC inventory.
              </p>
            </div>
          </div>
        </PdfSection>

        <PdfDivider />

        {/* ── 2. Personality Assessment ─────────────────────────────── */}
        <div className="html2pdf__page-break" />
        <InterpretationGuidelines />
        <PdfSection title="Personality Assessment">
          {personalityData ? (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {Object.entries(personalityData.subscaleScores).map(
                  ([trait, rawScore]) => {
                    const pct = Math.round(rawScore);
                    const info = PERSONALITY_TRAITS[trait] ?? {
                      name: trait.charAt(0).toUpperCase() + trait.slice(1),
                      description: "",
                    };
                    return (
                      <div
                        key={trait}
                        style={{
                          flex: "1 1 340px",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "600",
                              color: "#1a202c",
                              fontSize: "13px",
                            }}
                          >
                            {info.name}
                          </div>
                          {info.description && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#718096",
                                marginTop: "2px",
                                lineHeight: "1.4",
                              }}
                            >
                              {info.description}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            width: "1px",
                            alignSelf: "stretch",
                            background: "#e2e8f0",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontWeight: "700",
                            color: "#2563eb",
                            fontSize: "14px",
                            paddingLeft: "12px",
                            flexShrink: 0,
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  },
                )}
              </div>

              <div
                style={{
                  borderTop: "1px solid #bbf7d0",
                  marginTop: "12px",
                  paddingTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1a202c",
                      fontSize: "13px",
                    }}
                  >
                    Overall Personality Score:
                  </span>
                  <span
                    style={{
                      fontWeight: "700",
                      color: "#2563eb",
                      fontSize: "16px",
                    }}
                  >
                    {Math.round(Number.parseFloat(personalityData.score))}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <NotCompleted
              label="Personality Assessment Not Completed"
              note="Complete the personality assessment to view your overall and subscale scores."
            />
          )}

          {/* ── Big Five dimension descriptions (always shown, kept on one page) ── */}
          <div className="html2pdf__page-break" />
          <div
            style={{
              marginTop: "20px",
              breakInside: "avoid",
              pageBreakInside: "avoid",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {/* Block title */}
            <div
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0f4c75",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Explanation of Dimensions
              </h3>
            </div>

            {/* All five traits in one unified block */}
            <div style={{ padding: "0 16px" }}>
              {BIG_FIVE_DESCRIPTIONS.map((trait, idx) => {
                const isLast = idx === BIG_FIVE_DESCRIPTIONS.length - 1;
                return (
                  <div
                    key={trait.key}
                    style={{
                      padding: "12px 0",
                      borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#1a202c",
                        marginBottom: "5px",
                      }}
                    >
                      {trait.name}
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: "1.55",
                      }}
                    >
                      {trait.definition}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: "1.55",
                        fontStyle: "italic",
                      }}
                    >
                      {trait.highScore}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Source note */}
            <div
              style={{
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Note: The above content is written based on the test content of
                the BIG FIVE inventory and the well-researched source:{" "}
                <span style={{ color: "#6b7280" }}>
                  https://www.explorepsychology.com/big-five-personality-traits/
                </span>
              </p>
            </div>
          </div>
        </PdfSection>

        <PdfDivider />

        {/* ── 3. Career Maturity Progress ───────────────────────────── */}
        <div className="html2pdf__page-break" />
        <InterpretationGuidelines />
        <PdfSection title="Career Maturity Progress">
          {careerMaturityPre?.insights?.score &&
          careerMaturityPost?.insights?.score ? (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <BeforeAfterRows
                preScores={careerMaturityPre.insights.score}
                postScores={careerMaturityPost.insights.score}
                labels={CAREER_MATURITY_SCALES}
                toLabel={toTitleCaseLabel}
              />
            </div>
          ) : (
            <NotCompleted
              label="Career Maturity Assessments Not Completed"
              note="Complete both Career Maturity Assessment-1 and Career Maturity Assessment-2 to view your progress."
            />
          )}

          {/* ── Career Maturity dimension descriptions ── */}
          <div className="html2pdf__page-break" />
          <div
            style={{
              marginTop: "20px",
              breakInside: "avoid",
              pageBreakInside: "avoid",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0f4c75",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Explanation of Dimensions
              </h3>
            </div>

            <div style={{ padding: "0 16px" }}>
              {CAREER_MATURITY_DESCRIPTIONS.map((dim, idx) => {
                const isLast = idx === CAREER_MATURITY_DESCRIPTIONS.length - 1;
                return (
                  <div
                    key={dim.key}
                    style={{
                      padding: "12px 0",
                      borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#1a202c",
                        marginBottom: "5px",
                      }}
                    >
                      {dim.name}
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: "1.55",
                      }}
                    >
                      {dim.definition}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: "1.55",
                        fontStyle: "italic",
                      }}
                    >
                      {dim.highScore}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "10px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Note: The above content is written based on the well-researched
                sources: <br />
                <span style={{ color: "#6b7280" }}>
                  https://www.atlantis-press.com/article/25873513.pdf
                </span>
                <br />
                <span style={{ color: "#6b7280" }}>
                  https://www.sralab.org/rehabilitation-measures/career-maturity-inventory
                </span>
              </p>
            </div>
          </div>
        </PdfSection>

        <PdfDivider />

        {/* ── 4. Psychological Wellbeing Progress ───────────────────── */}
        <div className="html2pdf__page-break" />
        <InterpretationGuidelines />
        <PdfSection title="Psychological Wellbeing Progress">
          {wellbeingPre && wellbeingPost ? (
            <div
              style={{
                background: "#fdf2f8",
                border: "1px solid #fbcfe8",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <BeforeAfterRows
                preScores={wellbeingPre.subscaleScores}
                postScores={wellbeingPost.subscaleScores}
                labels={WELLBEING_SUBSCALES}
                toLabel={toTitleCaseLabel}
                maxRaw={49}
              />
              {/* Overall */}
              <div
                style={{
                  borderTop: "1px solid #fbcfe8",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                <ScoreRow
                  label="Overall Wellbeing Score"
                  description=""
                  before={Math.round(Number.parseFloat(wellbeingPre.score))}
                  after={Math.round(Number.parseFloat(wellbeingPost.score))}
                />
              </div>
            </div>
          ) : (
            <NotCompleted
              label="Psychological Wellbeing Assessments Not Completed"
              note="Complete both Psychological Wellbeing Assessment-1 and Assessment-2 to view your progress."
            />
          )}

          {/* ── Wellbeing dimension descriptions ── */}
          <div className="html2pdf__page-break" />
          <div
            style={{
              marginTop: "20px",
              breakInside: "avoid",
              pageBreakInside: "avoid",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0f4c75",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Explanation of Dimensions
              </h3>
            </div>

            <div style={{ padding: "0 16px" }}>
              {WELLBEING_DESCRIPTIONS.map((dim, idx) => {
                const isLast = idx === WELLBEING_DESCRIPTIONS.length - 1;
                return (
                  <div
                    key={dim.key}
                    style={{
                      padding: "12px 0",
                      borderBottom: isLast ? "none" : "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "13px",
                        color: "#1a202c",
                        marginBottom: "5px",
                      }}
                    >
                      {dim.name}
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: "1.55",
                      }}
                    >
                      {dim.definition}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: "1.55",
                        fontStyle: "italic",
                      }}
                    >
                      {dim.highScore}
                    </p>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderTop: "1px solid #e2e8f0",
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "10px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                }}
              >
                Note: The above content is written based on the test content of
                the Ryff Scales of Psychological Well-being and the following
                sources:
              </p>
              {/* <p
                style={{
                  margin: "0 0 3px",
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                Ryff, C., Almeida, D. M., et al. (2010). National Survey of
                Midlife Development in the United States (MIDUS II), 2004-2006:
                Documentation of psychosocial constructs and composite variables
                in MIDUS II Project 1. Ann Arbor, MI: Inter-university
                Consortium for Political and Social Research.
              </p> */}
              <p style={{ margin: 0, fontSize: "10px", color: "#6b7280" }}>
                Ryff, C. D. (1989). Happiness is everything, or is it?
                Explorations on the meaning of psychological well-being.{" "}
                <span style={{ fontStyle: "italic" }}>
                  Journal of Personality and Social Psychology, 57
                </span>
                (6), 1069–1081.
              </p>
            </div>
          </div>
        </PdfSection>

        <PdfDivider />

        {/* ── 5. Strengths & Difficulties Progress ─────────────────── */}
        <div className="html2pdf__page-break" />
        <InterpretationGuidelines />
        <PdfSection title="Strengths & Difficulties Progress">
          {sdqPre && sdqPost ? (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <BeforeAfterRows
                preScores={sdqPre.subscaleScores}
                postScores={sdqPost.subscaleScores}
                labels={SDQ_SUBSCALES}
                toLabel={toTitleCaseLabel}
                maxRaw={10}
              />
              {/* Overall */}
              <div
                style={{
                  borderTop: "1px solid #fde68a",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              >
                <ScoreRow
                  label="Overall SDQ Score"
                  description=""
                  before={Math.round(Math.min((sdqPre.score / 40) * 100, 100))}
                  after={Math.round(Math.min((sdqPost.score / 40) * 100, 100))}
                />
              </div>
            </div>
          ) : (
            <NotCompleted
              label="Strengths & Difficulties Assessments Not Completed"
              note="Complete both SDQ Assessment-1 and Assessment-2 to view your progress."
            />
          )}
        </PdfSection>

        <PdfDivider />

        {/* ── 6. Before vs After Intervention ──────────────────────── */}
        <div className="html2pdf__page-break" />
        <InterpretationGuidelines />
        <PdfSection title="Before vs After Intervention">
          {preInterventionAnswers && postInterventionAnswers ? (
            <div
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        color: "#4a5568",
                        fontWeight: "600",
                        borderBottom: "2px solid #e2e8f0",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Question
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 14px",
                        color: "#4a5568",
                        fontWeight: "600",
                        borderBottom: "2px solid #e2e8f0",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Before
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "10px 14px",
                        color: "#4a5568",
                        fontWeight: "600",
                        borderBottom: "2px solid #e2e8f0",
                        fontSize: "11px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      After
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(preInterventionAnswers)
                    .slice(0, 8)
                    .map(([key, beforeVal], i) => {
                      const question = getPreQuestionLabel(key);
                      const postKey = getPostKey(key);
                      const afterVal = postInterventionAnswers?.[postKey];
                      return (
                        <tr
                          key={key}
                          style={{
                            background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px 14px",
                              color: "#1a202c",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            {question}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#2d3748",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            {beforeVal}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#2d3748",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            {typeof afterVal === "number" ||
                            typeof afterVal === "string"
                              ? afterVal
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <NotCompleted
              label="Intervention Comparison Not Available"
              note="Complete both Baseline Assessment and Finish-line Assessment to view your intervention progress."
            />
          )}
        </PdfSection>

        <PdfDivider />

        {/* ── 7. My Journey Insights ────────────────────────────────── */}
        <div className="html2pdf__page-break" />
        <div className="mt-12" />
        <PdfSection title="My Journey Insights">
          <div className="space-y-12">
            {/* My Summary Portrait */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="size-5 text-indigo-600" />
                My Summary Portrait
              </h3>
              {!insightSummaryPortrait.selfStatement &&
              !insightSummaryPortrait.settingStatement &&
              !insightSummaryPortrait.plotDescription &&
              !insightSummaryPortrait.plotActivities &&
              !insightSummaryPortrait.ableToBeStatement &&
              !insightSummaryPortrait.placesWhereStatement &&
              !insightSummaryPortrait.soThatStatement &&
              !insightSummaryPortrait.mottoStatement ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No summary portrait available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the My Story-3 activity to add your summary
                    portrait.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {insightSummaryPortrait.mottoStatement && (
                    <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <Sparkles className="size-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                          Motto Statement
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.mottoStatement}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.selfStatement && (
                    <div className="flex items-start gap-3 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                      <User className="size-4 text-pink-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-pink-700 uppercase tracking-wide">
                          Self Statement
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.selfStatement}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.settingStatement && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <MapPin className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                          Setting
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.settingStatement}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.plotDescription && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <BookOpen className="size-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                          Plot Description
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.plotDescription}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="html2pdf__page-break" />
                  <div className="mt-12" />
                  {insightSummaryPortrait.plotActivities && (
                    <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                      <Briefcase className="size-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                          Plot Activities
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.plotActivities}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.ableToBeStatement && (
                    <div className="flex items-start gap-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                      <Award className="size-4 text-violet-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">
                          Able To Be
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.ableToBeStatement}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.placesWhereStatement && (
                    <div className="flex items-start gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                      <MapPin className="size-4 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
                          Places Where
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.placesWhereStatement}
                        </p>
                      </div>
                    </div>
                  )}
                  {insightSummaryPortrait.soThatStatement && (
                    <div className="flex items-start gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                      <MessageSquare className="size-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                          So That
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mt-0.5">
                          {insightSummaryPortrait.soThatStatement}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* My Story Board */}
            <div className="html2pdf__page-break" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Grid3X3 className="size-5 text-indigo-600" />
                My Story Board
              </h3>
              {!insightStoryboard ||
              !insightStoryboard.cells ||
              insightStoryboard.cells.length === 0 ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No storyboard available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the My Story-5 Final activity in session 8 to add
                    your storyboard.
                  </p>
                </div>
              ) : (
                <Card className="bg-slate-50 border border-slate-100 shadow-lg">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {insightStoryboard.cells.map((cell: StoryCell) => (
                        <Card
                          key={cell.id}
                          className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg"
                        >
                          <CardContent className="p-4">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                              {cell.content || (
                                <span className="text-slate-400 italic">
                                  Empty cell
                                </span>
                              )}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* My Values */}
            <div className="html2pdf__page-break" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Heart className="size-5 text-primary-green-600" />
                My Values
              </h3>
              {insightValues.length === 0 ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No values available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the My Story-1 activity to add your values.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {insightValues.map((value) => (
                    <div
                      key={value}
                      className="flex items-center justify-center gap-2 p-2 border rounded-md bg-primary-green-50 border-primary-green-200"
                    >
                      <span className="text-base font-medium text-slate-700">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Strengths */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="size-5 text-purple-600" />
                My Strengths
              </h3>
              {insightStrengths.length === 0 ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No strengths available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the My Story-2 activity to add your strengths.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {insightStrengths.map((strength) => (
                    <div
                      key={strength}
                      className="flex items-center justify-center gap-2 p-2 border rounded-md bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                    >
                      <span className="text-base font-medium text-slate-700">
                        {strength}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Rewritten Story */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="size-5 text-blue-600" />
                My Rewritten Story
              </h3>
              {!insightRewrittenStory ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No rewritten story available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the My Story-4 activity to add your rewritten
                    story.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {insightRewrittenStory}
                  </p>
                </div>
              )}
            </div>

            {/* My Pros & Cons */}
            <div className="html2pdf__page-break" />
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ThumbsUp className="size-5 text-green-600" />
                My Pros &amp; Cons
              </h3>
              {!insightProsCons.pros &&
              !insightProsCons.cons.thought &&
              !insightProsCons.cons.emotions &&
              !insightProsCons.cons.behaviour ? (
                <div className="py-6 text-center text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm">No pros &amp; cons available yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete the life collage activity to add your pros &amp;
                    cons.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {insightProsCons.pros && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="size-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Pros
                        </span>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">
                          {insightProsCons.pros}
                        </p>
                      </div>
                    </div>
                  )}
                  {(insightProsCons.cons.thought ||
                    insightProsCons.cons.emotions ||
                    insightProsCons.cons.behaviour) && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="size-4 text-red-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Cons
                        </span>
                      </div>
                      {insightProsCons.cons.thought && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Brain className="size-3 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">
                              Thought
                            </span>
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {insightProsCons.cons.thought}
                            </p>
                          </div>
                        </div>
                      )}
                      {insightProsCons.cons.emotions && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Heart className="size-3 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">
                              Emotions
                            </span>
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {insightProsCons.cons.emotions}
                            </p>
                          </div>
                        </div>
                      )}
                      {insightProsCons.cons.behaviour && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Activity className="size-3 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">
                              Behaviour
                            </span>
                          </div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                              {insightProsCons.cons.behaviour}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </PdfSection>
      </div>

      {/* ── PDF Footer (hidden in DOM, revealed in clone before export) ── */}
      <div
        id="pdf-footer"
        className="hidden"
        style={{
          background: "#f7fafc",
          borderTop: "2px solid #e2e8f0",
          padding: "12px 44px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#718096", fontSize: "10px" }}>
          © {new Date().getFullYear()} Inwesol Global Pvt.Ltd · Confidential
        </span>
        <span style={{ color: "#718096", fontSize: "10px" }}>
          {fullName} · Coaching Journey Report · {today}
        </span>
      </div>
    </div>
  );
};

// ── Shared sub-components (inline-style only for PDF fidelity) ────────────────

const INTERPRETATION_GUIDELINES = [
  "The following descriptions are intended as a general guide to help you understand your assessment scores.",
  "These scores should not be viewed as definitive labels or limitations.",
  "Your scores and profile are unique to you, and these descriptions are simply starting points for self-reflection and exploration.",
  "Avoid making decisions based solely on these descriptions.",
  "Consider these scores as part of a broader process of self-discovery.",
];

const InterpretationGuidelines = () => (
  <div
    role="note"
    aria-label="Interpretation guidelines"
    style={{
      background: "#fefce8",
      border: "1px solid #fde68a",
      borderLeft: "4px solid #eab308",
      borderRadius: "8px",
      padding: "16px 20px",
      marginTop: "40px",
      marginBottom: "28px",
      color: "#374151",
      fontSize: "12px",
    }}
  >
    <h2
      style={{
        fontWeight: "700",
        fontSize: "14px",
        margin: "0 0 10px",
        color: "#1a202c",
      }}
    >
      Interpretation Guidelines
    </h2>
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {INTERPRETATION_GUIDELINES.map((item) => (
        <li
          key={item}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "8px",
            fontStyle: "italic",
            lineHeight: "1.5",
          }}
        >
          <span style={{ color: "#ca8a04", flexShrink: 0 }}>➤</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PdfSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div style={{ marginBottom: "24px", marginTop: "24px" }}>
    <h2
      style={{
        fontSize: "14px",
        fontWeight: "700",
        color: "#0f4c75",
        margin: "0 0 12px",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

const PdfDivider = () => (
  <hr
    style={{
      border: "none",
      borderTop: "1px solid #e2e8f0",
      margin: "0 0 24px",
    }}
  />
);

const NotCompleted: React.FC<{ label: string; note: string }> = ({
  label,
  note,
}) => (
  <div
    style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "20px",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontWeight: "600",
        color: "#4a5568",
        marginBottom: "6px",
        fontSize: "13px",
      }}
    >
      {label}
    </div>
    <div style={{ color: "#718096", fontSize: "12px" }}>{note}</div>
  </div>
);

/** Renders a list of Before / After / Delta rows for any subscale map. */
const BeforeAfterRows: React.FC<{
  preScores: Record<string, number>;
  postScores: Record<string, number>;
  labels: Record<string, { name: string; description: string }>;
  toLabel: (k: string) => string;
  maxRaw?: number;
}> = ({ preScores, postScores, labels, toLabel, maxRaw }) => {
  const keys = Array.from(
    new Set([...Object.keys(preScores), ...Object.keys(postScores)]),
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {keys.map((key) => {
        const rawBefore = preScores[key] ?? 0;
        const rawAfter = postScores[key] ?? 0;
        const before = maxRaw
          ? Math.round(Math.max(0, Math.min(100, (rawBefore / maxRaw) * 100)))
          : Math.round(rawBefore);
        const after = maxRaw
          ? Math.round(Math.max(0, Math.min(100, (rawAfter / maxRaw) * 100)))
          : Math.round(rawAfter);
        const info = labels[key] ?? { name: toLabel(key), description: "" };
        return (
          <ScoreRow
            key={key}
            label={info.name}
            description={info.description}
            before={before}
            after={after}
          />
        );
      })}
    </div>
  );
};

const ScoreRow: React.FC<{
  label: string;
  description: string;
  before: number;
  after: number;
}> = ({ label, description, before, after }) => {
  const delta = Number.parseFloat((after - before).toFixed(2));
  const positive = delta >= 0;
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: "600", color: "#1a202c", fontSize: "13px" }}>
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: "11px",
              color: "#718096",
              marginTop: "2px",
              lineHeight: "1.4",
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          width: "1px",
          alignSelf: "stretch",
          background: "#e2e8f0",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
          paddingLeft: "12px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <Badge bg="#f1f5f9" text="#374151" border="#cbd5e1">
          Before: {before}%
        </Badge>
        <Badge bg="#eff6ff" text="#1e40af" border="#bfdbfe">
          After: {after}%
        </Badge>
        <Badge
          bg={positive ? "#f0fdf4" : "#fff7ed"}
          text={positive ? "#15803d" : "#c2410c"}
          border={positive ? "#bbf7d0" : "#fed7aa"}
        >
          {positive ? "+" : ""}
          {delta}%
        </Badge>
      </div>
    </div>
  );
};

const Badge: React.FC<{
  bg: string;
  text: string;
  border: string;
  children: React.ReactNode;
}> = ({ bg, text, border, children }) => (
  <span
    style={{
      background: bg,
      color: text,
      border: `1px solid ${border}`,
      borderRadius: "12px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: "600",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);
