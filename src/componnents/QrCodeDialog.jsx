import React from 'react'
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useZxing } from 'react-zxing';

const QrCode = ({ open, onOpenChange, onScanSuccess }) => {
    const [videoRef, setVideoRef] = useState(null);
    const { ref } = useZxing({
        paused: !open || !videoRef, // Ждем, пока videoRef не будет задан
        constraints: { video: { facingMode: { ideal: "environment" } } },
        onDecodeResult(result) {
            onScanSuccess(result.getText());
        },
    });
    const handleVideoRef = (element) => {
        ref.current = element; // Привязываем к zxing
        setVideoRef(element);  // Сообщаем React, что видео готово
    };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-slate-900 rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center">Scanner</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 ">
          <video ref={handleVideoRef} muted playsInline className="w-full h-auto rounded-xl"/>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QrCode;