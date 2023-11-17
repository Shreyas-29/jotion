"use client";

import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react';
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUser } from '@clerk/clerk-react';

interface Props {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    label: string;
    onExpand?: () => void;
    onClick?: () => void;
    icon: LucideIcon;
}

const Item = ({
    id,
    icon: Icon,
    label,
    onClick,
    active,
    documentIcon,
    expanded,
    isSearch,
    level = 0,
    onExpand
}: Props) => {

    const router = useRouter();

    const { user } = useUser();

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    const create = useMutation(api.documents.create);

    const archive = useMutation(api.documents.archive);

    const handleExpand = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        onExpand?.();
    };

    const handleCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!id) return;
        const promise = create({ title: "Untitled", parentDocument: id })
            .then((documentId) => {
                if (!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            });

        toast.promise(promise, {
            loading: "Creating...",
            success: "Document created!",
            error: "Failed to create document",
        });
    };

    const handleArchive = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        if (!id) return;

        const promise = archive({ id })
            .then(() => router.push("/documents"));

        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Document moved to trash!",
            error: "Failed to archive note.",
        });
    };



    return (
        <div
            onClick={onClick}
            role='button'
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : "12px",
            }}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div
                    role='button'
                    className="h-full mr-1 rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
                    onClick={handleExpand}
                >
                    <ChevronIcon className='w-4 h-4 shrink-0 text-muted-foreground/50' />
                </div>
            )}

            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : (
                <Icon className='mr-2 text-muted-foreground shrink-0 h-[18px] w-[18px]' />
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd className='ml-auto pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-muted-foreground h-5 opacity-100'>
                    <span className='text-xs'>⌘</span>K
                </kbd>
            )}

            {!!id && (
                <div className="flex items-center ml-auto gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div role='button' className='h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600'>
                                <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='start'
                            className='w-60'
                            side='right'
                            forceMount
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DropdownMenuItem onClick={handleArchive} className='cursor-pointer'>
                                <Trash className='w-4 h-4 mr-2 text-muted-foreground' />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="p-2 text-xs text-muted-foreground">
                                Last edited by {" "}
                                <span className="font-medium">{user?.fullName}</span>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        role='button'
                        className="h-full ml-auto rounded-sm opacity-0 group-hover:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                        onClick={handleCreate}
                    >
                        <Plus className='w-4 h-4 text-muted-foreground' />
                    </div>
                </div>
            )}
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{
                paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}

export default Item
