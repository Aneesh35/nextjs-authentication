import nodemailer from 'nodemailer'
import Otp from '@/models/OtpModel'
import bcryptjs from "bcryptjs"
import otp from "otp-generator"

export const sendEmail = async (email: any) => {
    try {
        const token = otp.generate(5, {
            upperCaseAlphabets: true,
            lowerCaseAlphabets: false,
            digits: true,
            specialChars: false
        })
        const genOtp = await Otp.create({
            email: email,
            otp: token,
            expiresAt: Date.now() + 5 * 60 * 1000
        })
        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_USER!,
                pass: process.env.MAIL_PASSWORD!
            }
        });
        const mailOptions = {
            from: "application@gmail.com",
            to: email,
            subject: "Verification Otp",
            html: `<p>your verification otp is:<br>${token}</p>`
        }
        const mailresponse = await transport.sendMail(mailOptions);
        return genOtp._id;
    } catch (error: any) {
        throw new Error(error.message);
    }
}