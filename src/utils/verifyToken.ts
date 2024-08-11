import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const verify = (
  req: NextRequest,
  isAdmin: boolean,
  callback: Function
) => {
  const token = req.headers.get("Authorization")?.split(" ")[1] || "";

  if (token) {
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded && (isAdmin ? decoded.role == "Admin" : true)) {
          callback(decoded);
        } else {
          NextResponse.json({ message: "Access Denied" }, { status: 403 });
        }
      }
    );
  } else {
    NextResponse.json({ message: "Access Denied" }, { status: 403 });
  }
};
