"use client";

import React from 'react';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className="min-h-full h-full dark:bg-[#1F1F1F]">
            {children}
        </div>
    )
};