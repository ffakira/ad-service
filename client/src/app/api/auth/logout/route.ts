import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @author ffakira
 */
export async function DELETE(request: NextRequest) {
  const controller = new AbortController();
  const { signal } = controller;
  const connectSid = cookies().get("connect.sid");

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30 * 1000);

  if (process.env.API_KEY === undefined) {
    return NextResponse.json(
      {
        status: 401,
        error: {
          message: "No API Key provided",
        },
      },
      { status: 401 }
    );
  }

  if (process.env.SERVER_HOST === undefined) {
    return NextResponse.json(
      {
        status: 500,
        error: {
          message: "Server Host url not been provided",
        },
      },
      { status: 500 }
    );
  }

  try {
    const req = await fetch(`${process.env.SERVER_HOST!}/api/auth/logout`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.API_KEY!,
        Cookie: `${connectSid.name}=${connectSid.value}`,
      },
      signal,
    });
    cookies().set({
      name: "connect.sid",
      value: "",
      expires: new Date(),
      path: "/",
    });
    return NextResponse.redirect(new URL("/login", request.url));
  } catch (err) {
    console.error(`method: DELETE /api/auth/logout ${(err as Error).message}`);
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        {
          status: 408,
          error: {
            message: "Server timeout",
          },
        },
        { status: 408 }
      );
    } else {
      return NextResponse.json(
        {
          status: 500,
          error: {
            message: "Internal server error",
          },
        },
        { status: 5400 }
      );
    }
  }
}
