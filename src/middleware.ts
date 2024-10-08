import { NextResponse, type NextRequest } from "next/server";
import withAuth from "./middlewares/withAuth";

export function mainMiddleware(request: NextRequest) {
  const res = NextResponse.next();
  return res;
}

export default withAuth(mainMiddleware, [
  "/addsiswa",
  "/addguru",
  "/addmapel",
  "/login",
  "/register",
]);
