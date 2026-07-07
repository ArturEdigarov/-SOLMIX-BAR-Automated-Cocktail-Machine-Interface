import React from 'react';
import QRCode from 'react-qr-code';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ShareDialog = ({ open, onOpenChange, data }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>Dein Rezept teilen</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center p-6 bg-white rounded-xl">
          {/* QR-код генерируется на лету из строки data */}
          <QRCode value={data} size={256} />
        </div>
        
        <p className="text-sm text-slate-500 font-mono">
          Lass deinen Freund scannen!
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;