import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @author ffakira
 * @dev DELETE /api/nft/:address
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { address: string } }
) {
  const controller = new AbortController();
  const { signal } = controller;
  const connectSid = cookies().get("connect.sid")!;

  const timeout = setTimeout(() => {
    controller.abort();
  }, 30 * 1000);

  if (!params.address) {
    return NextResponse.json(
      {
        status: 400,
        error: {
          message: "No params provided",
        },
      },
      { status: 400 }
    );
  }

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
          message: "Server Host url not provided",
        },
      },
      { status: 500 }
    );
  }

  try {
    const req = await fetch(
      `${process.env.SERVER_HOST}/api/nft/${params.address}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Cookie: `${connectSid.name}=${connectSid.value}`,
          "X-API-KEY": process.env.API_KEY,
        },
        signal,
      }
    );
    const resp = await req.json();

    if (req.status === 200) {
      return NextResponse.json({ ...resp }, { status: 200 });
    } else {
      return NextResponse.json({ ...resp }, { status: req.status });
    }
  } catch (err) {
    console.error("DELETE /api/nft/:address", (err as Error).message);
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
