"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const SendMessageForm = ({ patient }: { patient: any }) => {
  const handleSendMessage = () => {
    console.log("Message sent to:", patient.name);
  };

  const [open, setOpen] = useState(false);

  return (
    <DialogContent className="shad-dialog sm:max-w-md">
      <DialogHeader className="mb-4 space-y-3">
        <DialogTitle className="capitalize">Send Message</DialogTitle>
        <DialogDescription>
          Please fill in the following Message to send to {patient.name}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <textarea
          id="message"
          name="message"
          rows={4}
          className="block w-full rounded-lg border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-primary"
          placeholder="Message"
        />
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};
