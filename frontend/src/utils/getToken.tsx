"use client";
export default function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}
