"use client";

import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthCtx } from "@/contexts/AuthContext";
import FormBuilder, { FormSchema } from "@/components/FormBuilder/FormBuilder";

type LoginInputs = {
  username: string;
  password: string;
};

export default function Login(): React.ReactNode {
  const [authError, setAuthError] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsAuth, setUsername, setIsAdmin } = useAuthCtx();
  const router = useRouter();

  const formSchema: FormSchema<LoginInputs> = {
    fields: [
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
    ],
  };

  const defaultValues: LoginInputs = {
    username: "",
    password: "",
  };

  const errorMessage = () => {
    if (authError === 204) {
      return (
        <>
          Username does not exist.{" "}
          <Link className="underline" href="/register">
            Click here
          </Link>{" "}
          to register
        </>
      );
    }

    if (authError === 401) {
      return "Invalid password";
    }

    if (authError === 408) {
      return "Connection timeout. Please try again later.";
    }
  };

  const onSubmit: SubmitHandler<LoginInputs> = async (
    data: LoginInputs
  ): Promise<void> => {
    setLoading(true);

    try {
      const req = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      if (req.status === 200) {
        setAuthError(null);
        const { data } = await req.json();

        setIsAuth(true);
        setIsUsername(data.username);
        setIsAdmin(data.isAdmin);

        if (data.isAdmin) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }

      if (req.status === 204) {
        setAuthError(204);
      }

      if (req.status === 401) {
        setAuthError(401);
      }

      if (req.status === 408) {
        setAuthError(408);
      }

      setLoading(false);
    } catch (err) {
      console.error("[login@onSubmit]:", (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col w-[600px] shadow-2xl p-8 rounded-lg">
      <h1>Login</h1>
      {authError !== null ? (
        <div className="border-2 border-red-500 py-4 my-4 bg-red-500/20">
          <p className="text-center font-bold text-red-700">{errorMessage()}</p>
        </div>
      ) : (
        <></>
      )}
      <FormBuilder
        btnName="Login"
        loading={loading}
        defaultValues={defaultValues}
        schema={formSchema}
        onSubmit={onSubmit}
      />
    </section>
  );
}
