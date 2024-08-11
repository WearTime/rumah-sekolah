import prisma from "../../../lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const allData = await prisma.dataSiswa.findMany();

    const count = allData.length;

    return NextResponse.json({ data: allData, total: count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { data: null, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
