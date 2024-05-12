import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Sidebar({ open, setOpen, children }: SidebarProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="border-r border-secondary bg-card">
        {children}
      </SheetContent>
    </Sheet>
  );
}
