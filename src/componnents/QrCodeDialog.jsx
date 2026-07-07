// import React from 'react'
// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { useZxing } from 'react-zxing';

// const QrCode = ({ open, onOpenChange, onScanSuccess }) => {
//     const [videoRef, setVideoRef] = useState(null);
//     const { ref } = useZxing({
//         paused: !open || !videoRef, // Ждем, пока videoRef не будет задан
//         onDecodeResult(result) {
//             console.log(result.getText())
//             onScanSuccess(result.getText());
//         },
//     });
//     const handleVideoRef = (element) => {
//         ref.current = element; // Привязываем к zxing
//         setVideoRef(element);  // Сообщаем React, что видео готово
//     };
//     console.log("Scanner ready:", !!videoRef)
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md bg-white text-slate-900 rounded-3xl p-6">
//         <DialogHeader>
//           <DialogTitle className="text-center">Scanner</DialogTitle>
//         </DialogHeader>
        
//         <div className="mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 ">
//           <video ref={handleVideoRef} muted playsInline/>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default QrCode;
import React, { useEffect } from 'react';
import { Html5Qrcode } from "html5-qrcode"; // Используем класс напрямую
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const QrCodeDialog = ({ open, onOpenChange, onScanSuccess }) => {
    
    useEffect(() => {
        // 1. Инициализируем только если окно открыто
        if (!open) return;

        // 2. Даем небольшую задержку, чтобы DOM-элемент Dialog'а точно появился
        const timer = setTimeout(() => {
            const html5QrCode = new Html5Qrcode("reader");
            
            html5QrCode.start(
                { facingMode: "environment" }, // Задняя камера
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    html5QrCode.stop().then(() => {
                        onScanSuccess(decodedText);
                    });
                },
                (err) => { /* Игнорируем ошибки сканирования */ }
            ).catch(err => console.error("Ошибка камеры:", err));

            // 3. Очистка при закрытии или обновлении
            return () => {
                html5QrCode.stop().catch(() => {});
            };
        }, 300);

        return () => clearTimeout(timer);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white text-slate-900 rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-center">Scanner</DialogTitle>
                </DialogHeader>
                
                {/* Элемент должен существовать в DOM до инициализации */}
                <div id="reader" className="mt-4 overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 bg-black">
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QrCodeDialog;