"use client";

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronsLeft, Menu, Plus, PlusCircle, Search, Settings, Trash } from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import UserItem from './UserItem';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Item from './Item';
import { toast } from 'sonner';
import DocumentList from './DocumentList';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TrashBox from './TrashBox';
import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';
import Navbar from './Navbar';

interface Props {

}

const Navigation: React.FC<Props> = () => {

    const pathname = usePathname();

    const params = useParams();

    const router = useRouter();

    const search = useSearch();

    const settings = useSettings();

    const isMobile = useMediaQuery('(max-width: 768px)');

    const create = useMutation(api.documents.create);

    const isResizeRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);

    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            handleCollapse();
        } else {
            handleResetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            handleCollapse();
        }
    }, [pathname, isMobile]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        isResizeRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizeRef.current) return;
        let newWidth = event.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
        }
    };

    const handleMouseUp = () => {
        isResizeRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleResetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "calc(100% - 240px)");
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

            setTimeout(() => {
                setIsResetting(false);
            }, 300);
        }
    };

    const handleCollapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");

            setTimeout(() => {
                setIsResetting(false);
            }, 300);
        }
    };

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
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )}
            >
                <div
                    role='button'
                    onClick={handleCollapse}
                    className={cn(
                        "absolute w-6 h-6 transition rounded-sm opacity-0 text-muted-foreground hover:bg-neutral-300 dark:bg-neutral-600 top-3 right-2 group-hover/sidebar:opacity-100",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className='w-6 h-6' />
                </div>
                <div className="">
                    <UserItem />
                    <Item
                        onClick={search.onOpen}
                        label="Search"
                        icon={Search}
                        isSearch
                    />
                    <Item
                        onClick={settings.onOpen}
                        label="Settings"
                        icon={Settings}
                    />
                    <Item
                        onClick={handleCreate}
                        label="New page"
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                    <DocumentList />
                    <Item
                        label="Add a page"
                        icon={Plus}
                        onClick={handleCreate}
                    />
                    <Popover>
                        <PopoverTrigger className='w-full mt-4'>
                            <Item
                                label='Trash'
                                icon={Trash}
                            />
                        </PopoverTrigger>
                        <PopoverContent
                            side={isMobile ? "bottom" : "right"}
                            className='p-0 w-72'
                        >
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={handleResetWidth}
                    className="absolute top-0 right-0 w-1 h-full transition opacity-0 group-hover/sidebar:opacity-100 cursor-ew-resize bg-primary/10"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )}
            >
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        handleResetWidth={handleResetWidth}
                    />
                ) : (
                    <nav className="w-full px-3 py-2 bg-transparent">
                        {isCollapsed ? <Menu
                            role='button'
                            onClick={handleResetWidth}
                            className='w-6 h-6 text-muted-foreground'
                        /> : null}
                    </nav>
                )}
            </div>
        </>
    )
}

export default Navigation
