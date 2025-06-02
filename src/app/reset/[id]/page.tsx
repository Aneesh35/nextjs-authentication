"use client";
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Page = ({ params }: { params: { id: string[] } }) => {
  const { id } = params;
  const [formdata, setFormData] = useState({
    password: "",
    resetPassword: "",
  })
  const handleChange = (event: any) => {
    setFormData((form) => ({ ...form, [event.target.name]: event.target.value }))
  }
  const resetPassword = async () => {
    try {
      if (formdata.password.trim() !== formdata.resetPassword.trim()) {
        toast.error("password should match each other")
        return;
      }
      if (formdata.password.length <= 5) {
        toast.error("password should be atleast 6 character long")
        return;
      }
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[*#%?@!$&]).+$/.test(formdata.password)){
        toast.error("password should contain uppercase and special character")
        return;
      }
      // console.log(formdata.password)
      const response = await axios.put("/api/user/reset", {
          password: formdata.password, link:id
        })
      toast.success(response.data.message);
    } catch (error) {
      toast.error("unable to reset password")
    }
  };

  return (
    <div className='flex w-screen h-screen justify-center items-center'>
      <div className='w-64 h-72 border-2 rounded-lg flex flex-col items-center justify-center gap-3 p-7'>
        <label htmlFor="new-password" className='w-full'>New password</label>
        <input type="password" id="new-password" name='password' className='border-2 p-2' placeholder='Enter your new password' onChange={handleChange} />
        <label htmlFor="confirm-password" className='w-full'>Re-enter New password</label>
        <input type="password" id="confirm-password" name='resetPassword' className='border-2 p-2' placeholder='Re-enter your new password' onChange={handleChange} />
        <button className='bg-green-700 rounded-lg px-2 py-2 text-white' onClick={resetPassword}>Submit</button>
      </div>
    </div>
  );
};

export default Page;
