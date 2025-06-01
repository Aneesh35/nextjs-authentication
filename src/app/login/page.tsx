"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LoginSchema } from "@/schemas/userSchema"
import { z } from "zod"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Spinner } from "@/components/ui/spinner";

type User = z.infer<typeof LoginSchema>

export default function Login() {

    const [formData, setFormData] = useState<User>({
        email: '',
        password: ''
    })
    
    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const [disableButton, setDisableButton] = useState(false)

    const [error, setError] = useState<User>({
        email: "",
        password: ""
    })

    useEffect(() => {
        const result = LoginSchema.safeParse(formData)
        if (!result.success) {
            setDisableButton(true)
            const { _errors, ...error } = result.error.format()
            setError({
                email: error.email?._errors[0] || "",
                password: error.password?._errors[0] || "",
            })
        }
        else {
            setDisableButton(false)
            setError({
                email: "",
                password: "",
            })
        }
    }, [formData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const result = await axios.post("api/user/login", formData)
            toast.success(result.data.message);
            router.push('/dashboard');
            setLoading(false)
        } catch (err: any) {
            setLoading(false)
            toast.error(err.response?.data?.message || "Signup failed.");
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-80 bg-white h-3/6 rounded-lg text-black p-4 pt-10 border-2">
                <div className="h-4/6 w-full flex flex-col justify-evenly items-center">
                    <label htmlFor="email" className="w-64">Email:</label>
                    <input type="text" name="email" onChange={handleChange} className="border-1 w-64 p-2 rounded-md" placeholder="Enter your Email" />
                    {error.email ? <div className="text-red-500 w-full text-sm flex justify-center items-start">{error.email}</div> : null}
                    <label htmlFor="password" className="w-64">password:</label>
                    <input type="text" name="password" onChange={handleChange} className="border-1 w-64 p-2 rounded-md" placeholder="Enter your password" />
                </div>
                <div className=" flex flex-col pt-4 items-center">
                    <button disabled={disableButton} className={`bg-blue-700 px-4 p-2 rounded-lg text-white hover:bg-blue-800 w-full ${disableButton ? "cursor-not-allowed" : ""}`} onClick={handleSubmit}>{loading ? <Spinner /> : "login"}</button>
                    <span className="p-2 px-5">
                        Don't an account?
                        <Link href={"/signup"} className="hover:text-blue-600"> SignUp</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}