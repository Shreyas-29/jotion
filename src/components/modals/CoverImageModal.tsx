"use client";

import { useCoverImage } from '@/hooks/use-cover-image';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '../../../convex/_generated/dataModel';
import { SingleImageDropzone } from '..';

interface Props {

}

const CoverImageModal = ({ }: Props) => {

    const params = useParams();

    const coverImage = useCoverImage();

    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { edgestore } = useEdgeStore();

    const update = useMutation(api.documents.update);

    const handleChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
                options: {
                    replaceTargetUrl: coverImage?.url
                }
            });

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url,
            });

            handleClose();
        };
    };

    const handleClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    };


    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <SingleImageDropzone
                    className="w-full outline-none max-h-80 overflow-hidden"
                    disabled={isSubmitting}
                    value={file}
                    onChange={handleChange}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CoverImageModal
