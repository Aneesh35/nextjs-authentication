import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/schemas/userSchema";
import jwt from "jsonwebtoken"
import { dbConnect } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
    try {
        dbConnect()
        const body = await req.json();
        const result = LoginSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ error: "invalid data", success: false }, { status: 401 })
        }
        const email = result.data.email;
        const password = result.data.password;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "wrong password or email", success: false }, { status: 401 })
        }
        const verified = await bcrypt.compare(password, user.password)
        if (!verified) {
            return NextResponse.json({ error: "wrong password or email", success: false }, { status: 401 })
        }
        const secret = process.env.JWT_SECRET as string
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, secret, { expiresIn: "2d" })
        const response = NextResponse.json({ message: "Login success!", success: true }, { status: 201 });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 2,
        });
        return response;
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "internal server error", success: false }, { status: 500 })
    }
}