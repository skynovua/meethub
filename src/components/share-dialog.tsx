"use client";

import { ReactNode, useState } from "react";

import { Facebook, Link, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareDialogProps {
  children: ReactNode;
  url: string;
  title: string;
}

export function ShareDialog({ children, url, title }: ShareDialogProps) {
  const [open, setOpen] = useState(false);

  const getFullUrl = () => {
    if (url.startsWith("http")) return url;
    return `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getFullUrl());
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Failed to copy link");
    }
  };

  const shareOnTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(getFullUrl())}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank", "width=550,height=420");
    setOpen(false);
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getFullUrl())}`;
    window.open(shareUrl, "_blank", "width=626,height=436");
    setOpen(false);
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getFullUrl())}`;
    window.open(shareUrl, "_blank", "width=750,height=600");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
          <DialogDescription>Share this event with your friends and colleagues</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input readOnly value={getFullUrl()} className="focus-visible:ring-0" />
          </div>
          <Button type="button" size="sm" onClick={handleCopyLink}>
            <Link className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <Button
            onClick={shareOnTwitter}
            size="icon"
            variant="outline"
            className="hover:bg-[#1DA1F2]/10"
            title="Share on Twitter"
          >
            <Twitter className="h-5 w-5 text-[#1DA1F2]" />
            <span className="sr-only">Share on Twitter</span>
          </Button>
          <Button
            onClick={shareOnFacebook}
            size="icon"
            variant="outline"
            className="hover:bg-[#1877F2]/10"
            title="Share on Facebook"
          >
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            <span className="sr-only">Share on Facebook</span>
          </Button>
          <Button
            onClick={shareOnLinkedIn}
            size="icon"
            variant="outline"
            className="hover:bg-[#0A66C2]/10"
            title="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5 text-[#0A66C2]" />
            <span className="sr-only">Share on LinkedIn</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
