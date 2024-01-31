import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const controller = new AbortController();
  const { signal } = controller;

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30 * 1000);

  if (process.env.API_KEY === undefined) {
    return NextResponse.json(
      {
        status: 401,
        error: {
          message: "No Api Key provided",
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
    const req = await fetch(`${process.env.SERVER_HOST!}/api/auth/all`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.API_KEY!,
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
    console.error(`method: GET /api/auth/all`, (err as Error).message);

    /** @dev TIMEOUT, server took longer than 30 seconds */
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
        { status: 500 }
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}
