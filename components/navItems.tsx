'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const NavItems = [
    { label: 'Home', link: '/' },
    { label: 'Companions', link: '/Companions' },
    { label: 'my-journey', link: '/my-journey' }

]

const navItems = () => {
    const pathname = usePathname();

    return (
        <nav className='flex items-center gap-4'>
            {NavItems.map(({ label, link }) => (
                <Link href={link} key={label} className={`cursor-pointer hover:text-gray-600 ${pathname === link ? 'text-black font-semibold' : ''}`}  >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default navItems
