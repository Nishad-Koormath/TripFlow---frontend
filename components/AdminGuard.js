import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const API_BASE = "http://127.0.0.1:8000";

function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json || {};
  } catch {
    return {};
  }
}

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Preferred: ask backend for the user profile
    async function check() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const me = await res.json();
          if (me.is_staff || me.is_superuser) {
            setChecking(false);
          } else {
            router.replace("/");
          }
          return;
        }

        // Fallback: decode token (only if your JWT includes is_staff)
        const payload = decodeJWT(token);
        if (payload.is_staff || payload.is_superuser) {
          setChecking(false);
        } else {
          router.replace("/");
        }
      } catch (e) {
        router.replace("/login");
      }
    }

    check();
  }, [router]);

  if (checking) {
    return <p className="text-center my-5">Checking admin access…</p>;
  }

  return <>{children}</>;
}
