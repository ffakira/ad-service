import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @author ffakira
 * @dev GET /api/auth/session
 *
 * Fetches the session cookie information from `connect.sid`.
 * The max-age is 24 hours.
 */
export async function GET(request: NextRequest) {
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
    const req = await fetch(`${process.env.SERVER_HOST!}/api/auth/session`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-API-KEY": process.env.API_KEY!,
        Cookie: `${connectSid.name}=${connectSid.value}`,
      },
      signal,
    });
    const resp = await req.json();
    if (req.status === 200) {
      return NextResponse.json({ ...resp }, { status: 200 });
    } else {
      return NextResponse.json({ ...resp }, { status: req.status });
    }
  } catch (err) {
    console.error(`method: GET /api/auth/session ${(err as Error).message}`);
    if ((err as Error).name === "AbortError") {
      return NextResponse.json(
        {
          status: 408,
          error: {
            message: "Server timeout",
          },
        },
        { Status: 408 }
      );
    } else {
      return NextResponse.json(
        {
          status: 500,
          error: {
            message: "Internal server error",
          },
        },
        { status: 500 }
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}
