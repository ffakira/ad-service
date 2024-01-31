import { NextRequest, NextResponse } from "next/server";

/**
 * @author ffakira
 * @dev POST /api/auth/register
 * 
 * Register a new account by providing a non-existing username
 * and a min 8 chars for password
 */
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
      const req = await fetch(`${process.env.SERVER_HOST!}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.API_KEY!,
        },
        body: JSON.stringify(data),
        signal,
      });
      const resp = await req.json();

      /** @dev CREATED, username successfully inserted to the database */
      if (req.status === 201) {
        return NextResponse.json({ ...resp }, { status: 201 });
      } else {
        /**
         * @dev handles the remaining HTTP status
         * 400 - zod schema failed
         * 409 - username already exists
         * 500 - the server exploded. we never know / mongodb failed to create a user.
         */
        return NextResponse.json({ ...resp }, { status: req.status });
      }
    } catch (err) {
      console.error(
        `params: ${JSON.stringify(data)} method: POST /api/auth/register ${
          (err as Error).message
        }`
      );

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
        /** @dev INTERNAL_SERVER_ERROR, error on the client side */
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
