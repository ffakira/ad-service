import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @dev utility function to get session api route
 */
async function getSession() {
  const connectSid = cookies().get("connect.sid");
  try {
    const req = await fetch(
      new URL("http://localhost:3000/api/auth/session").href,
      {
        credentials: "include",
        headers: {
          Accept: "application/json",
          Cookie: `${connectSid.name}=${connectSid.value}`,
        },
      }
    );
    const resp = await req.json();
    return resp;
  } catch (err) {
    throw err;
  }
}

/**
 * @dev Note that if we move the fetch to the top level,
 * this will cause the `/api/auth/session` to be called
 * in every request. Therefore, we need to filter the
 * path where it would be necessary.
 */
export async function middleware(request: NextRequest) {
  const isNextUrl = (url: string): boolean =>
    request.nextUrl.pathname.startsWith(url);

  try {
    /**
     * @dev handles if the username is logged in, to redirect
     * to dashboard
     */
    if (isNextUrl("/login")) {
      const { data } = await getSession();
      if (data.isAuth) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.next();
      }
    }

    /** @dev handles /dashboard path */
    if (isNextUrl("/dashboard")) {
      const { data } = await getSession();
      if (data.isAuth) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    /** @dev handles /admin path */
    if (isNextUrl("/admin")) {
      const { data } = await getSession();
      console.log(data);
      if (data.isAuth /**&& data.isAdmin**/) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error(
      `pathname: ${request.nextUrl.pathname}`,
      (err as Error).message
    );
    return NextResponse.next();
  }
}
