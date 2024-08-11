import { verify } from "jsonwebtoken";
import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { promisify } from "util";

const verifyAsync = promisify(verify);

export async function GET(req: NextRequest) {
  try {
    const token: any = req.headers.get("Authorization")?.split(" ")[1] || "";

    if (!token) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }

    const decoded: any = await verifyAsync(
      token,
      process.env.NEXTAUTH_SECRET || ""
    );

    if (decoded && decoded.role === "Admin") {
      const allData = await prisma.dataSiswa.findMany();
      const count = allData.length;

      return NextResponse.json(
        { data: allData, total: count },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { data: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
