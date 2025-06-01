"use client"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { dataSchema } from "@/schemas/userSchema"
import toast from "react-hot-toast";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";

export default function SignUp() {

    type User = z.infer<typeof dataSchema>

    const router = useRouter();

    const [formData, setFormData] = useState<User>({
        username: '',
        email: '',
        password: ''
    })

    const [disableButton, setDisableButton] = useState(true);

    const [loading, setLoading] = useState(false)

    const [error, setError] = useState<User>({
        username: '',
        email: '',
        password: ''
    });

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
            setError({ username: '', email: '', password: '' });
        }
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const result = await axios.post("api/user/signup", formData);
            toast.success(result.data.message);
            router.push('/login');
        } catch (err: any) {
            setLoading(false)
            toast.error(err.response?.data?.message || "Signup failed.");
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-80 bg-white h-4/6 rounded-lg text-black p-4 pt-10  border-2">
                <div className="h-3/4 w-full flex flex-col justify-evenly items-center">
                    <label htmlFor="Name" className="w-64">Name:</label>
                    <input type="text" name="username" onChange={handleChange} className="border-1 w-64 p-2 rounded-md" placeholder="Enter your Name" />
                    {error.username ? <div className="text-red-500 w-full text-sm flex justify-center items-start">{error.username}</div> : null}
                    <label htmlFor="Email" className="w-64">Email:</label>
                    <input type="text" name="email" onChange={handleChange} className="border-1 w-64 p-2 rounded-md" placeholder="Enter your Email" />
                    {error.email ? <div className="text-red-500 w-full text-sm flex justify-center items-start">{error.email}</div> : null}
                    <label htmlFor="Password" className="w-64">password:</label>
                    <input type="password" name="password" onChange={handleChange} className="border-1 w-64 p-2 rounded-md" placeholder="Enter your password" />
                    {error.password ? <div className="text-red-500 w-full text-sm flex justify-center items-start">{error.password}</div> : null}
                </div>
                <div className=" flex flex-col pt-2">
                    <button disabled={disableButton} className={`bg-blue-700 px-4 p-2 rounded-lg text-white hover:bg-blue-800   ${disableButton ? "cursor-not-allowed" : ""} `} onClick={handleSubmit}>{loading ? <Spinner /> : "submit"}</button>
                    <span className="p-2 px-5">
                        already have any account?
                        <Link href={"/login"} className="hover:text-blue-600"> Login</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}