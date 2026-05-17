import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    //TODO : Rate limit
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/login",
    },
  },
);

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/api/user/:path*"],
};
