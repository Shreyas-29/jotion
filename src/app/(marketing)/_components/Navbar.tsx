"use client";

import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import React from 'react'
import Logo from './Logo';
import { Spinner, ThemeToggle } from '@/components';
import { useConvexAuth } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Navbar = () => {

    const scrolled = useScrollTop();

    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <header className={cn(
            "z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 inset-x-0 flex items-center w-full px-6 py-2",
            scrolled && "shadow-sm border-b"
        )}>
            <Logo />
            <div className="flex items-center justify-between w-full md:ml-auto md:justify-end gap-x-2">
                {isLoading ? (
                    <Spinner />
                ) : null}

                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode='modal'>
                            <Button variant="ghost" size="sm">
                                Log In
                            </Button>
                        </SignInButton>
                        <SignInButton mode='modal'>
                            <Button size="sm">
                                Get Jotion free
                            </Button>
                        </SignInButton>
                    </>
                )}

                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm">
                            <Link href="/documents">
                                Enter Jotion
                            </Link>
                        </Button>
                        <UserButton afterSignOutUrl='/' />
                    </>
                )}

                <ThemeToggle />
            </div>
        </header>
    )
}

export default Navbar
