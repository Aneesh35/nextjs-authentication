"use client"
import Link from 'next/link'
import React from 'react'
import { User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function page() {
  const router=useRouter();
  const handleLogout=async()=>{
    try {
      const result=await axios.get("/api/user/logout")
      toast.success(result.data.message);
      router.push("/login")
    } catch (error) {
      toast.error("failed to logout!!");
    }
  }
  return (
    <div className='h-screen w-screen pt-5'>
      <div className='w-full flex relative'>
        <div className='absolute left-2 flex bg-black text-white px-3 py-2 rounded-md'>
          <User />
          <Link href={"/profile"}>Profile</Link>
        </div>
        <button className='bg-red-700 px-3 py-2 rounded-md text-white absolute right-2' onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}