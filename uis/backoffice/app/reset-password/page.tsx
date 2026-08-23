import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_24px_40px_-36px_rgba(0,0,0,0.8)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Nexova Solutions
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Restablecer contrasena</h1>

        <ResetPasswordForm token={token ?? null} />
      </div>
    </main>
  );
}
