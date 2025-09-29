import React from 'react'
import { User } from "lucide-react"
import { useNavigate } from '@tanstack/react-router';

function Header() {
  const navigate= useNavigate()

  const goHome=() =>{
    navigate({to: "/admin"})
  }

  return (
    <div className="flex justify-between items-center bg-[#0F172A] w-full h-20 text-white p-4">
        <div className='cursor-pointer' onClick={goHome}>
            Logo
        </div>
        <div className='flex items-center gap-1'>
            <User className="w-4 h-4"  />
            Usuario
        </div>
    </div>
  )
}

export default Header