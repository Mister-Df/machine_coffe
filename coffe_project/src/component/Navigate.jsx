import React from 'react'
import { Link } from 'react-router-dom'

export default function Navigate() {
    return (
        <div className='bg-amber-700  flex flex-col gap-5  py-3.5 px-3 h-[300px] rounded-b-xl w-60'>
            <div className=''>
                <nav className='' >
                    <div className='bg-slate-200 w-[210px] px-2 py-3 rounded-md mx-auto'>
                        <Link  to={'command'} className=' text-sm text-dark text-decoration-none'>Commander une taxe de thé</Link>
                    </div>
                </nav>
            </div>

            <div className=''>
                <nav className='' >
                    <div className='bg-slate-200 w-[210px] px-2 py-3 rounded-md mx-auto'>
                        <Link  to={'machine'} className=' text-sm text-dark text-decoration-none'>Task machine</Link>
                    </div>
                </nav>
            </div>
        </div>
    )
}
