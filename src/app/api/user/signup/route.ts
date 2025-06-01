import { dbConnect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dataSchema } from "@/schemas/userSchema";

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const reqBody = await request.json()
        const result = dataSchema.safeParse(reqBody);
        if (!result.success) {
            return NextResponse.json({ result: result.error.format() }, { status: 400 })
        }
        const username = result.data.username;
        const email = result.data.email;
        const password = result.data.password;
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({ error: "user already exists" }, { status: 400 })
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email,password: hashpassword });
        return NextResponse.json({ message: "signUp succcess", success: true, newUser });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

