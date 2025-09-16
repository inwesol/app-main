import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  upsertUserDemographics,
  completeUserSessionFormProgress,
  updateJourneyProgressAfterForm,
  getUserDemographics,
  getPreAssessment,
  upsertPreAssessment,
  upsertCareerMaturityAssessment,
  getCareerMaturityAssessment,
  getRiasecTest,
  getPersonalityTest,
  upsertPersonalityTest,
  getPsychologicalWellbeingTest,
  upsertPsychologicalWellbeingTest,
  upsertRiasecTest,
  upsertPostCareerMaturityAssessment,
  getPostCareerMaturityAssessment,
  getPostPsychologicalWellbeingTest,
  upsertPostPsychologicalWellbeingTest,
  getPostCoachingAssessment,
  upsertPostCoachingAssessment,
} from "@/lib/db/queries";
import { demographicsDetailsSchema } from "@/lib/schemas/questionnaire-schemas/demographics-details-form-schema";

function personalityTestScore() {
  const answerTextToValue: Record<string, number> = {
    "Strongly Disagree": 1,
    Disagree: 2,
    Neutral: 3,
    Agree: 4,
    "Strongly Agree": 5,
  };

  const reverseScoredQuestions = new Set([
    2, 6, 8, 9, 12, 18, 21, 23, 24, 27, 30, 31, 43, 37, 34, 35, 41,
  ]);

  const subscaleMap: Record<string, number[]> = {
    extraversion: [1, 6, 11, 16, 21, 26, 31, 36],
    agreeableness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
    conscientiousness: [3, 8, 13, 18, 23, 28, 33, 38, 43],
    neuroticism: [4, 9, 14, 19, 24, 29, 34, 39],
    openness: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44],
  };

  const questionTextToNumber: Record<string, number> = {
    "Is talkative": 1,
    "Tends to find fault with others": 2,
    "Does a thorough job": 3,
    "Is depressed, blue": 4,
    "Is original, comes up with new ideas": 5,
    "Is reserved": 6,
    "Is helpful and unselfish with others": 7,
    "Can be somewhat careless": 8,
    "Is relaxed, handles stress well": 9,
    "Is curious about many different things": 10,
    "Is full of energy": 11,
    "Starts quarrels with others": 12,
    "Is a reliable worker": 13,
    "Can be tense": 14,
    "Is ingenious, a deep thinker": 15,
    "Generates a lot of enthusiasm": 16,
    "Has a forgiving nature": 17,
    "Tends to be disorganized": 18,
    "Worries a lot": 19,
    "Has an active imagination": 20,
    "Tends to be quiet": 21,
    "Is generally trusting": 22,
    "Tends to be lazy": 23,
    "Is emotionally stable, not easily upset": 24,
    "Is inventive": 25,
    "Has an assertive personality": 26,
    "Can be cold and aloof": 27,
    "Perseveres until the task is finished": 28,
    "Can be moody": 29,
    "Values artistic, aesthetic experiences": 30,
    "Is sometimes shy, inhibited": 31,
    "Is considerate and kind to almost everyone": 32,
    "Does things efficiently": 33,
    "Remains calm in tense situations": 34,
    "Prefers work that is routine": 35,
    "Is outgoing, sociable": 36,
    "Is sometimes rude to others": 37,
    "Makes plans and follows through with them": 38,
    "Gets nervous easily": 39,
    "Likes to reflect, play with ideas": 40,
    "Has few artistic interests": 41,
    "Likes to cooperate with others": 42,
    "Is easily distracted": 43,
    "Is sophisticated in art, music, or literature": 44,
  };

  function reverseScore(value: number, maxScore = 5) {
    return maxScore + 1 - value;
  }

  return {
    answerTextToValue,
    reverseScoredQuestions,
    subscaleMap,
    questionTextToNumber,
    reverseScore,
  };
}

function psychologicalWellbeingScore() {
  const answerTextToValue: Record<string, number> = {
    "Strongly Agree": 1,
    "Somewhat Agree": 2,
    "A Little Agree": 3,
    Neutral: 4,
    "Neither Agree nor Disagree": 4,
    "A Little Disagree": 5,
    "Somewhat Disagree": 6,
    "Strongly Disagree": 7,
  };

  const reverseScoredQuestions = new Set([
    1, 2, 3, 4, 6, 7, 11, 13, 17, 20, 21, 22, 23, 27, 29, 31, 35, 36, 37, 38,
    40,
  ]);

  const subscaleMap: Record<string, number[]> = {
    autonomy: [1, 13, 24, 35, 41, 10, 21],
    environmentalMastery: [3, 15, 26, 36, 42, 12, 23],
    personalGrowth: [5, 17, 28, 37, 2, 14, 25],
    positiveRelations: [7, 18, 30, 38, 4, 16, 27],
    purposeInLife: [9, 20, 32, 39, 6, 29, 33],
    selfAcceptance: [11, 22, 34, 40, 8, 19, 31],
  };

  const questionTextToNumber: Record<string, number> = {
    "I am not afraid to voice my opinions, even when they are in opposition to the opinions of most people": 1,
    "For me, life has been a continuous process of learning, changing, and growth": 2,
    "In general, I feel I am in charge of the situation in which I live": 3,
    "People would describe me as a giving person, willing to share my time with others": 4,
    "I am not interested in activities that will expand my horizons": 5,
    "I enjoy making plans for the future and working to make them a reality": 6,
    "Most people see me as loving and affectionate": 7,
    "In many ways I feel disappointed about my achievements in life": 8,
    "I live life one day at a time and do not really think about the future": 9,
    "I tend to worry about what other people think of me": 10,
    "When I look at the story of my life, I am pleased with how things have turned out": 11,
    "I have difficulty arranging my life in a way that is satisfying to me": 12,
    "My decisions are not usually influenced by what everyone else is doing": 13,
    "I gave up trying to make big improvements or changes in my life a long time ago": 14,
    "The demands of everyday life often get me down": 15,
    "I have not experienced many warm and trusting relationships with others": 16,
    "I think it is important to have new experiences that challenge how you think about yourself and the world": 17,
    "Maintaining close relationships has been difficult and frustrating for me": 18,
    "My attitude about myself is probably not as positive as most people feel about themselves": 19,
    "I have a sense of direction and purpose in life": 20,
    "I judge myself by what I think is important, not by the values of what others think is important": 21,
    "In general, I feel confident and positive about myself": 22,
    "I have been able to build a living environment and a lifestyle for myself that is much to my liking": 23,
    "I tend to be influenced by people with strong opinions": 24,
    "I do not enjoy being in new situations that require me to change my old familiar ways of doing things": 25,
    "I do not fit very well with the people and the community around me": 26,
    "I know that I can trust my friends, and they know they can trust me": 27,
    "When I think about it, I have not really improved much as a person over the years": 28,
    "Some people wander aimlessly through life, but I am not one of them": 29,
    "I often feel lonely because I have few close friends with whom to share my concerns": 30,
    "When I compare myself to friends and acquaintances, it makes me feel good about who I am": 31,
    "I do not have a good sense of what it is I am trying to accomplish in life": 32,
    "I sometimes feel as if I have done all there is to do in life": 33,
    "I feel like many of the people I know have gotten more out of life than I have": 34,
    "I have confidence in my opinions, even if they are contrary to the general consensus": 35,
    "I am quite good at managing the many responsibilities of my daily life": 36,
    "I have the sense that I have developed a lot as a person over time": 37,
    "I enjoy personal and mutual conversations with family members and friends": 38,
    "My daily activities often seem trivial and unimportant to me": 39,
    "I like most parts of my personality": 40,
    "It is difficult for me to voice my own opinions on controversial matters": 41,
    "I often feel overwhelmed by my responsibilities": 42,
  };

  function reverseScore(value: number, points = 7) {
    return points + 1 - value;
  }

  return {
    answerTextToValue,
    reverseScoredQuestions,
    subscaleMap,
    questionTextToNumber,
    reverseScore,
  };
}
function riasecScore() {
  const categoryMapping: Record<
    string,
    | "realistic"
    | "investigative"
    | "artistic"
    | "social"
    | "enterprising"
    | "conventional"
  > = {
    // Map each statement text to its category exactly as in your questions array
    "I like to work on cars": "realistic",
    "I like to do puzzles": "investigative",
    "I am good at working independently": "investigative",
    "I like to work in teams": "social",
    "I am an ambitious person, I set goals for myself": "enterprising",
    "I like to organize things (files, desks/offices)": "conventional",
    "I like to build things": "realistic",
    "I like to read about art and music": "artistic",
    "I like to have clear instructions to follow": "conventional",
    "I like to try to influence or persuade people": "enterprising",
    "I like to do experiments": "investigative",
    "I like to teach or train people": "social",
    "I like trying to help people solve their problems": "social",
    "I like to take care of animals": "realistic",
    "I wouldn't mind working 8 hours per day in an office": "conventional",
    "I like selling things": "enterprising",
    "I enjoy creative writing": "artistic",
    "I enjoy science": "investigative",
    "I am quick to take on new responsibilities": "enterprising",
    "I am interested in healing people": "social",
    "I enjoy trying to figure out how things work": "investigative",
    "I like putting things together or assembling things": "realistic",
    "I am a creative person": "artistic",
    "I pay attention to details": "conventional",
    "I like to do filing or typing": "conventional",
    "I like to analyze things (problems/situations)": "investigative",
    "I like to play instruments or sing": "artistic",
    "I enjoy learning about other cultures": "social",
    "I would like to start my own business": "enterprising",
    "I like to cook": "realistic",
    "I like acting in plays": "artistic",
    "I am a practical person": "realistic",
    "I like working with numbers or charts": "conventional",
    "I like to get into discussions about issues": "social",
    "I am good at keeping records of my work": "conventional",
    "I like to lead": "enterprising",
    "I like working outdoors": "realistic",
    "I would like to work in an office": "conventional",
    "I'm good at math": "investigative",
    "I like helping people": "social",
    "I like to draw": "artistic",
    "I like to give speeches": "enterprising",
  };
  return categoryMapping;
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; qId: string }> }
) {
  console.log("get api working");
  const { qId, sessionId } = await params;
  console.log("qId: ", qId, "sessionId: ", sessionId);
  switch (qId) {
    case "demographics-details": {
      const session = await auth();
      if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });

      const details = await getUserDemographics(session.user.id);

      if (!details) return new NextResponse("Not found", { status: 404 });

      return NextResponse.json(details);
    }

    case "pre-assessment":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;

        // Debug logging
        console.log("Pre-assessment GET - Session ID:", sessionId);
        console.log("Pre-assessment GET - User ID:", session.user.id);

        // Validate sessionId
        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPreAssessment(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Pre-assessment not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not Found", { status: 404 });
        }

        console.log("Pre-assessment found:", data);

        // Return just the answers object that the frontend expects
        // Assuming your database returns { id, userId, sessionId, answers }
        // and you want to return just the answers part
        return NextResponse.json({
          answers: data.answers,
        });
      } catch (err) {
        console.error("Error fetching pre-assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;

        console.log("Career maturity GET - Session ID:", sessionId);
        console.log("Career maturity GET - User ID:", session.user.id);

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getCareerMaturityAssessment(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          console.log(
            "Career maturity assessment not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not found", { status: 404 });
        }

        console.log("Career maturity assessment found:", data);
        // Return the answers object that the frontend expects
        // Assuming your database returns { id, userId, sessionId, answers }
        return NextResponse.json(data.answers || data);
      } catch (error) {
        console.error("Error in career maturity GET:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "riasec-test":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getRiasecTest(session.user.id);

        if (!data) {
          return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({
          selectedAnswers: data.selectedAnswers,
          interestCode: data.interestCode,
          categoryCounts: data.categoryCounts,
        });
      } catch (err) {
        console.error("Error fetching riasec test:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "personality-test":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPersonalityTest(
          session.user.id /*, sessionIdNum*/
        );

        if (!data) {
          return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({
          answers: data.answers,
          score: data.score,
          subscaleScores: data.subscaleScores,
        });
      } catch (err) {
        console.error("Error fetching personality test:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "psychological-wellbeing":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPsychologicalWellbeingTest(
          session.user.id /*, sessionIdNum*/
        );

        if (!data) {
          return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({
          answers: data.answers,
          score: data.score,
          subscaleScores: data.subscaleScores,
        });
      } catch (err) {
        console.error("Error fetching psychological test:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;

        console.log("Post Career maturity GET - Session ID:", sessionId);
        console.log("Post Career maturity GET - User ID:", session.user.id);

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPostCareerMaturityAssessment(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          console.log(
            "Post Career maturity assessment not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not found", { status: 404 });
        }

        console.log("Post Career maturity assessment found:", data);
        // Return the answers object that the frontend expects
        // Assuming your database returns { id, userId, sessionId, answers }
        return NextResponse.json(data.answers || data);
      } catch (error) {
        console.error("Error in post career maturity GET:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-psychological-wellbeing":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPostPsychologicalWellbeingTest(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json({
          answers: data.answers,
          score: data.score,
          subscaleScores: data.subscaleScores,
        });
      } catch (err) {
        console.error("Error fetching post psychological wellbeing test:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-coaching":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;

        console.log("Post-coaching GET - Session ID:", sessionId);
        console.log("Post-coaching GET - User ID:", session.user.id);

        // Validate sessionId
        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const data = await getPostCoachingAssessment(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          console.log(
            "Post-coaching assessment not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not Found", { status: 404 });
        }

        console.log("Post-coaching assessment found:", data);

        // Return the answers object that the frontend expects
        return NextResponse.json({
          answers: data.answers,
        });
      } catch (err) {
        console.error("Error fetching post-coaching assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    default:
      return NextResponse.json({ error: "Unknown formId" }, { status: 404 });
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; qId: string }> }
) {
  const { qId, sessionId } = await params;
  switch (qId) {
    case "demographics-details": {
      const session = await auth();
      if (!session?.user?.id)
        return new NextResponse("Unauthorized", { status: 401 });
      const formData = await req.json();

      const validation = demographicsDetailsSchema.safeParse(formData);
      if (!validation.success) {
        return NextResponse.json(
          { errors: validation.error.format() },
          { status: 400 }
        );
      }
      const data = validation.data;

      await upsertUserDemographics(session.user.id, data);

      // await upsertUserDemographics(session.user.id, formData);
      await completeUserSessionFormProgress({
        userId: session.user.id,
        sessionId: Number(sessionId),
        qId,
      });
      await updateJourneyProgressAfterForm(session.user.id, Number(sessionId));

      return NextResponse.json({ success: true });
    }
    case "pre-assessment":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("server params: ", await params);
        const { sessionId, qId } = await params;
        const answers = await req.json();

        // Debug logging
        console.log("Pre-assessment POST - Session ID:", sessionId);
        console.log("Pre-assessment POST - User ID:", session.user.id);
        console.log("Pre-assessment POST - Answers:", answers);

        if (!answers || typeof answers !== "object") {
          return new NextResponse("Bad Request: Missing or invalid 'answers'", {
            status: 400,
          });
        }
        // Validate sessionId
        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }
        await upsertPreAssessment(session.user.id, sessionIdNum, answers);
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error inserting pre-assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;
        const answers = await req.json();

        console.log("Career maturity POST - Session ID:", sessionId);
        console.log("Career maturity POST - User ID:", session.user.id);
        console.log("Career maturity POST - Answers:", answers);

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        if (!answers || typeof answers !== "object") {
          return new NextResponse("Bad Request: Invalid answers format", {
            status: 400,
          });
        }

        if (Object.keys(answers).length === 0) {
          return new NextResponse("Bad Request: No answers provided", {
            status: 400,
          });
        }

        await upsertCareerMaturityAssessment(
          session.user.id,
          sessionIdNum,
          answers
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error in career maturity POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "personality-test":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;
        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const body = await req.json();
        const {
          answerTextToValue,
          reverseScoredQuestions,
          subscaleMap,
          questionTextToNumber,
          reverseScore,
        } = personalityTestScore();

        const { answers } = body;

        if (
          !answers ||
          typeof answers !== "object" ||
          Array.isArray(answers) ||
          Object.values(answers).some((v) => typeof v !== "string")
        ) {
          return new NextResponse("Bad Request: Invalid 'answers' format", {
            status: 400,
          });
        }

        // Prepare accumulators for sums and counts per subscale
        const subscaleSums: Record<string, number> = {
          extraversion: 0,
          agreeableness: 0,
          conscientiousness: 0,
          neuroticism: 0,
          openness: 0,
        };
        const subscaleCounts: Record<string, number> = {
          extraversion: 0,
          agreeableness: 0,
          conscientiousness: 0,
          neuroticism: 0,
          openness: 0,
        };

        // Process each answer
        for (const [qTextRaw, answerText] of Object.entries(answers)) {
          const qText = qTextRaw.trim();
          const qNum = questionTextToNumber[qText];
          if (!qNum) continue;
          const val = answerTextToValue[answerText as string];
          if (val === undefined) continue;

          const rev = reverseScoredQuestions.has(qNum)
            ? reverseScore(val, 7)
            : val;

          // Find the subscale to which this question belongs and accumulate
          for (const [subscale, questionNumbers] of Object.entries(
            subscaleMap
          )) {
            if (questionNumbers.includes(qNum)) {
              subscaleSums[subscale] += rev;
              subscaleCounts[subscale]++;
              break;
            }
          }
        }

        // // Calculate average scores per subscale
        // const subscaleScores: Record<string, number> = {};
        // for (const subscale in subscaleSums) {
        //   const count = subscaleCounts[subscale];
        //   subscaleScores[subscale] =
        //     count > 0 ? subscaleSums[subscale] / count : 0;
        // }

        // Optionally: overall score as average of subscales
        const overallScore =
          (Object.values(subscaleSums).reduce((acc, score) => acc + score, 0) /
            220) *
          100;

        // Save to database
        await upsertPersonalityTest(
          session.user.id,
          // sessionIdNum, // uncomment if supported
          overallScore,
          answers,
          subscaleSums
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({
          success: true,
          overallScore,
          subscaleSums,
        });
      } catch (error) {
        console.error("Error in personality test scoring:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "psychological-wellbeing":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }
        const {
          answerTextToValue,
          reverseScoredQuestions,
          subscaleMap,
          questionTextToNumber,
          reverseScore,
        } = psychologicalWellbeingScore();
        const body = await req.json();
        const { answers } = body;

        if (
          !answers ||
          typeof answers !== "object" ||
          Array.isArray(answers) ||
          Object.values(answers).some((v) => typeof v !== "string")
        ) {
          return new NextResponse("Bad Request: Invalid 'answers' format", {
            status: 400,
          });
        }

        // Initialize subscale accumulators
        const subscaleSums: Record<string, number> = {
          autonomy: 0,
          environmentalMastery: 0,
          personalGrowth: 0,
          positiveRelations: 0,
          purposeInLife: 0,
          selfAcceptance: 0,
        };
        // Calculate subscale scores
        for (const [qTextRaw, answerText] of Object.entries(answers)) {
          const qText = qTextRaw.trim();
          const qNum = questionTextToNumber[qText];
          if (!qNum) continue;
          const val = answerTextToValue[answerText as string];
          if (val === undefined) continue;

          const rev = reverseScoredQuestions.has(qNum)
            ? reverseScore(val, 7)
            : val;

          for (const [sub, questionNums] of Object.entries(subscaleMap)) {
            if (questionNums.includes(qNum)) {
              subscaleSums[sub] += rev;
            }
          }
        }

        const overallScore =
          (Object.values(subscaleSums).reduce((a, b) => a + b, 0) / 294) * 100;

        await upsertPsychologicalWellbeingTest(
          session.user.id,
          overallScore,
          answers,
          subscaleSums
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({
          success: true,
          subscaleSums,
          overallScore,
        });
      } catch (err) {
        console.error("Error in psychological wellbeing scoring:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "riasec-test":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        const body = await req.json();

        // Manual validation - check that selectedAnswers exists and is an array of strings
        if (
          !body ||
          typeof body !== "object" ||
          !Array.isArray(body.selectedAnswers) ||
          !body.selectedAnswers.every((ans: any) => typeof ans === "string")
        ) {
          return new NextResponse("Bad Request: Invalid input data", {
            status: 400,
          });
        }

        const selectedAnswers: string[] = body.selectedAnswers;

        // Initialize counts per RIASEC category
        const categoryCounts: Record<string, number> = {
          realistic: 0,
          investigative: 0,
          artistic: 0,
          social: 0,
          enterprising: 0,
          conventional: 0,
        };
        const categoryMapping = riasecScore();
        // Count selections per category
        for (const answer of selectedAnswers) {
          if (answer in categoryMapping) {
            const category = categoryMapping[answer];
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          }
        }

        // Determine top 3 categories by count
        // Sort categories descending by count
        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([category]) => category);

        const interestCode = sortedCategories
          .slice(0, 3)
          .map((c) => c[0].toUpperCase())
          .join("");

        await upsertRiasecTest(
          session.user.id,
          selectedAnswers,
          categoryCounts,
          interestCode
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({
          success: true,
          categoryCounts,
          interestCode,
        });
      } catch (err) {
        console.error("Error processing RIASEC test:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-career-maturity":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const { sessionId } = await params;
        const answers = await req.json();

        console.log("Post Career maturity POST - Session ID:", sessionId);
        console.log("Post Career maturity POST - User ID:", session.user.id);
        console.log("Post Career maturity POST - Answers:", answers);

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        if (!answers || typeof answers !== "object") {
          return new NextResponse("Bad Request: Invalid answers format", {
            status: 400,
          });
        }

        if (Object.keys(answers).length === 0) {
          return new NextResponse("Bad Request: No answers provided", {
            status: 400,
          });
        }

        await upsertPostCareerMaturityAssessment(
          session.user.id,
          sessionIdNum,
          answers
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error in post career maturity POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-psychological-wellbeing":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }
        const {
          answerTextToValue,
          reverseScoredQuestions,
          subscaleMap,
          questionTextToNumber,
          reverseScore,
        } = psychologicalWellbeingScore();
        const body = await req.json();
        const { answers } = body;

        if (
          !answers ||
          typeof answers !== "object" ||
          Array.isArray(answers) ||
          Object.values(answers).some((v) => typeof v !== "string")
        ) {
          return new NextResponse("Bad Request: Invalid 'answers' format", {
            status: 400,
          });
        }

        // Initialize subscale accumulators
        const subscaleSums: Record<string, number> = {
          autonomy: 0,
          environmentalMastery: 0,
          personalGrowth: 0,
          positiveRelations: 0,
          purposeInLife: 0,
          selfAcceptance: 0,
        };
        // Calculate subscale scores
        for (const [qTextRaw, answerText] of Object.entries(answers)) {
          const qText = qTextRaw.trim();
          const qNum = questionTextToNumber[qText];
          if (!qNum) continue;
          const val = answerTextToValue[answerText as string];
          if (val === undefined) continue;

          const rev = reverseScoredQuestions.has(qNum)
            ? reverseScore(val, 7)
            : val;

          for (const [sub, questionNums] of Object.entries(subscaleMap)) {
            if (questionNums.includes(qNum)) {
              subscaleSums[sub] += rev;
            }
          }
        }

        const overallScore =
          (Object.values(subscaleSums).reduce((a, b) => a + b, 0) / 294) * 100;

        await upsertPostPsychologicalWellbeingTest(
          session.user.id,
          sessionIdNum,
          overallScore,
          answers,
          subscaleSums
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );
        return NextResponse.json({
          success: true,
          subscaleSums,
          overallScore,
        });
      } catch (err) {
        console.error("Error in post psychological wellbeing scoring:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    case "post-coaching":
      try {
        const session = await auth();
        if (!session?.user?.id) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("server params: ", await params);
        const { sessionId, qId } = await params;
        const answers = await req.json();

        // Debug logging
        console.log("Post-coaching POST - Session ID:", sessionId);
        console.log("Post-coaching POST - User ID:", session.user.id);
        console.log("Post-coaching POST - Answers:", answers);

        if (!answers || typeof answers !== "object") {
          return new NextResponse("Bad Request: Missing or invalid 'answers'", {
            status: 400,
          });
        }

        // Validate sessionId
        const sessionIdNum = Number(sessionId);
        if (Number.isNaN(sessionIdNum)) {
          return new NextResponse("Bad Request: Invalid session ID", {
            status: 400,
          });
        }

        await upsertPostCoachingAssessment(
          session.user.id,
          sessionIdNum,
          answers
        );
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: Number(sessionId),
          qId,
        });
        await updateJourneyProgressAfterForm(
          session.user.id,
          Number(sessionId)
        );

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error inserting post-coaching assessment:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    default:
      return NextResponse.json({ error: "Unknown formId" }, { status: 404 });
  }
}
