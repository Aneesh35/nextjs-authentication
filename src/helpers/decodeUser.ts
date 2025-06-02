import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export const DecodeUser = (request:NextRequest) => {
    const token = request.cookies.get("token")!.value || ""
    const secret = process.env.JWT_SECRET
    const decodedToken: any = jwt.verify(token, secret!)
    if (!decodedToken) {
        throw new Error("decoded error")
    }
    return decodedToken.id;
}