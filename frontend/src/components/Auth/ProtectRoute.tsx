import { FormEvent, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
interface FetchOptions {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit | null;
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const jwtToken = localStorage.getItem("access_token");

    if (!jwtToken) {
      router.push("/login");
    }
  }, []);
  return <>{children}</>;
}
