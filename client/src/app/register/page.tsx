"use client";

import Link from "next/link";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import FormBuilder, { FormSchema } from "@/components/FormBuilder/FormBuilder";

type RegisterInputs = {
  username: string;
  password: string;
  confirmPassword: string;
};

export default function Register(): React.ReactNode {
  const [loading, setLoading] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<boolean>(false);

  const formSchema: FormSchema<RegisterInputs> = {
    fields: [
      { name: "username", label: "Username", type: "text", required: true },
      { name: "password", label: "Password", type: "password", required: true },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        required: true,
        validate: (value: string, field: RegisterInputs) =>
          value === field.password || "Password does not match",
      },
    ],
  };

  const defaultValues: RegisterInputs = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit: SubmitHandler<RegisterInputs> = async (
    data: RegisterInputs
  ): Promise<void> => {
    setLoading(true);
    const req = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });

    if (req.status === 409) {
      setConflictError(true);
    } else {
      setConflictError(false);
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col w-[600px] shadow-2xl p-8 rounded-lg">
      <h1>Register</h1>
      {conflictError ? (
        <div className="border-2 border-yellow-500 py-4 my-4 bg-yellow-500/20">
          <p className="text-center font-bold text-yellow-600">
            This username already exists.{" "}
            <Link className="underline" href="/login">
              Click here
            </Link>{" "}
            to login.
          </p>
        </div>
      ) : (
        <></>
      )}
      <FormBuilder
        btnName="Register"
        loading={loading}
        defaultValues={defaultValues}
        schema={formSchema}
        onSubmit={onSubmit}
      />
    </section>
  );
}
