export default async function SessionReportPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId: sessionIdStr } = await params;
  const sessionId = Number(sessionIdStr);
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-green-50 via-white to-primary-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Session {sessionId} Report
        </h1>
        <p className="text-slate-600 mb-6">
          A summary of your progress and insights for this session will appear
          here.
        </p>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Report generation is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
