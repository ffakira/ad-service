import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @author ffakira
 * @dev POST /api/airdrop/redeem
 * 
 * Generates new redeem codes, requires admin
 * role
 */
export async function POST(request: NextRequest) {
  const data = await request.json();
  const controller = new AbortController();
  const { signal } = controller;
  const connectSid = cookies().get("connect.sid")!;

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
      const req = await fetch(`${process.env.SERVER_HOST!}/api/airdrop/redeem/new`, {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: `${connectSid.name}=${connectSid.value}`,
          "Content-Type": "application/json",
          "X-API-KEY": process.env.API_KEY!,
        },
        body: JSON.stringify(data),
        signal,
      });
      const resp = await req.json();

      if (req.status === 200) {
        return NextResponse.json({ ...resp }, { status: 200 });
      } else {
        return NextResponse.json({ ...resp }, { status: req.status });
      }
    } catch (err) {
      console.error(
        `params: ${JSON.stringify(data)} method: POST /api/airdrop/redeem ${
          (err as Error).message
        }`
      );
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
