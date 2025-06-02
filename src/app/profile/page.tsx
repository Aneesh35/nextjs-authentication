"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import toast from 'react-hot-toast'
const page = () => {
    type UserProfile = {
        username: string,
        email: string,
        isVerified: boolean,
        isAdmin: boolean,
    }
    const [data, setUserData] = useState<UserProfile>();
    const getProfile = async () => {
        try {
            const response = await axios.get("/api/user/profile");
            setUserData(response.data.userInfo);
        } catch (error) {
            console.log("error while fetching data");
        }
    }
    useEffect(() => {
        getProfile()
    }, [])
    const resetPassword = async () => {
        try {
            const response = await axios.get("/api/user/reset");
            toast.success(response.data.message)
        } catch (error) {
            toast.error("something went wrong")
        }
    }
    return (
        <>
            {
                data ? (<div className='h-screen w-screen flex justify-center items-center'>
                    <div className="w-96 h-2/3 border-2 rounded-md flex flex-col justify-evenly p-2 bg-gray-100 font-sans">
                        <div className='flex w-full justify-center h-1/4'>
                            <img src="https://github.com/shadcn.png" alt="png" className='h-24 rounded-lg' />
                        </div>
                        <div className='w-full flex justify-center items-center text-2xl border-2 p-2 rounded-md'>{data.username}</div>
                        <div className='w-full flex justify-center items-center text-2xl border-2 p-2 rounded-md'>{data.email}</div>
                        <div className='w-full flex justify-center items-center text-2xl border-2 p-2 rounded-md'>Admin: {data.isAdmin ? "yes" : "No"}</div>
                        <div className='w-full flex justify-center items-center text-2xl border-2 p-2 rounded-md'>verified: {data.isVerified ? "yes" : "No"}</div>
                        <div className='w-full flex justify-center items-center text-2xl  rounded-md'><button className='bg-blue-600 p-2 rounded-md text-white' onClick={resetPassword}>Reset password</button></div>
                    </div>
                </div>) : <Skeleton className="h-[20px] w-[100px] rounded-full" />

            }
        </>
    )
}

export default page