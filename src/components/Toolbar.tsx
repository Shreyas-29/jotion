"use client";

import React, { useRef, useState } from 'react'
import { Doc } from '../../convex/_generated/dataModel';
import { IconPicker } from '.';
import { Button } from './ui/button';
import { ImageIcon, Smile, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from '@/hooks/use-cover-image';

interface Props {
    initialData: Doc<"documents">;
    preview?: boolean;
}

const Toolbar = ({ initialData, preview }: Props) => {

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const update = useMutation(api.documents.update);

    const removeIcon = useMutation(api.documents.removeIcon);

    const coverImage = useCoverImage();

    const [isEditing, setIsEditing] = useState(false);

    const [value, setValue] = useState(initialData.title);

    const handleEnableInput = () => {
        if (preview) return;

        setIsEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
            inputRef.current?.focus();
        }, 0);
    };

    const handleDisableInput = () => {
        setIsEditing(false);
    };

    const handleInput = (value: string) => {
        setValue(value);
        update({
            id: initialData._id,
            title: value || "Untitled"
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleDisableInput();
        };
    };

    const handleIconSelect = (icon: string) => {
        update({
            id: initialData._id,
            icon,
        });
    };

    const handleIconRemove = () => {
        removeIcon({
            id: initialData._id,
        });
    };


    return (
        <div className='pl-[54px] group relative'>
            {!!initialData.icon && !preview && (
                <div className="flex items-center gap-x-2 group/icon pt-6">
                    <IconPicker onChange={handleIconSelect}>
                        <p className="text-6xl hover:opacity-75 transition">
                            {initialData.icon}
                        </p>
                    </IconPicker>
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
                        onClick={handleIconRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {!!initialData.icon && preview && (
                <p className="text-6xl pt-6">
                    {initialData.icon}
                </p>
            )}

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
                {!initialData.icon && !preview && (
                    <IconPicker asChild onChange={handleIconSelect}>
                        <Button
                            className="text-muted-foreground text-xs"
                            variant="outline"
                            size="sm"
                        >
                            <Smile className="h-4 w-4 mr-2" />
                            Add icon
                        </Button>
                    </IconPicker>
                )}
                {!initialData.coverImage && !preview && (
                    <Button
                        onClick={coverImage.onOpen}
                        className="text-muted-foreground text-xs"
                        variant="outline"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add cover
                    </Button>
                )}
            </div>
            {isEditing && !preview ? (
                <TextareaAutosize
                    ref={inputRef}
                    onBlur={handleDisableInput}
                    onKeyDown={handleKeyDown}
                    value={value}
                    onChange={(e) => handleInput(e.target.value)}
                    className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
                />
            ) : (
                <div
                    onClick={handleEnableInput}
                    className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
                >
                    {initialData.title}
                </div>
            )}
        </div>
    )
}

export default Toolbar
