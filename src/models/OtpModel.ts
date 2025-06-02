import mongoose from "mongoose";
import { boolean } from "zod/v4";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:true,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    isverified: {
        type: boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    },
})

const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

export default Otp;
