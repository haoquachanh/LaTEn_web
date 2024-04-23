"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterContent() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const response = await fetch(`http://localhost:3001/api/auth/login`, {
      // const response = await fetch(`${process.env.SERVER_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("access_tokens", data.access_token);
        router.push("/");
      });
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-auto">
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col justify-center items-center space-y-8 w-full max-w-lg"
      >
        <h1 className="text-2xl">Sign in to Laten</h1>
        <label className="flex items-center gap-2 input-bordered w-11/12 input">
          <input type="text" name="fullname" placeholder="Fullname" required />
        </label>{" "}
        <label className="flex items-center gap-2 input-bordered w-11/12 input">
          <input type="text" name="email" placeholder="Email" required />
        </label>
        <label className="flex items-center gap-2 input-bordered w-11/12 input">
          <input
            className="w-11/12"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </label>{" "}
        <label className="flex items-center gap-2 input-bordered w-11/12 input">
          <input
            className="w-11/12"
            type="password"
            name="password"
            placeholder="Confirm Password"
            required
          />
        </label>
        <button className="w-1/2 btn btn-outline" type="submit">
          Register
        </button>
        <p className="flex justify-center items-center pb-1 w-full max-w-lg text-sm">
          You already have an account?
          <Link href="/login" className="ml-1 text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
      <div className="my-8 divider">OR</div>
    </div>
  );
}
