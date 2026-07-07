import React from 'react'
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useZxing } from 'react-zxing';

const QrCode = ({ open, onOpenChange, onScanSuccess }) => {
    const { ref } = useZxing({
        paused: !open,
        onDecodeResult(result) {
            onScanSuccess(result.getText());
        },
    });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-slate-900 rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center">Scanner</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 ">
          <video ref={ref} muted playsInline />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QrCode
