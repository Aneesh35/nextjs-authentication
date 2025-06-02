import Otp from "@/models/OtpModel";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/dbConfig/dbConfig";

export async function POST(request:NextRequest){
    try {
        dbConnect();
        const body=await request.json()
        const{email,otp}=body;
        const Validemail=await Otp.findOne({email})
        if(!Validemail){
            return NextResponse.json({message:"Invalid otp"},{status:401})
        }
        if(Validemail.otp!==otp){
            return NextResponse.json({message:"Invalid otp"},{status:401})
        }
         await Otp.deleteOne({ email });
        return NextResponse.json({message:"verification success!!"},{status:201})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"Internal server error"},{status:500})
    }
}