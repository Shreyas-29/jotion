"use client";

import { Spinner } from '@/components';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const Heading = () => {

    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="flex flex-col items-center justify-center max-w-3xl space-y-4">
            <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl">
                Your Ideas, Documents, & Plans. Unified. Welcome to {" "}
                <span className="underline">
                    Jotion
                </span>
            </h1>
            <h3 className="text-base font-medium sm:text-xl md:text-2xl">
                Jotion is the connected workspace where <br />
                better, faster work happens.
            </h3>

            {isLoading ? (
                <div className="flex items-center justify-center w-full">
                    <Spinner />
                </div>
            ) : null}

            {isAuthenticated && !isLoading ? (
                <Button asChild>
                    <Link href="/documents" className='flex items-center justify-center'>
                        Enter Jotion
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </Button>
            ) : null}

            {!isAuthenticated && !isLoading ? (
                <SignInButton mode='modal'>
                    <Button asChild className='flex items-center justify-center'>
                        Get Jotion free
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </SignInButton>
            ) : null}

        </div>
    )
}

export default Heading
