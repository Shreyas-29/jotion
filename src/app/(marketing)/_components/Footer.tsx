import React from 'react'
import Logo from './Logo'
import { Button } from '@/components/ui/button'

const Footer = () => {
    return (
        <footer className='z-50 flex items-center w-full p-6 bg-background dark:bg-[#1f1f1f]'>
            <Logo />
            <div className="flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2 text-muted-foreground">
                <Button variant="ghost" size="sm">
                    Privacy Policy
                </Button>
                <Button variant="ghost" size="sm">
                    Terms & Conditions
                </Button>
            </div>
        </footer>
    )
}

export default Footer
