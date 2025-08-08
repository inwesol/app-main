import { auth } from '@/app/(auth)/auth';
import ClientSessionFeedback from './session-feedback.client';

export default async function SessionFeedback() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;
  return <ClientSessionFeedback userId={userId} />;
}