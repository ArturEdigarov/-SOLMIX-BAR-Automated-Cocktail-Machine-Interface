import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import Barcode from 'react-barcode';
import { Trash2, Wine, Citrus, Activity, QrCode, Share } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import QrCodeDialog from './componnents/QrCodeDialog';
import ShareDialog from './componnents/ShareDialog';
const PUMPS = [
    { id: 0, name: "Wodka", isAlcohol: true },
    { id: 1, name: "Orangensaft", isAlcohol: false },
    { id: 2, name: "Gin", isAlcohol: true },
    { id: 3, name: "Granatapfel", isAlcohol: false },
    { id: 4, name: "Ws.Rum", isAlcohol: true },
    { id: 5, name: "Erdbeere", isAlcohol: false },
    { id: 6, name: "Limettensirup", isAlcohol: false },
    { id: 7, name: "Tonic", isAlcohol: false },
    { id: 8, name: "Ananas Kokos", isAlcohol: false },
];

const Cocktails = () => {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareData, setShareData] = useState("");

    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const [value, setValue] = React.useState(Array(9).fill(0)); // Начинаем с 0 для красоты
    const [barcodeString, setBarcodeString] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const totalVolume = value.reduce((sum, v) => sum + v, 0);
    const alcoholVolume = value.reduce((sum, v, id) => sum + (PUMPS[id].isAlcohol ? v : 0), 0);

    const handleScanSuccess = (data) => {
        // data это строка типа "Berlin Sunset|30,0,20,0,0,150,0,0,0"
        try {
            const [name, valuesString] = data.split('|');
            const newValues = valuesString.split(',').map(Number);
            
            setValue(newValues);    // Обновляем слайдеры
            setIsScannerOpen(false); // Закрываем сканер
        } catch (e) {
            alert("Неверный QR-код");
        }
    };
    const prepareShareData = () => {
        // Формат: "Название|30,0,20,..."
        const name = "Mein Cocktail"; // Можно добавить input для имени
        const data = `${name}|${value.join(',')}`;
        setShareData(data);
        setIsShareModalOpen(true);
    };

    const handleSliderChange = (id, newValue) => {
        const targetValue = newValue[0]; 
        const currentValue = value[id];  

        const otherTotal = totalVolume - currentValue;
        const otherAlcohol = alcoholVolume - (PUMPS[id].isAlcohol ? currentValue : 0);

        let allowedValue = targetValue;

        if (otherTotal + allowedValue > 200) {
            allowedValue = 200 - otherTotal;
        }

        if (PUMPS[id].isAlcohol && (otherAlcohol + allowedValue > 50)) {
            allowedValue = 50 - otherAlcohol;
        }

        if (allowedValue < 0) allowedValue = 0;

        const updatedVolumes = [...value];
        updatedVolumes[id] = allowedValue;
        setValue(updatedVolumes);
    };

    const handleMixClick = () => {
        if (totalVolume < 200) return;
        const generatedString = value.join(" "); 
        setBarcodeString(generatedString); 
        setIsModalOpen(true);              
    };

    const handleClear = () => {
        setValue(Array(9).fill(0));
    };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500/30">
        <div className="max-w-md mx-auto px-4 py-8 pb-24 space-y-6">
            
            {/* Название и Лого */}
            <header className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                        <Activity size={20} className="animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            SOLMIX BAR
                        </h1>
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Pump Controller v2.0</p>
                    </div>
                </div>
                <div className='gap-2 flex items-center'>
                    <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsScannerOpen(true)}
                        className="rounded-xl border border-slate-900 bg-slate-900/20 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-20 transition-all cursor-pointer"
                    >
                            
                        <QrCode size={16}/>
                    </Button>
                    {/* Кнопка сброса */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleClear}
                        disabled={totalVolume === 0}
                        className="rounded-xl border border-slate-900 bg-slate-900/20 text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-20 transition-all cursor-pointer"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </header>

            {/* Монитор лимитов и Прогресс-бары */}
            <section className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4 space-y-4 shadow-xl backdrop-blur-sm">
                {/* Индикаторы цифрами */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-900/60">
                        <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                            <Wine size={12} className="text-purple-400" /> ALCOHOL
                        </div>
                        <div className="text-base font-bold text-purple-400">{alcoholVolume} <span className="text-xs text-slate-600">/ 50 ml</span></div>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-900/60">
                        <div className="text-slate-500 flex items-center gap-1.5 mb-1">
                            <Citrus size={12} className="text-emerald-400" /> TOTAL VOLUME
                        </div>
                        <div className="text-base font-bold text-emerald-400">{totalVolume} <span className="text-xs text-slate-600">/ 200 ml</span></div>
                    </div>
                </div>

                {/* Визуальный общий прогресс-бар коктейля */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-wider px-1">
                        <span>Füllstand des Glases</span>
                        <span>{Math.round((totalVolume / 200) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-[2px] border border-slate-900">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${(totalVolume / 200) * 100}%` }}
                        />
                    </div>
                </div>
            </section>

            {/* Список помп */}
            <main className="space-y-3">
                {PUMPS.map(pump => {
                    const isSelected = value[pump.id] > 0;
                    return (
                        <div 
                            key={pump.id} 
                            className={`p-4 rounded-2xl border transition-all duration-200 ${
                                isSelected 
                                ? 'bg-slate-900/90 border-slate-800 shadow-md shadow-black/40' 
                                : 'bg-slate-900/30 border-slate-950/50 opacity-70 hover:opacity-100'
                            }`}
                        >   
                            {/* Название помпы и текущий объем */}
                            <div className="flex justify-between items-center text-sm font-mono mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={`w-1.5 h-1.5 rounded-full ${pump.isAlcohol ? 'bg-purple-500 shadow-[0_0_6px_#a855f7]' : 'bg-emerald-400 shadow-[0_0_6px_#34d399]'}`} />
                                    <span className={`font-medium ${pump.isAlcohol ? "text-purple-300" : "text-slate-200"}`}>
                                        {pump.name}
                                    </span>
                                </div>        
                                <span className={`font-bold transition-colors ${isSelected ? (pump.isAlcohol ? 'text-purple-400' : 'text-emerald-400') : 'text-slate-600'}`}>
                                    {value[pump.id]} ml
                                </span>
                            </div>

                            {/* Ползунок */}
                            <Slider
                                value={[value[pump.id]]}
                                onOpenChange={() => {}} 
                                onValueChange={(newValue) => handleSliderChange(pump.id, newValue)}
                                max={pump.isAlcohol ? 50 : 200}
                                step={1}
                                disabled={false}
                                className="w-full"
                            />
                        </div>
                    );
                })}
            </main>

            {/* Закрепленная снизу плашка с кнопкой Mix */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pt-10 pointer-events-none">
                <div className="max-w-md mx-auto pointer-events-auto gap-2 flex items-center">
                    <Button 
                        disabled={totalVolume < 200}
                        onClick={prepareShareData}
                        className="w-[20%] bg-gradient-to-r from-pink-800 to-purple-600 hover:from-pink-500 hover:to-purple-500  text-white font-bold py-6 rounded-2xl shadow-[0_4px_20px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-10 disabled:pointer-events-none border-none text-base tracking-wide"
                    >
                       <Share size={24}/>
                    </Button>
                    <Button 
                        disabled={totalVolume < 200}
                        onClick={handleMixClick}
                        className="w-[80%] bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-6 rounded-2xl shadow-[0_4px_20px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-10 disabled:pointer-events-none border-none text-base tracking-wide"
                    >
                        COCKTAIL MIXEN
                    </Button>
                </div>
            </div>

            {/* Модалка со штрихкодом */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl max-w-[92vw] overflow-hidden bg-white text-slate-900 rounded-3xl p-6 border-none shadow-2xl animate-in fade-in-50 zoom-in-95">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-center tracking-tight text-slate-950">
                            Barcode ist bereit
                        </DialogTitle>
                        <div className="space-y-4 mt-4">
                            
                            {/* Контейнер штрихкода */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-center items-center w-full overflow-x-auto shadow-inner">
                                {barcodeString && (
                                    <div className="w-full max-w-[400px] sm:max-w-md flex justify-center [&>svg]:w-full [&>svg]:h-auto">
                                        <Barcode 
                                        value={barcodeString} 
                                        format="CODE128"
                                        width={1.2} 
                                        height={70}
                                        lineColor="#090d16"
                                        background="#f8fafc"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Приятный футер */}
                            <div className="text-center bg-slate-50 border border-slate-100 p-3 rounded-xl font-mono text-xs text-slate-500">
                                <span className="font-bold block text-[10px] text-purple-600 uppercase tracking-wider mb-0.5">
                                    SCHÖNEN ABEND!
                                </span>
                                Sie haben Geschmack! ✨
                            </div>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {isScannerOpen && (
                <QrCodeDialog 
                    open={isScannerOpen} 
                    onOpenChange={setIsScannerOpen} 
                    onScanSuccess={handleScanSuccess} 
                />
            )}
            <ShareDialog 
                open={isShareModalOpen} 
                onOpenChange={setIsShareModalOpen} 
                data={shareData} 
            />
        </div>
    </div>
  )
};

export default Cocktails;