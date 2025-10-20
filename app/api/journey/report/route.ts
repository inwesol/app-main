import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getRiasecTest } from "@/lib/db/queries";

// RIASEC category mapping with full names and descriptions
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch user progress data (you may need to implement this)
    const userProgress = {
      userId: session.user.id,
      currentSession: 1, // This should come from your existing logic
      completedSessions: [0, 1], // This should come from your existing logic
      totalScore: 85, // This should come from your existing logic
      lastActiveDate: new Date().toISOString(),
    };

    // Fetch RIASEC test data
    let riasecData = null;
    try {
      const riasecTestData = await getRiasecTest(session.user.id, 2); // Session 2 for RIASEC

      if (riasecTestData) {
        const { interestCode, categoryCounts } = riasecTestData;
        const totalSelections = Object.values(categoryCounts).reduce(
          (sum, count) => sum + count,
          0
        );

        // Get top 3 categories
        const sortedCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const topCategories = sortedCategories.map(([category, count]) => {
          const code = category[0].toUpperCase();
          const categoryInfo =
            RIASEC_CATEGORIES[code as keyof typeof RIASEC_CATEGORIES];
          return {
            code,
            name: categoryInfo.name,
            description: categoryInfo.description,
            count,
            percentage:
              totalSelections > 0
                ? Math.round((count / totalSelections) * 100)
                : 0,
            color: categoryInfo.color,
          };
        });

        riasecData = {
          interestCode,
          categoryCounts,
          topCategories,
        };
      }
    } catch (error) {
      console.error("Error fetching RIASEC data:", error);
      // Continue without RIASEC data
    }

    // Build session progress (you may need to implement this based on your session templates)
    const sessionProgress = [
      {
        id: 0,
        title: "Self Discovery",
        status: "completed" as const,
        score: 85,
        completedDate: new Date().toISOString(),
      },
      {
        id: 1,
        title: "Interest Assessment",
        status: "completed" as const,
        score: 92,
        completedDate: new Date().toISOString(),
      },
      {
        id: 2,
        title: "Values Exploration",
        status: "current" as const,
      },
      // Add more sessions as needed
    ];

    // Build overall insights (you may need to implement this based on your data)
    const overallInsights = {
      strengths: [
        "Analytical Thinking",
        "Creative Problem Solving",
        "Leadership",
      ],
      values: ["Innovation", "Collaboration", "Growth"],
      areasForImprovement: ["Time Management", "Public Speaking"],
      nextSteps: [
        "Complete remaining assessment sessions",
        "Explore career paths aligned with your interests",
        "Connect with industry professionals",
      ],
    };

    const reportData = {
      ...userProgress,
      sessionProgress,
      overallInsights,
      riasecData,
    };

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
