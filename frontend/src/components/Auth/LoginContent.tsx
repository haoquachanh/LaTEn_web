'use client';
import { FormEvent, useContext } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { AuthContext } from '@/contexts/AuthContext';

export default function LoginContent() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          login();
          router.push('/');
        } else {
        }
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
          <input type="text" name="email" placeholder="Email" required />
        </label>
        <label className="flex items-center gap-2 input-bordered w-11/12 input">
          <input className="w-11/12" type="password" name="password" placeholder="Password" required />
        </label>
        <button className="w-1/2 btn btn-outline" type="submit">
          Login
        </button>
        <p className="flex justify-center items-center pb-1 w-full max-w-lg text-sm">
          You don't have an account?
          <Link href="/register" className="ml-1 text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
      <div className="my-8 divider">OR</div>
    </div>
  );
}
