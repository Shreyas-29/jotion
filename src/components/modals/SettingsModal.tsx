"use client";

import { useSettings } from '@/hooks/use-settings';
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from "@/components/ui/label";
import { ThemeToggle } from '..';

interface Props {

}

const SettingsModal: React.FC<Props> = () => {

    const settings = useSettings();

    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader className='pb-3 border-b'>
                    <h2 className="text-lg font-medium">
                        My Settings
                    </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>
                            Appearance
                        </Label>
                        <span className='text-[0.8rem] text-muted-foreground'>
                            Customize how Jotion looks on your device.
                        </span>
                    </div>
                    <ThemeToggle />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsModal
