import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const cookies = request.cookies;
    const token = cookies.get("token")?.value;
    if (token) {
      return NextResponse.rewrite(new URL("/", request.url));
    }
    return NextResponse.rewrite(new URL("/signin", request.url));
  }
}
