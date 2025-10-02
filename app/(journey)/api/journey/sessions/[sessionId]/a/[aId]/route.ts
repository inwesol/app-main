import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import {
  getCareerStoryFive,
  upsertCareerStoryFive,
  getCareerStorySix,
  upsertCareerStorySix,
  getCareerStoryOne,
  upsertCareerStoryOne,
  getCareerStoryTwo,
  upsertCareerStoryTwo,
  getCareerStoryThree,
  upsertCareerStoryThree,
  getCareerStoryFour,
  upsertCareerStoryFour,
  getDailyJournaling,
  upsertDailyJournaling,
  getLetterFromFutureSelf,
  upsertLetterFromFutureSelf,
  getCareerOptionsMatrix,
  upsertCareerOptionsMatrix,
  getMyLifeCollage,
  upsertMyLifeCollage,
  completeUserSessionFormProgress,
  updateJourneyProgressAfterForm,
} from "@/lib/db/queries";
import { careerStoryOneSchema } from "@/lib/form-validation-schemas/activity-schemas/career-story-one-schema";
import { careerStoryTwoSchema } from "@/lib/form-validation-schemas/activity-schemas/career-story-two-schema";
import { careerStoryThreeSchema } from "@/lib/form-validation-schemas/activity-schemas/career-story-three-schema";
import { careerStoryFourSchema } from "@/lib/form-validation-schemas/activity-schemas/career-story-four-schema";
import { dailyJournalingSchema } from "@/lib/form-validation-schemas/activity-schemas/daily-journaling-schema";
import { letterFromFutureSelfSchema } from "@/lib/form-validation-schemas/activity-schemas/letter-from-future-self-schema";
import { careerOptionsMatrixSchema } from "@/lib/form-validation-schemas/activity-schemas/career-option-matrix-schema";
import { lifeCollageSchema } from "@/lib/form-validation-schemas/activity-schemas/life-collage-schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; aId: string }> }
) {
  console.log("get activity api working");
  const { aId, sessionId } = await params;
  console.log("aId: ", aId, "sessionId: ", sessionId);

  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Validate sessionId
  const sessionIdNum = Number(sessionId);
  if (Number.isNaN(sessionIdNum)) {
    return new NextResponse("Bad Request: Invalid session ID", {
      status: 400,
    });
  }

  switch (aId) {
    case "career-story-1":
      try {
        console.log("Career Story 1 GET - Session ID:", sessionId);
        console.log("Career Story 1 GET - User ID:", session.user.id);

        const data = await getCareerStoryOne(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story 1 not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            transitionEssay: "",
            occupations: "",
            heroes: [],
          });
        }

        console.log("Career story 1 found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching career story 1:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-5":
      try {
        console.log("Career Story 5 GET - Session ID:", sessionId);
        console.log("Career Story 5 GET - User ID:", session.user.id);

        const data = await getCareerStoryFive(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story five not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not Found", { status: 404 });
        }

        console.log("Career story five found:", data);

        return NextResponse.json({
          storyboards: data.storyboards,
        });
      } catch (err) {
        console.error("Error fetching career story five:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-6":
      try {
        console.log("Career Story 6 GET - Session ID:", sessionId);
        console.log("Career Story 6 GET - User ID:", session.user.id);

        const data = await getCareerStorySix(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story six not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          return new NextResponse("Not Found", { status: 404 });
        }

        console.log("Career story six found:", data);

        return NextResponse.json({
          selected_storyboard_id: data.selected_storyboard_id,
          storyboard_data: data.storyboard_data,
        });
      } catch (err) {
        console.error("Error fetching career story six:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-2":
      try {
        console.log("Career Story 2 GET - Session ID:", sessionId);
        console.log("Career Story 2 GET - User ID:", session.user.id);

        const data = await getCareerStoryTwo(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story 2 not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            firstAdjectives: "",
            repeatedWords: "",
            commonTraits: "",
            significantWords: "",
            selfStatement: "",
            mediaActivities: "",
            selectedRiasec: [],
            settingStatement: "",
          });
        }

        console.log("Career story 2 found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching career story 2:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-3":
      try {
        console.log("Career Story 3 GET - Session ID:", sessionId);
        console.log("Career Story 3 GET - User ID:", session.user.id);

        const data = await getCareerStoryThree(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story 3 not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            selfStatement: "",
            settingStatement: "",
            plotDescription: "",
            plotActivities: "",
            ableToBeStatement: "",
            placesWhereStatement: "",
            soThatStatement: "",
            mottoStatement: "",
            selectedOccupations: [],
          });
        }

        console.log("Career story 3 found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching career story 3:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-4":
      try {
        console.log("Career Story 4 GET - Session ID:", sessionId);
        console.log("Career Story 4 GET - User ID:", session.user.id);

        const data = await getCareerStoryFour(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "Career story 4 not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            rewrittenStory: "",
          });
        }

        console.log("Career story 4 found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching career story 4:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "daily-journaling":
      try {
        console.log("Daily Journaling GET - Session ID:", sessionId);
        console.log("Daily Journaling GET - User ID:", session.user.id);

        // Extract date parameter from query string
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        console.log("Daily Journaling GET - Date:", date);

        const data = await getDailyJournaling(
          session.user.id,
          sessionIdNum,
          date || undefined
        );

        if (!data) {
          console.log(
            "Daily journaling not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404 for journaling
          return NextResponse.json({
            date: new Date().toISOString().split("T")[0],
            tookAction: "",
            whatHeldBack: "",
            challenges: [],
            progress: [],
            gratitude: [],
            gratitudeHelp: [],
            tomorrowStep: "",
          });
        }

        console.log("Daily journaling found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching daily journaling:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "letter-from-future-self":
      try {
        console.log("Letter from Future Self GET - Session ID:", sessionId);
        console.log("Letter from Future Self GET - User ID:", session.user.id);

        const data = await getLetterFromFutureSelf(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          console.log(
            "Letter from future self not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            letter: "",
          });
        }

        console.log("Letter from future self found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching letter from future self:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-options-matrix":
      try {
        console.log("Career Options Matrix GET - Session ID:", sessionId);
        console.log("Career Options Matrix GET - User ID:", session.user.id);

        const data = await getCareerOptionsMatrix(
          session.user.id,
          sessionIdNum
        );

        if (!data) {
          console.log(
            "Career options matrix not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            rows: [],
            columns: [],
            cells: [],
          });
        }

        console.log("Career options matrix found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching career options matrix:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "my-life-collage":
      try {
        console.log("My Life Collage GET - Session ID:", sessionId);
        console.log("My Life Collage GET - User ID:", session.user.id);

        const data = await getMyLifeCollage(session.user.id, sessionIdNum);

        if (!data) {
          console.log(
            "My life collage not found for user:",
            session.user.id,
            "session:",
            sessionIdNum
          );
          // Return empty structure instead of 404
          return NextResponse.json({
            presentLifeCollage: [],
            futureLifeCollage: [],
            retirementValues: "",
          });
        }

        console.log("My life collage found:", data);
        return NextResponse.json(data);
      } catch (err) {
        console.error("Error fetching my life collage:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    default:
      return NextResponse.json(
        { error: "Unknown activityId" },
        { status: 404 }
      );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; aId: string }> }
) {
  const { aId, sessionId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log("server params: ", await params);
  const activityData = await req.json();

  // Validate sessionId
  const sessionIdNum = Number(sessionId);
  if (Number.isNaN(sessionIdNum)) {
    return new NextResponse("Bad Request: Invalid session ID", {
      status: 400,
    });
  }

  switch (aId) {
    case "career-story-1":
      try {
        // Debug logging
        console.log("Career Story 1 POST - Session ID:", sessionId);
        console.log("Career Story 1 POST - User ID:", session.user.id);
        console.log("Career Story 1 POST - Data:", activityData);

        // Validate the incoming data
        const validation = careerStoryOneSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertCareerStoryOne(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story 1:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-5":
      try {
        // Debug logging
        console.log("Career Story 5 POST - Session ID:", sessionId);
        console.log("Career Story 5 POST - User ID:", session.user.id);
        console.log("Career Story 5 POST - Data:", activityData);

        // For now, skip validation since we don't have a schema for the new format
        // TODO: Create careerStoryFiveSchema for proper validation
        const data = {
          storyboards:
            activityData.storyboards || activityData.stickyNotes || [],
        };

        await upsertCareerStoryFive(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story five:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-6":
      try {
        // Debug logging
        console.log("Career Story 6 POST - Session ID:", sessionId);
        console.log("Career Story 6 POST - User ID:", session.user.id);
        console.log("Career Story 6 POST - Data:", activityData);

        const data = {
          selected_storyboard_id: activityData.selected_storyboard_id,
          storyboard_data: activityData.storyboard_data,
        };

        await upsertCareerStorySix(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story six:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-2":
      try {
        // Debug logging
        console.log("Career Story 2 POST - Session ID:", sessionId);
        console.log("Career Story 2 POST - User ID:", session.user.id);
        console.log("Career Story 2 POST - Data:", activityData);

        // Validate the incoming data
        const validation = careerStoryTwoSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertCareerStoryTwo(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story 2:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-3":
      try {
        // Debug logging
        console.log("Career Story 3 POST - Session ID:", sessionId);
        console.log("Career Story 3 POST - User ID:", session.user.id);
        console.log("Career Story 3 POST - Data:", activityData);

        // Validate the incoming data
        const validation = careerStoryThreeSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertCareerStoryThree(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story 3:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-4":
      try {
        // Debug logging
        console.log("Career Story 4 POST - Session ID:", sessionId);
        console.log("Career Story 4 POST - User ID:", session.user.id);
        console.log("Career Story 4 POST - Data:", activityData);

        // Validate the incoming data
        const validation = careerStoryFourSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertCareerStoryFour(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career story 4:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "daily-journaling":
      try {
        // Debug logging
        console.log("Daily Journaling POST - Session ID:", sessionId);
        console.log("Daily Journaling POST - User ID:", session.user.id);
        console.log("Daily Journaling POST - Data:", activityData);

        // Validate the incoming data
        const validation = dailyJournalingSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertDailyJournaling(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving daily journaling:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "letter-from-future-self":
      try {
        // Debug logging
        console.log("Letter from Future Self POST - Session ID:", sessionId);
        console.log("Letter from Future Self POST - User ID:", session.user.id);
        console.log("Letter from Future Self POST - Data:", activityData);

        // Validate the incoming data
        const validation = letterFromFutureSelfSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertLetterFromFutureSelf(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving letter from future self:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-options-matrix":
      try {
        // Debug logging
        console.log("Career Options Matrix POST - Session ID:", sessionId);
        console.log("Career Options Matrix POST - User ID:", session.user.id);
        console.log("Career Options Matrix POST - Data:", activityData);

        // Validate the incoming data
        const validation = careerOptionsMatrixSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertCareerOptionsMatrix(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving career options matrix:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "my-life-collage":
      try {
        // Debug logging
        console.log("My Life Collage POST - Session ID:", sessionId);
        console.log("My Life Collage POST - User ID:", session.user.id);
        console.log("My Life Collage POST - Data:", activityData);

        // Validate the incoming data
        const validation = lifeCollageSchema.safeParse(activityData);
        if (!validation.success) {
          console.error("Validation failed:", validation.error.format());
          return NextResponse.json(
            { errors: validation.error.format() },
            { status: 400 }
          );
        }

        const data = validation.data;

        await upsertMyLifeCollage(session.user.id, sessionIdNum, data);

        // Mark activity as completed
        await completeUserSessionFormProgress({
          userId: session.user.id,
          sessionId: sessionIdNum,
          qId: aId, // Using aId as the identifier for activities
        });

        await updateJourneyProgressAfterForm(session.user.id, sessionIdNum);

        return NextResponse.json({ success: true });
      } catch (err) {
        console.error("Error saving my life collage:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    default:
      return NextResponse.json(
        { error: "Unknown activityId" }
        // { status: 404 }
      );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string; aId: string }> }
) {
  const { aId, sessionId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  console.log(
    "DELETE activity API called - aId:",
    aId,
    "sessionId:",
    sessionId
  );

  // Validate sessionId
  const sessionIdNum = Number(sessionId);
  if (Number.isNaN(sessionIdNum)) {
    return new NextResponse("Bad Request: Invalid session ID", {
      status: 400,
    });
  }

  switch (aId) {
    case "career-story-1":
      try {
        console.log("Career Story 1 DELETE - Session ID:", sessionId);
        console.log("Career Story 1 DELETE - User ID:", session.user.id);

        // Import the delete function (we'll need to create this)
        const { deleteCareerStoryOne } = await import("@/lib/db/queries");

        await deleteCareerStoryOne(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career story 1 data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career story 1:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-2":
      try {
        console.log("Career Story 2 DELETE - Session ID:", sessionId);
        console.log("Career Story 2 DELETE - User ID:", session.user.id);

        const { deleteCareerStoryTwo } = await import("@/lib/db/queries");

        await deleteCareerStoryTwo(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career story 2 data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career story 2:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-3":
      try {
        console.log("Career Story 3 DELETE - Session ID:", sessionId);
        console.log("Career Story 3 DELETE - User ID:", session.user.id);

        const { deleteCareerStoryThree } = await import("@/lib/db/queries");

        await deleteCareerStoryThree(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career story 3 data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career story 3:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-4":
      try {
        console.log("Career Story 4 DELETE - Session ID:", sessionId);
        console.log("Career Story 4 DELETE - User ID:", session.user.id);

        const { deleteCareerStoryFour } = await import("@/lib/db/queries");

        await deleteCareerStoryFour(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career story 4 data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career story 4:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-story-5":
      try {
        console.log("Career Story Five DELETE - Session ID:", sessionId);
        console.log("Career Story Five DELETE - User ID:", session.user.id);

        const { deleteCareerStoryFive } = await import("@/lib/db/queries");

        await deleteCareerStoryFive(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career story five data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career story five:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "daily-journaling":
      try {
        console.log("Daily Journaling DELETE - Session ID:", sessionId);
        console.log("Daily Journaling DELETE - User ID:", session.user.id);

        // Extract date parameter from query string
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        console.log("Daily Journaling DELETE - Date:", date);

        if (!date) {
          return NextResponse.json(
            { error: "Date parameter is required for deletion" },
            { status: 400 }
          );
        }

        const { deleteDailyJournaling } = await import("@/lib/db/queries");

        await deleteDailyJournaling(session.user.id, sessionIdNum, date);

        return NextResponse.json({
          success: true,
          message: "Daily journaling data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting daily journaling:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "letter-from-future-self":
      try {
        console.log("Letter from Future Self DELETE - Session ID:", sessionId);
        console.log(
          "Letter from Future Self DELETE - User ID:",
          session.user.id
        );

        const { deleteLetterFromFutureSelf } = await import("@/lib/db/queries");

        await deleteLetterFromFutureSelf(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Letter from future self data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting letter from future self:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "career-options-matrix":
      try {
        console.log("Career Options Matrix DELETE - Session ID:", sessionId);
        console.log("Career Options Matrix DELETE - User ID:", session.user.id);

        const { deleteCareerOptionsMatrix } = await import("@/lib/db/queries");

        await deleteCareerOptionsMatrix(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "Career options matrix data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting career options matrix:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    case "my-life-collage":
      try {
        console.log("My Life Collage DELETE - Session ID:", sessionId);
        console.log("My Life Collage DELETE - User ID:", session.user.id);

        const { deleteMyLifeCollage } = await import("@/lib/db/queries");

        await deleteMyLifeCollage(session.user.id, sessionIdNum);

        return NextResponse.json({
          success: true,
          message: "My life collage data deleted successfully",
        });
      } catch (err) {
        console.error("Error deleting my life collage:", err);
        return new NextResponse("Internal Server Error", { status: 500 });
      }

    default:
      return NextResponse.json(
        { error: "Unknown activityId" },
        { status: 404 }
      );
  }
}
