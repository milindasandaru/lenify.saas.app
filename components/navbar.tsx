import React from 'react'
import Link from 'next/link'
import Logo from '../public/images/Group 1.png'
import NavItems from './navItems'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

const Navbar = () => {
    return (
        <nav className='navbar flex items-center justify-between'>
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <img src={Logo.src} alt="Logo" width={30} height={30} />
                </div>
            </Link>
            <div className="flex items-center gap-8">
                <NavItems />
                <div className="flex items-center gap-2">
                  <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
