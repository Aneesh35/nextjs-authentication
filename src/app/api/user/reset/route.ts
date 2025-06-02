import { dbConnect } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { DecodeUser } from "@/helpers/decodeUser";
import nodemailer from 'nodemailer'
import { nanoid } from "nanoid";

export async function GET(request: NextRequest) {
    try {
        dbConnect();
        const userId = await DecodeUser(request);
        const link = nanoid(30);
        const user = await User.findByIdAndUpdate(userId, {
            forgotPasswordToken: link,
            forgotPasswordTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
        })
        if (!user) {
            return NextResponse.json({ error: "Invalid user" }, { status: 401 })
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_USER!,
                pass: process.env.MAIL_PASSWORD!
            }
        });
        const domain = process.env.APP_DOMAIN
        const mailOptions = {
            from: "application@gmail.com",
            to: user.email,
            subject: "Reset Otp",
            html: `<p>your Reset link is:<br>${domain}/reset/${link}</p>`
        }
        const mailresponse = await transport.sendMail(mailOptions);
        return NextResponse.json({ message: "Reset Link sent successfully!!", success: true }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
export async function PUT(request: NextRequest) {
    try {
        dbConnect();
        const body = await request.json();
        const resetLink = body.link;
        const password = body.password;
        if (!resetLink || !password) {
            return NextResponse.json({ error: "Invalid data" }, { status: 401 })
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            {
                forgotPasswordToken: resetLink,
                forgotPasswordTokenExpiry: { $gt: Date.now() }
            },
            {
                password: hashpassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null
            },
            {
                new: true
            }
        );
        if (!user) {
            return NextResponse.json({ error: "Invalid user" }, { status: 401 })
        }
        return NextResponse.json({ message: "password reset successfully!!", success: true }, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}