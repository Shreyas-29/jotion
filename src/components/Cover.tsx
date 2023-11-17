"use client";

import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
import { ImageIcon, X } from 'lucide-react';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '../../convex/_generated/dataModel';
import { useEdgeStore } from '@/lib/edgestore';
import { Skeleton } from './ui/skeleton';

interface Props {
    url?: string;
    preview?: boolean;
}

const Cover = ({ url, preview }: Props) => {

    const params = useParams();

    const coverImage = useCoverImage();

    const { edgestore } = useEdgeStore();

    const removeCoverImage = useMutation(api.documents.removeCoverImage);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRemoveCoverImage = async () => {
        setIsLoading(true);
        if (url) {
            await edgestore.publicFiles.delete({
                url: url
            })
        }

        removeCoverImage({
            id: params.documentId as Id<"documents">
        });
        setIsLoading(false);
    };

    return (
        <div className={cn(
            "relative w-full h-[35vh] group",
            !url && "h-[12vh]",
            url && "bg-muted",
        )}>
            {!!url && (
                <Image
                    src={url}
                    fill
                    alt='Cover image'
                    className='object-cover w-full h-full'
                />
            )}

            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 transition-opacity duration-300">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => coverImage.onReplace(url)}
                        className='text-muted-foreground text-xs'
                    >
                        <ImageIcon className='w-4 h-4 mr-2' />
                        Change cover
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        isLoading={isLoading}
                        onClick={handleRemoveCoverImage}
                        className='text-muted-foreground text-xs'
                    >
                        <X className='w-4 h-4 mr-2' />
                        Remove cover
                    </Button>
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return (
        <Skeleton className='w-full h-[12vh]' />
    )
}

export default Cover
