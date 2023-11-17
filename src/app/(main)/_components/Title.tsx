"use client";

import React, { useRef, useState } from 'react'
import { Doc } from '../../../../convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    initialData: Doc<"documents">;
}

const Title = ({ initialData }: Props) => {

    const update = useMutation(api.documents.update);

    const inputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(initialData.title || "Untitled");
    const [isEditing, setIsEditing] = useState(false);

    const handleEnableInput = () => {
        setTitle(initialData.title || "Untitled");
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0, initialData.title?.length);
        }, 0);
    };

    const handleDisableInput = () => {
        setIsEditing(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        update({
            id: initialData._id,
            title: event.target.value || "Untitled",
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleDisableInput();
        }
    };


    return (
        <div className='flex items-center gap-x-1'>
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    value={title}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleDisableInput}
                    onClick={handleEnableInput}
                    className='h-7 px-2 focus-visible:ring-transparent'
                />
            ) : (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleEnableInput}
                    className='font-normal h-auto p-1'
                >
                    <span className="truncate">
                        {initialData?.title}
                    </span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return (
        <Skeleton className='h-8 w-20 rounded-md' />
    )
}

export default Title
