import { sendEmail } from '@/helpers/mailer'
import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/dbConfig/dbConfig';

export async function POST(request: NextRequest) {
    try {
        dbConnect();
        const body = await request.json()
        const email = body.email;
        const otpid = await sendEmail(email);
        return NextResponse.json({ message: "Otp sent successfully", success: true }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}