import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth"; // adjust path if needed
import { getPersonalityTest, upsertPersonalityTest } from "@/lib/db/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

    const data = await getPersonalityTest(session.user.id /*, sessionIdNum*/);

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({
      answers: data.answers,
      score: data.score,
    });
  } catch (err) {
    console.error("Error fetching personality test:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Map textual answer to numeric score (1 to 5 scale)
const answerTextToValue: Record<string, number> = {
  "Strongly Disagree": 1,
  Disagree: 2,
  Neutral: 3,
  Agree: 4,
  "Strongly Agree": 5,
};

// Reverse-scored question numbers for your BFI
const reverseScoredQuestions = new Set([6, 12, 18, 22, 27, 30, 34, 37, 41, 44]);

// BFI subscale mapping: question numbers associated to factor
const subscaleMap: Record<string, number[]> = {
  extraversion: [1, 6, 11, 16, 21, 26, 31, 36],
  agreeableness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
  conscientiousness: [3, 8, 13, 18, 23, 28, 33, 38, 43],
  neuroticism: [4, 9, 14, 19, 24, 29, 34, 39],
  openness: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44],
};

// Map your exact question texts to question numbers — fill with real frontend strings!
// You must ensure keys EXACTLY match the frontend question texts for correct mapping.
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

function reverseScore(value: number, maxScore: number = 5): number {
  return maxScore + 1 - value;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sessionId } = await params;
    const sessionIdNum = Number(sessionId);
    if (isNaN(sessionIdNum)) {
      return new NextResponse("Bad Request: Invalid session ID", {
        status: 400,
      });
    }

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
    for (const [questionTextRaw, answerText] of Object.entries(answers)) {
      const questionText = questionTextRaw.trim();
      const questionNumber = questionTextToNumber[questionText];
      if (!questionNumber) {
        // Ignore unknown questions
        continue;
      }

      const numericValue = answerTextToValue[answerText];
      if (numericValue === undefined) {
        // Ignore unknown answers
        continue;
      }

      // Apply reverse scoring if necessary
      const finalValue = reverseScoredQuestions.has(questionNumber)
        ? reverseScore(numericValue, 5)
        : numericValue;

      // Find the subscale to which this question belongs and accumulate
      for (const [subscale, questionNumbers] of Object.entries(subscaleMap)) {
        if (questionNumbers.includes(questionNumber)) {
          subscaleSums[subscale] += finalValue;
          subscaleCounts[subscale]++;
          break;
        }
      }
    }

    // Calculate average scores per subscale
    const subscaleScores: Record<string, number> = {};
    for (const subscale in subscaleSums) {
      const count = subscaleCounts[subscale];
      subscaleScores[subscale] = count > 0 ? subscaleSums[subscale] / count : 0;
    }

    // Optionally: overall score as average of subscales
    const overallScore =
      Object.values(subscaleScores).reduce((acc, score) => acc + score, 0) /
      Object.keys(subscaleScores).length;

    // Save to database
    await upsertPersonalityTest(
      session.user.id,
      // sessionIdNum, // uncomment if supported
      overallScore,
      answers,
      subscaleScores
    );

    return NextResponse.json({ success: true, overallScore, subscaleScores });
  } catch (error) {
    console.error("Error in personality test scoring:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
