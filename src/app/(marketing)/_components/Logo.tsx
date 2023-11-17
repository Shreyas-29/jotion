import Image from 'next/image'
import React from 'react'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils';

const font = Poppins({
    subsets: ['latin'],
    weight: ["400", "600"],
});

const Logo = () => {
    return (
        <div className="items-center hidden md:flex gap-x-2">
            <Image
                src="/logo.svg"
                alt='Logo'
                width={36}
                height={36}
                className='dark:hidden'
            />
            <Image
                src="/logo-dark.svg"
                alt='Logo'
                width={36}
                height={36}
                className='hidden dark:block'
            />
            <p className={cn("font-semibold", font.className)}>
                Jotion
            </p>
        </div>
    )
}

export default Logo;