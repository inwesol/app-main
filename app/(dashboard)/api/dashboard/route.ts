import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
    });
  } catch (error) {
    console.error("Error checking auth status:", error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
