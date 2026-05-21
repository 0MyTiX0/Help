import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authSecret =
  process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export default withAuth(
  function middleware(req) {
    //TODO : Rate limit
    return NextResponse.next();
  },
  {
    secret: authSecret,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  },
);

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/dashboard/:path*",
    "/api/user/:path*",
  ],
};
