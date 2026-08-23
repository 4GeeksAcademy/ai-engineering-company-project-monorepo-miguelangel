"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { getToken } from "@/lib/auth-storage";
import { useAuth } from "@/lib/AuthContext";

export default function RequireAuth({ children }: { children: ReactNode }) {
	const router = useRouter();
	const { loading } = useAuth();

	useEffect(() => {
		if (loading) {
			return;
		}
		if (!getToken()) {
			router.replace("/login");
		}
	}, [loading, router]);

	if (loading) {
		return <p className="p-6 text-sm text-slate-600">Comprobando sesion...</p>;
	}

	if (!getToken()) {
		return null;
	}

	return <>{children}</>;
}
