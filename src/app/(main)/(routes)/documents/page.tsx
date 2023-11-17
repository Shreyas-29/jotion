"use client";

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { Plus, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { api } from '../../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {

    const { user } = useUser();

    const router = useRouter();

    const create = useMutation(api.documents.create);

    const handleCreate = () => {
        const promise = create({ title: 'Untitled' })
            .then((documentId) => {
                router.push(`/documents/${documentId}`);
            });

        toast.promise(promise, {
            loading: 'Creating a new note...',
            success: 'New note created!',
            error: 'Failed to create a new note.'
        });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Image
                src="/empty.png"
                alt="Empty"
                width={300}
                height={300}
                className="block dark:hidden"
            />
            <Image
                src="/empty-dark.png"
                alt="Empty"
                width={300}
                height={300}
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s Jotion!
            </h2>
            <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create a note
            </Button>
        </div>
    )
}