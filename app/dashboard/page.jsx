import Dashboard from '@/components/Dashboard'
import NavBar from '@/components/NavBar'
import React from 'react'


const page = () => {
  return (
    <div className='bg-slate-800 text-white min-h-[100vh]'>
    <NavBar />
    <Dashboard/>
    </div>
  )
}

export default page;
