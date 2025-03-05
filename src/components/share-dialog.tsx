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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      "_blank",
    );
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
            <Input readOnly value={url} className="focus-visible:ring-0" />
          </div>
          <Button type="button" size="sm" onClick={handleCopyLink}>
            <Link className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <Button onClick={shareOnTwitter} size="icon" variant="outline">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button onClick={shareOnFacebook} size="icon" variant="outline">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button onClick={shareOnLinkedIn} size="icon" variant="outline">
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
