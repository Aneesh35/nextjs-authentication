import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response =NextResponse.json({message:"logout successfull!",success:true},{status:201});
        response.cookies.set("token","",{
            httpOnly:true,
            expires:new Date(0)
        });
        return response
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({ error:"Internal server Error" }, { status: 500 });
    }
}