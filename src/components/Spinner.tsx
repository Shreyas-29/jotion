import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority'
import { Loader, Loader2 } from 'lucide-react';
import React from 'react'


const spinnerVariants = cva(
    "text-muted-foreground animate-spin",
    {
        variants: {
            size: {
                default: "w-4 h-4",
                sm: "h-2 w-2",
                lg: "h-6 w-6",
                icon: "w-10 h-10"
            }
        },
        defaultVariants: {
            size: "default"
        }
    }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> { };

const Spinner = ({
    size,
}: SpinnerProps) => {
    return (
        <Loader className={cn(spinnerVariants({ size }))} />
    );
};

export default Spinner
