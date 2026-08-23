import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	return (
		<main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-800">
			<div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
				<p className="text-sm font-medium uppercase tracking-wide text-teal-700">
					Nexova Solutions
				</p>
				<h1 className="mt-2 text-2xl font-semibold">Restablecer contrasena</h1>

				<ResetPasswordForm token={token ?? null} />
			</div>
		</main>
	);
}
