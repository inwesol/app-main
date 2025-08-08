import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getRiasecTest, upsertRiasecTest } from "@/lib/db/queries";

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
//     const { selectedAnswers, score } = body;

//     if (
//       !selectedAnswers ||
//       !Array.isArray(selectedAnswers) ||
//       selectedAnswers.some((ans) => typeof ans !== "string")
//     ) {
//       return new NextResponse("Bad Request: Invalid selectedAnswers", {
//         status: 400,
//       });
//     }

//     // Score validation optional, defaults to 0 if missing
//     const validScore = typeof score === "number" ? score : 0;

//     // Upsert to DB
//     await upsertRiasecTest(
//       session.user.id,
//       /* sessionIdNum, */ validScore,
//       selectedAnswers
//     );

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("Error inserting riasec test:", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }

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

    return NextResponse.json({
      success: true,
      categoryCounts,
      interestCode,
    });
  } catch (err) {
    console.error("Error processing RIASEC test:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    const data = await getRiasecTest(session.user.id);

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({
      selectedAnswers: data.selectedAnswers,
      score: data.score,
    });
  } catch (err) {
    console.error("Error fetching riasec test:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
