import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { WasteLot, UserSummary } from '../types.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { formatKzt, formatWeight } from '../utils.ts';
import { X, CheckCircle2, QrCode, ShieldCheck, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface KaspiQrModalProps {
  lot: WasteLot;
  currentUser: UserSummary;
  onClose: () => void;
  onPaymentSuccess: (paidLot: WasteLot) => void;
  lang?: Language;
  t?: Translations;
}

export const KaspiQrModal: React.FC<KaspiQrModalProps> = ({
  lot,
  currentUser,
  onClose,
  onPaymentSuccess,
  lang = 'ru',
  t = TRANSLATIONS.ru,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const totalAmount = lot.pricePerUnit * lot.amount;

  // Generate QR Code
  useEffect(() => {
    const payload = JSON.stringify({
      app: 'ECO-BRIDGE-DEMO',
      service: 'EcoBridge-KZ',
      lotId: lot.id,
      amountKzt: totalAmount,
      seller: lot.owner.name,
      buyer: currentUser.name,
      timestamp: Date.now(),
    });

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#1f2937',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR:', err));
  }, [lot, totalAmount, currentUser]);

  // Countdown timer
  useEffect(() => {
    if (isSuccess || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSuccess, timeLeft]);

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/lots/${lot.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: currentUser,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTxId(`DEMO-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsSuccess(true);
        onPaymentSuccess(data.lot);
      } else {
        setErrorMessage(data.error || 'Payment error');
      }
    } catch (err: any) {
      setErrorMessage(lang === 'en' ? 'Could not connect to the demo server' : lang === 'kk' ? 'Демо серверге қосылу мүмкін болмады' : 'Не удалось подключиться к демосерверу');
    } finally {
      setIsProcessing(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto border border-stone-100">
        <p className="bg-amber-100 p-3 text-center text-sm text-amber-950">{lang === 'en' ? 'SIMULATED PAYMENT — no real money transfer' : lang === 'kk' ? 'ДЕМО ТӨЛЕМ — ақша аударылмайды' : 'ДЕМО ОПЛАТА — реальные деньги не переводятся'}</p>
        {/* Demo payment header */}
        <div className="bg-[#f14635] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white text-[#f14635] font-extrabold rounded-xl flex items-center justify-center text-lg shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight leading-none">EcoBridge</div>
              <div className="text-[11px] text-white/80 font-medium">{t.kaspiSafeDeal}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Payment Success View */
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">{t.paymentSuccessTitle}</h3>
              <p className="text-xs text-stone-500">
                {t.paymentSuccessDesc}
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 text-left space-y-2 border border-stone-200/70 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">{t.paymentSum}</span>
                <span className="font-bold text-stone-900">{formatKzt(totalAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">{t.receiptNumber}</span>
                <span className="font-mono font-medium text-stone-700">{txId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200/60">
                <span className="text-stone-500">{t.sellerNameLabel}</span>
                <span className="font-medium text-stone-800">{lot.owner.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">{t.contactPhone}</span>
                <span className="font-bold text-emerald-700">{lot.owner.phone}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.viewOnMapBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Payment QR View */
          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="text-center space-y-1">
              <div className="text-xs text-stone-500 font-medium">{t.paymentToSeller}</div>
              <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {formatKzt(totalAmount)}
              </div>
              <div className="text-xs text-emerald-700 font-medium">
                {lot.title} ({formatWeight(lot.amount, lot.unit)})
              </div>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col items-center justify-center w-full max-w-[250px] shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={t.payKaspiQr}
                  className="w-full h-auto rounded-lg mix-blend-multiply"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-stone-400">
                  <QrCode className="w-12 h-12 animate-pulse" />
                </div>
              )}

              {/* Timer Pill */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200">
                <Clock className="w-3.5 h-3.5 text-[#f14635]" />
                <span>{t.qrValidFor} {formattedTime}</span>
              </div>
            </div>

            <div className="text-center text-xs text-stone-500 leading-relaxed px-2">
              {t.scanInstructions}
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Simulation Button */}
            <div className="pt-1">
              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing || timeLeft <= 0}
                className="w-full py-3.5 px-4 bg-[#f14635] hover:bg-[#d9291b] active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.paymentProcessing}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t.simulatePaymentBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
