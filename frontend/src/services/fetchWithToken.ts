// Khai báo kiểu cho biến options
import { useRouter } from "next/router";
const router = useRouter();
interface FetchOptions {
  headers?: HeadersInit;
  method?: string;
  body?: BodyInit | null;
}

export const fetchWithToken = async (
  url: string,
  options: FetchOptions = {}
) => {
  const jwtToken = localStorage.getItem("access_token");

  if (!jwtToken) {
    router.push("/login");
    return;
  }

  const headers: HeadersInit = {
    ...options.headers,
    Authorization: `Bearer ${jwtToken}`,
  };

  return fetch(url, { ...options, headers });
};
