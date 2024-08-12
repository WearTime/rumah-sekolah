import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const verifyToken = async (
  req: NextRequest,
  isAdmin: boolean,
  callback: Function
) => {
  const token = req.headers.get("Authorization")?.split(" ")[1] || "";

  if (!token) {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }

  try {
    const decoded: any = await new Promise((resolve, reject) => {
      verify(
        token,
        process.env.NEXTAUTH_SECRET || "",
        (err: any, decoded: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        }
      );
    });

    if (decoded && (isAdmin ? decoded.role == "Admin" : true)) {
      return callback(decoded);
    } else {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }
};
