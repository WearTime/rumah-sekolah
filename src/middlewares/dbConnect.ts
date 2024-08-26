import prisma from "@/lib/database/db";
import { getToken } from "next-auth/jwt";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const onlyAdminPage = ["/addsiswa", "/addguru", "/addmapel"];
const authPage = ["/login", "/register"];
export default function withAuth(
  middleware: NextMiddleware,
  requireAuth: string[] = []
) {
  return async (req: NextRequest, next: NextFetchEvent) => {
    
    try {
        await prisma.$connect;
    } catch (error) {
        
    }
    return middleware(req, next);
  };
}
