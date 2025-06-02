import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { DecodeUser } from "@/helpers/decodeUser";
import { dbConnect } from "@/dbConfig/dbConfig";
export async function GET(request: NextRequest) {
    try {
        dbConnect()
        const id = await DecodeUser(request);
        const user = await User.findOne({ _id: id }).select("-password ")
        if (!user) {
            return NextResponse.json({ error: "unable to fetch Profile" }, { status: 401 })
        }
        return NextResponse.json({ message: "profile retrieve successfull!", userInfo: user }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}