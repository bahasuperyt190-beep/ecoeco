import React, { useState, useEffect, useRef } from 'react';
import { WasteLot, ChatMessage, UserSummary } from '../types.ts';
import { Language, Translations, TRANSLATIONS } from '../i18n.ts';
import { formatKzt } from '../utils.ts';
import { X, Send, ShieldCheck, CheckCircle2, Phone, MapPin, Sparkles, Star } from 'lucide-react';

interface ChatDrawerProps {
  lot: WasteLot;
  currentUser: UserSummary;
  onClose: () => void;
  onLotUpdated: (updatedLot: WasteLot) => void;
  onOpenKaspiPayment: (lot: WasteLot) => void;
  onOpenRateUser?: (user: UserSummary) => void;
  lang?: Language;
  t?: Translations;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  lot,
  currentUser,
  onClose,
  onLotUpdated,
  onOpenKaspiPayment,
  onOpenRateUser,
  lang = 'ru',
  t = TRANSLATIONS.ru,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isOwner = lot.owner.id === currentUser.id;
  const isBuyer = !isOwner;
  const partnerUser = isOwner ? lot.dealWith : lot.owner;

  // Load chat messages
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chats/${lot.id}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to load chat messages', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [lot.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/chats/${lot.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        if (!textToSend) setInputText('');
      }
    } catch (e) {
      console.error('Error sending message', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'active' | 'reserved' | 'completed') => {
    try {
      const res = await fetch(`/api/lots/${lot.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          dealWith: newStatus === 'reserved' ? currentUser : lot.dealWith,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onLotUpdated(data.lot);
        handleSendMessage(
          newStatus === 'reserved'
            ? `⚡ ${lang === 'en' ? 'Batch reserved by' : lang === 'kk' ? 'Партияны брондаған:' : 'Лот забронирован пользователем'} ${currentUser.name}`
            : `🎉 ${lang === 'en' ? 'Transaction completed and confirmed! Raw material accepted.' : lang === 'kk' ? 'Мәміле сәтті расталды және аяқталды! Шикізат қабылданды.' : 'Сделка успешно подтверждена и завершена! Сырье принято.'}`
        );
      }
    } catch (e) {
      console.error('Status update failed', e);
    }
  };

  const quickReplies = [
    t.quickReply1,
    t.quickReply2,
    t.quickReply3,
    t.quickReply4,
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
              💬
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-stone-900 text-sm truncate">{lot.title}</h3>
              <div className="text-xs text-stone-500 flex items-center gap-2 flex-wrap">
                <span>{formatKzt(lot.pricePerUnit * lot.amount)}</span>
                <span>·</span>
                <span className="text-emerald-700 font-medium">
                  {isOwner ? (lot.dealWith ? `${lang === 'en' ? 'Buyer:' : lang === 'kk' ? 'Сатып алушы:' : 'Покупатель:'} ${lot.dealWith.name}` : (lang === 'en' ? 'Buyers' : lang === 'kk' ? 'Сатып алушылар' : 'Покупатели')) : `${t.sellerNameLabel}: ${lot.owner.name}`}
                </span>
                {partnerUser && partnerUser.id !== currentUser.id && (
                  <button
                    type="button"
                    onClick={() => onOpenRateUser && onOpenRateUser(partnerUser)}
                    className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200/80 transition-colors font-semibold text-[11px] cursor-pointer"
                    title={t.rateUserTitle}
                  >
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{partnerUser.rating !== null && partnerUser.rating !== undefined ? Number(partnerUser.rating).toFixed(1) : t.newUserBadge}</span>
                    <span className="text-[10px] text-amber-600 font-normal">· {t.rateBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deal Status Card */}
        <div className="p-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500">{t.dealStatus}</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-md ${
                lot.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : lot.paid
                  ? 'bg-emerald-600 text-white'
                  : lot.status === 'reserved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {lot.status === 'completed'
                ? t.statusCompleted
                : lot.paid
                ? t.statusPaid
                : lot.status === 'reserved'
                ? t.statusReserved
                : t.statusActive}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isBuyer && !lot.paid && (
              <button
                onClick={() => onOpenKaspiPayment(lot)}
                className="px-2.5 py-1 bg-[#f14635] hover:bg-[#d9291b] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                {t.payKaspiQr}
              </button>
            )}

            {isOwner && lot.paid && lot.status !== 'completed' && (
              <button
                onClick={() => handleUpdateStatus('completed')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.completeDealBtn}</span>
              </button>
            )}

            {!isOwner && lot.status === 'active' && !lot.paid && (
              <button
                onClick={() => handleUpdateStatus('reserved')}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
              >
                {t.reserveBtn}
              </button>
            )}

            {lot.status === 'completed' && partnerUser && partnerUser.id !== currentUser.id && (
              <button
                type="button"
                onClick={() => onOpenRateUser && onOpenRateUser(partnerUser)}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{t.rateBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
          {isLoading ? (
            <div className="text-center py-10 text-stone-400 text-xs">...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 px-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-stone-700">{t.noMessagesTitle}</p>
              <p className="text-xs text-stone-400">
                {t.noMessagesDesc}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 space-y-1 my-2">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{msg.senderName}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className="text-[10px] text-emerald-600 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-stone-400 mb-1 px-1">
                    {msg.senderName} ({msg.senderRole === 'seller' ? t.sellerRole : t.buyerRole})
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                      isMine
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isMine ? 'text-emerald-100' : 'text-stone-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Bar */}
        <div className="p-2 bg-stone-100 border-t border-stone-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 text-[11px] rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.chatInputPlaceholder}
            className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
