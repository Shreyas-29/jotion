"use client";

import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components';

interface Props {
    documentId: Id<"documents">;
}

const Banner: React.FC<Props> = ({ documentId }) => {

    const router = useRouter();

    const remove = useMutation(api.documents.remove);

    const restore = useMutation(api.documents.restore);

    const handleRemove = () => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });

        router.push("/documents");
    };

    const handleRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };


    return (
        <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
            <p className="">
                This page is in Trash.
            </p>
            <Button
                size="sm"
                variant="outline"
                onClick={handleRestore}
                className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
            >
                Restore page
            </Button>
            <ConfirmModal handleConfirm={handleRemove}>
                <Button
                    size="sm"
                    variant="outline"
                    className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Banner
