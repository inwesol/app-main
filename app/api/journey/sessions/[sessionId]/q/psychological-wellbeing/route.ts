import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth"; // adjust path if needed
import {
  getPsychologicalWellbeingTest,
  upsertPsychologicalWellbeingTest,
} from "@/lib/db/queries";

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

    const data = await getPsychologicalWellbeingTest(
      session.user.id /*, sessionIdNum*/
    );

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({
      answers: data.answers,
      score: data.score,
    });
  } catch (err) {
    console.error("Error fetching psychological test:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { sessionId: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session?.user?.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const { sessionId } = await params;
//     const sessionIdNum = Number(sessionId);
//     if (isNaN(sessionIdNum)) {
//       return new NextResponse("Bad Request: Invalid session ID", {
//         status: 400,
//       });
//     }

//     const body = await req.json();
//     const { answers, score } = body;

//     // Validate answers as an object with string keys and string values
//     if (
//       !answers ||
//       typeof answers !== "object" ||
//       Array.isArray(answers) ||
//       Object.values(answers).some((v) => typeof v !== "string")
//     ) {
//       return new NextResponse("Bad Request: Invalid 'answers' format", {
//         status: 400,
//       });
//     }

//     // Ensure score is a number, default 0 if missing
//     const validScore = typeof score === "number" ? score : 0;

//     await upsertPsychologicalWellbeingTest(
//       session.user.id,
//       /* sessionIdNum, */ validScore,
//       answers
//     );

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Error saving personality test:", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

// new api
// Map answer text → numeric score (1 to 7)
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

// Reverse-scored question numbers
const reverseScoredQuestions = new Set([
  1, 2, 3, 4, 6, 7, 11, 13, 17, 20, 21, 22, 23, 27, 29, 31, 35, 36, 37, 38, 40,
]);

// Subscale question numbers
const subscaleMap: Record<string, number[]> = {
  autonomy: [1, 13, 24, 35, 41, 10, 21],
  environmentalMastery: [3, 15, 26, 36, 42, 12, 23],
  personalGrowth: [5, 17, 28, 37, 2, 14, 25],
  positiveRelations: [7, 18, 30, 38, 4, 16, 27],
  purposeInLife: [9, 20, 32, 39, 6, 29, 33],
  selfAcceptance: [11, 22, 34, 40, 8, 19, 31],
};

// Map question text EXACTLY as in your frontend for all 42 questions.
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

function reverseScore(value: number, points: number = 7) {
  return points + 1 - value;
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

    // Initialize subscale accumulators
    const subscaleSums: Record<string, number> = {
      autonomy: 0,
      environmentalMastery: 0,
      personalGrowth: 0,
      positiveRelations: 0,
      purposeInLife: 0,
      selfAcceptance: 0,
    };
    const subscaleCounts: Record<string, number> = {
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
      let val = answerTextToValue[answerText];
      if (val === undefined) continue;

      const rev = reverseScoredQuestions.has(qNum) ? reverseScore(val, 7) : val;

      for (const [sub, questionNums] of Object.entries(subscaleMap)) {
        if (questionNums.includes(qNum)) {
          subscaleSums[sub] += rev;
          subscaleCounts[sub] += 1;
        }
      }
    }

    const subscaleScores: Record<string, number> = {};
    for (const sub of Object.keys(subscaleSums)) {
      const cnt = subscaleCounts[sub];
      subscaleScores[sub] = cnt > 0 ? subscaleSums[sub] / cnt : 0;
    }

    const overallScore =
      Object.values(subscaleScores).reduce((a, b) => a + b, 0) /
      Object.keys(subscaleScores).length;

    await upsertPsychologicalWellbeingTest(
      session.user.id,
      overallScore,
      answers,
      subscaleScores
    );

    return NextResponse.json({ success: true, subscaleScores, overallScore });
  } catch (err) {
    console.error("Error in psychological wellbeing scoring:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
