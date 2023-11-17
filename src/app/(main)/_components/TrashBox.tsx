"use client";

import { useMutation, useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { ConfirmModal, Spinner } from '@/components';
import { FileDownIcon, Search, Trash, Undo } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {

}

const TrashBox: React.FC<Props> = () => {

    const router = useRouter();

    const params = useParams();

    const documents = useQuery(api.documents.getTrash);

    const restore = useMutation(api.documents.restore);

    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLowerCase());
    });

    const handleClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    const handleRestore = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, documentId: Id<"documents">) => {
        event.stopPropagation();

        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note.",
        });
    };

    const handleRemove = (documentId: Id<"documents">) => {

        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note.",
        });

        if (params.documentId === documentId) {
            router.push("/documents");
        }
    };

    if (documents === undefined) {
        return (
            <div className="flex items-center justify-center h-full py-2">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className='text-sm'>
            <div className="flex items-center p-2 gap-x-1">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className='px-2 h-7 focus-visible:ring-transparent bg-secondary'
                    placeholder='Filter by page title...'
                />
            </div>
            <div className="px-1 pb-1 mt-2">
                <p className="hidden pb-2 text-xs text-center last:block text-muted-foreground">
                    No documents in trash.
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                        key={document._id}
                        role='button'
                        onClick={() => handleClick(document._id)}
                        className="flex items-center justify-between w-full text-sm rounded-sm text-primary hover:bg-primary/5"
                    >
                        <span className="pl-2 truncate">
                            {document.title}
                        </span>
                        <div className='flex items-center'>
                            <div
                                onClick={(e) => handleRestore(e, document._id)}
                                role='button'
                                className='p-2 rounded-sm hover:bg-neutral-200'
                            >
                                <Undo className='w-4 h-4 text-muted-foreground' />
                            </div>
                            <ConfirmModal handleConfirm={() => handleRemove(document._id)}>
                                <div
                                    role='button'
                                    className='p-2 rounded-sm hover:bg-neutral-200'
                                >
                                    <Trash className='w-4 h-4 text-muted-foreground' />
                                </div>
                            </ConfirmModal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrashBox
