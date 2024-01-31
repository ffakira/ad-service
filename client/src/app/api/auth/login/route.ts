import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
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

  if (!data) {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "No body been provided",
        },
      },
      { status: 400 }
    );
  } else {
    try {
      const req = await fetch(`${process.env.SERVER_HOST!}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.API_KEY!,
        },
        body: JSON.stringify(data),
        signal,
      });

      if (req.status === 200) {
        const resp = await req.json();
        return NextResponse.json(
          { ...resp },
          {
            status: req.status,
            headers: {
              "Set-Cookie": req.headers.get("set-cookie")!,
            },
          }
        );
      } else if (req.status === 204) {
        /**
         * @dev Next.js slight bug
         * ref: https://github.com/vercel/next.js/issues/49005#issuecomment-1698648721
         */
        return new NextResponse(undefined, { status: 204 });
      } else {
        const resp = await req.json();
        /**
         * @dev handles the remaining HTTP status
         * 400 - zod schema failed
         * 401 - invalid password
         * 500 - server exploded. we never know. probably issues with mongodb
         *       or bcrypt hashing
         */
        return NextResponse.json({ ...resp }, { status: req.status });
      }
    } catch (err) {
      console.error(
        `params: ${JSON.stringify(data)} method: POST /api/auth/login ${
          (err as Error).message
        }`
      );

      /** @dev  TIMEOUT, server took longer than 30 seconds */
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
}
