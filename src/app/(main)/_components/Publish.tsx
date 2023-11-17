"use client";

import React, { useState } from 'react'
import { Doc } from '../../../../convex/_generated/dataModel';
import { useOrigin } from '@/hooks/use-origin';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, Copy, Globe } from 'lucide-react';

interface Props {
    initialData: Doc<"documents">;
}

const Publish: React.FC<Props> = ({ initialData }) => {

    const origin = useOrigin();

    const update = useMutation(api.documents.update);

    const [copied, setCopied] = useState<boolean>(false);
    const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

    const url = `${origin}/preview/${initialData._id}`;

    const handlePublish = () => {
        setIsSubmiting(true);

        const promise = update({
            id: initialData._id,
            isPublished: true,
        })
            .finally(() => setIsSubmiting(false));

        toast.promise(promise, {
            loading: 'Publishing...',
            success: 'Note Published!',
            error: 'Failed to publish note.',
        });
    };

    const handleUnPublish = () => {
        setIsSubmiting(true);

        const promise = update({
            id: initialData._id,
            isPublished: false,
        })
            .finally(() => setIsSubmiting(false));

        toast.promise(promise, {
            loading: 'Unpublishing...',
            success: 'Note Unpublished!',
            error: 'Failed to unpublish note.',
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost">
                    Publish
                    {initialData.isPublished && (
                        <Globe className='w-4 h-4 text-sky-500 ml-2' />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-72'
                align='end'
                alignOffset={8}
                forceMount
            >
                {initialData.isPublished ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className='w-4 h-4 text-sky-500 ' />
                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                value={url}
                                className='text-xs flex-1 px-2 border rounded-l-md h-8 bg-muted truncate'
                            />
                            <Button
                                onClick={handleCopy}
                                disabled={copied}
                                className='h-8 rounded-l-none'
                            >
                                {copied ? (
                                    <Check className='w-4 h-4 text-sky-500 ' />
                                ) : (
                                    <Copy className='w-4 h-4 text-sky-500 ' />
                                )}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            disabled={isSubmiting}
                            isLoading={isSubmiting}
                            onClick={handleUnPublish}
                            className='w-full text-xs'
                        >
                            Unpublish
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Globe className='w-8 h-8 text-muted-foreground mb-2' />
                        <p className="text-sm font-medium mb-2">
                            Publish this note
                        </p>
                        <span className="text-xs text-muted-foreground mb-4">
                            Share your note with others.
                        </span>
                        <Button
                            size="sm"
                            onClick={handlePublish}
                            isLoading={isSubmiting}
                            disabled={isSubmiting}
                            className='w-full text-xs'
                        >
                            Publish
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}

export default Publish
