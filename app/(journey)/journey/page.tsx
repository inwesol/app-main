import { auth } from "@/app/(auth)/auth";
import { JourneyPage } from "./journey";

export default async function Page() {
  const session = await auth();
  return <JourneyPage fullName={session?.user?.name ?? ""} />;
}
