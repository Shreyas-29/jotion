"use client";

import { useQuery } from 'convex/react';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '../../../../convex/_generated/dataModel';
import { MenuIcon } from 'lucide-react';
import Title from './Title';
import Banner from './Banner';
import Menu from './Menu';
import Publish from './Publish';

interface Props {
    isCollapsed: boolean;
    handleResetWidth: () => void
}

const Navbar: React.FC<Props> = ({ handleResetWidth, isCollapsed }) => {

    const params = useParams();

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">,
    });

    if (document === undefined) {
        return (
            <nav className='bg-background w-full flex items-center justify-between dark:bg-[#1f1f1f] px-3 py-2'>
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        )
    }

    if (document === null) {
        return null;
    }

    return (
        <>
            <nav className='bg-background w-full flex items-center gap-x-4 dark:bg-[#1f1f1f] px-3 py-2'>
                {isCollapsed && (
                    <MenuIcon
                        role='button'
                        onClick={handleResetWidth}
                        className='w-6 h-6 text-muted-foreground'
                    />
                )}

                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />
                    <div className="flex items-center gap-x-2">
                        <Publish initialData={document} />
                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>

            {document?.isArchived && (
                <Banner documentId={document._id} />
            )}
        </>
    )
}

export default Navbar
