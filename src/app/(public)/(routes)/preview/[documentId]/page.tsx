"use client";

import { useMutation, useQuery } from "convex/react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";
import { Cover, Toolbar } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function DocumentIdPage({
    params: { documentId }
}: {
    params: { documentId: Id<"documents"> }
}) {

    const Editor = useMemo(() => dynamic(() => import("@/components/Editor"), { ssr: false }), []);

    const document = useQuery(api.documents.getById, {
        documentId: documentId
    });

    const update = useMutation(api.documents.update);

    const handleChange = (content: string) => {
        update({
            id: documentId,
            content,
        });
    };

    if (document === undefined) {
        return (
            <div className="">
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="w-[50%] h-14" />
                        <Skeleton className="w-[80%] h-4" />
                        <Skeleton className="w-[40%] h-4" />
                        <Skeleton className="w-[60%] h-4" />
                    </div>
                </div>
            </div>
        )
    }

    if (document === null) {
        return (
            <div className="">
                Not found
            </div>
        )
    }

    return (
        <div className="pb-40">
            <Cover preview url={document.coverImage} />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar preview initialData={document} />
                <Editor editable={false} onChange={handleChange} initialContent={document.content} />
            </div>
        </div>
    )
}