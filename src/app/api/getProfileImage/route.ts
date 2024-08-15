import { NextRequest, NextResponse } from "next/server";
import { existsSync, createReadStream } from "fs";
import { join } from "path";
import { stat } from "fs/promises";

// Convert callback-based pipeline to promise-based
// const pipelinePromise = promisify(pipeline);

export async function GET(req: NextRequest) {
  try {
    // return await verifyToken(req, false, async () => {
    const { searchParams } = new URL(req.url);
    const encryptedFileName = searchParams.get("file");

    if (!encryptedFileName) {
      return NextResponse.json(
        { message: "Bad Request: Missing 'file' parameter" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), "uploads", "siswa", encryptedFileName);

    if (!existsSync(filePath)) {
      return NextResponse.json({ message: "File Not Found" }, { status: 404 });
    }

    // Get the file stat to ensure file exists and get its size/type
    const fileStat = await stat(filePath);
    const fileStream = createReadStream(filePath);

    const responseHeaders = {
      "Content-Type": "image/jpeg", // Change this according to the actual MIME type
      "Content-Length": fileStat.size.toString(),
    };

    // Stream the file as the response
    const res = new NextResponse(fileStream as any, {
      headers: responseHeaders,
    });

    return res;
    // });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
