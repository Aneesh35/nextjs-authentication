"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dataSchema } from "@/schemas/userSchema";
import toast from "react-hot-toast";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

export default function SignUp() {
    type User = z.infer<typeof dataSchema>;

    const router = useRouter();

    const [formData, setFormData] = useState<User>({
        username: "",
        email: "",
        password: "",
    });
    const [valid, setValid] = useState(false);
    const [disableButton, setDisableButton] = useState(true);
    const [verify, setVerify] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<User>({
        username: "",
        email: "",
        password: "",
    });

    const generateOtp = async () => {
        try {
            const email = formData.email;
            const result = await axios.post('/api/user/generateOtp', { email })
            toast.success(result.data.message)
            setVerify(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        const result = dataSchema.safeParse(formData);
        if (!result.success) {
            setDisableButton(true);
            const { _errors, ...newErrors } = result.error.format();
            setError({
                username: newErrors.username?._errors[0] || "",
                email: newErrors.email?._errors[0] || "",
                password: newErrors.password?._errors[0] || "",
            });
        } else {
            setDisableButton(false);
            setError({ username: "", email: "", password: "" });
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const result = await axios.post("api/user/signup", formData);
            toast.success(result.data.message);
            router.push("/login");
        } catch (err: any) {
            setLoading(false);
            toast.error(err.response?.data?.message || "Signup failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-80 bg-white h-4/6 rounded-lg text-black p-4 pt-10 border-2">
                <div className="h-3/4 w-full flex flex-col justify-evenly items-center">
                    <label htmlFor="Name" className="w-64">Name:</label>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        className="border w-64 p-2 rounded-md"
                        placeholder="Enter your Name"
                    />
                    {error.username && (
                        <div className="text-red-500 w-full text-sm flex justify-center">
                            {error.username}
                        </div>
                    )}

                    <label htmlFor="Email" className="w-64">Email:</label>
                    <div className="flex w-full gap-1 pl-4">
                        <input
                            type="text"
                            name="email"
                            onChange={handleChange}
                            className="border w-56 p-2 rounded-md"
                            placeholder="Enter your Email"
                        />
                        {!error.email && (
                            <button className="bg-green-700 p-2 rounded-lg text-white" onClick={generateOtp}>
                                Verify
                            </button>
                        )}
                    </div>
                    {error.email && (
                        <div className="text-red-500 w-full text-sm flex justify-center">
                            {error.email}
                        </div>
                    )}
                    {verify && (
                        <div className="w-full pl-4 pt-1">
                            <InputOTP
                                maxLength={5}
                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                                onChange={async (value) => {
                                    if (value.length == 5) {
                                        try {
                                            const result = await axios.post("/api/user/verify", { otp: value, email: formData.email })
                                            toast.success(result.data.message)
                                            setValid(true);
                                            setVerify(false);
                                        } catch (error) {
                                            toast.error("Invalid Otp")
                                        }
                                    }
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    )}

                    <label htmlFor="Password" className="w-64">Password:</label>
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className="border w-64 p-2 rounded-md"
                        placeholder="Enter your Password"
                    />
                    {error.password && (
                        <div className="text-red-500 w-full text-sm flex justify-center">
                            {error.password}
                        </div>
                    )}
                </div>

                <div className="flex flex-col pt-2">
                    <button
                        disabled={disableButton && !valid}
                        onClick={handleSubmit}
                        className={`bg-blue-700 px-4 p-2 rounded-lg text-white hover:bg-blue-800 ${disableButton ? "cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? <Spinner /> : "Submit"}
                    </button>

                    <span className="p-2 px-5 text-sm">
                        Already have an account?
                        <Link href="/login" className="hover:text-blue-600 ml-1">
                            Login
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
