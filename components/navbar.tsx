import React from 'react'
import Link from 'next/link'
import Logo from '../public/images/Group 1.png'
import NavItems from './navItems'

const Navbar = () => {
    return (
        <nav className='navbar'>
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <img src={Logo.src} alt="Logo" width={30} height={30} />
                </div>
            </Link>
            <div className="flex item-center gap-8">
                <NavItems />
                <p>Sign In</p>
            </div>
        </nav>
    )
}

export default Navbar
