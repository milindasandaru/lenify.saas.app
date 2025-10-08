'use client';

import React, { use } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/dist/client/components/navigation';

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
                <Link href={link} key={label} className={`cursor-pointer hover:text-gray-500 ${pathname === link ? 'text-gray-500 font-semibold' : ''}`}  >
                    {label}
                </Link>
            ))}
        </nav>
    )
}

export default navItems
