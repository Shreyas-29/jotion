"use client";

import React from 'react'
import {
    BlockNoteEditor,
    PartialBlock
} from "@blocknote/core";
import {
    BlockNoteView,
    useBlockNote
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';


interface Props {
    onChange: (value: string) => void;
    initialContent?: string | undefined;
    editable?: boolean;
}

const Editor = ({ initialContent, onChange, editable }: Props) => {

    const { resolvedTheme } = useTheme();

    const { edgestore } = useEdgeStore();

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({
            file,
        });

        return response.url
    };

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        onEditorContentChange: (editor) => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
        },
        uploadFile: handleUpload,
    });


    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    )
}

export default Editor
