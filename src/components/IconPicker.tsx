"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from 'next-themes';
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

interface Props {
    onChange: (icon: string) => void;
    children: React.ReactNode;
    asChild?: boolean;
}

const IconPicker: React.FC<Props> = ({ children, onChange, asChild }) => {

    const { resolvedTheme } = useTheme();

    const currentTheme = (resolvedTheme || "light");

    const themeMap: { [key: string]: Theme } = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT
    };

    const theme = themeMap[currentTheme];

    return (
        <Popover>
            <PopoverTrigger asChild={asChild}>
                {children}
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full border-none shadow-none">
                <EmojiPicker
                    height={350}
                    theme={theme}
                    onEmojiClick={(data) => onChange(data.emoji)}
                />
            </PopoverContent>
        </Popover>
    )
}

export default IconPicker
