import React, { useState } from 'react';
import { UserSummary } from '../types.ts';
import { Language, Translations } from '../i18n.ts';
import { X, Star, CheckCircle, ShieldCheck, MessageSquare } from 'lucide-react';

interface RateUserModalProps {
  targetUser: UserSummary;
  currentUser: UserSummary | null;
  onClose: () => void;
  onRatingSubmitted: (updatedUser: UserSummary) => void;
  lang: Language;
  t: Translations;
}

export const RateUserModal: React.FC<RateUserModalProps> = ({
  targetUser,
  currentUser,
  onClose,
  onRatingSubmitted,
  lang,
  t,
}) => {
  const [selectedScore, setSelectedScore] = useState<number>(5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isSelf = currentUser ? currentUser.id === targetUser.id : false;

  const quickTags = [
    t.quickTag1,
    t.quickTag2,
    t.quickTag3,
    t.quickTag4,
  ];

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return t.score1;
      case 2:
        return t.score2;
      case 3:
        return t.score3;
      case 4:
        return t.score4;
      case 5:
        return t.score5;
      default:
        return '';
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMessage(lang === 'en' ? 'Please log in to rate users' : lang === 'kk' ? 'Бағалау үшін жүйеге кіріңіз' : 'Войдите в профиль, чтобы оставить оценку');
      return;
    }
    if (isSelf) {
      setErrorMessage(t.cannotRateSelf);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/users/${targetUser.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          score: selectedScore,
          comment: comment.trim(),
          tags: selectedTags,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setIsSuccess(true);
        onRatingSubmitted(data.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Failed to submit rating');
      }
    } catch (err) {
      setErrorMessage(lang === 'en' ? 'Network error' : 'Ошибка соединения с сервером');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeScore = hoverScore ?? selectedScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 my-8 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-2xs">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">{t.rateUserTitle}</h2>
              <p className="text-xs text-stone-500">{t.rateUserDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card Info */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              {targetUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">{targetUser.name}</div>
              <div className="text-[11px] text-stone-500">
                {targetUser.role === 'seller' ? t.sellerRole : t.buyerRole}
                {targetUser.company ? ` · ${targetUser.company}` : ''}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-700 flex items-center gap-1 justify-end">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{targetUser.rating !== null && targetUser.rating !== undefined ? targetUser.rating.toFixed(1) : t.newUserBadge}</span>
            </div>
            <div className="text-[10px] text-stone-400">
              {targetUser.ratingsCount ? `${targetUser.ratingsCount} ${t.reviewsCount}` : t.newUserBadge}
            </div>
          </div>
        </div>

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">{t.ratingSuccess}</h3>
            <p className="text-xs text-stone-500">
              Рейтинг партнера {targetUser.name} обновлен в базе данных.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Stars Selector */}
            <div className="text-center space-y-2">
              <label className="text-xs font-semibold text-stone-600 block">
                {t.yourRating}
              </label>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = starVal <= activeScore;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setSelectedScore(starVal)}
                      onMouseEnter={() => setHoverScore(starVal)}
                      onMouseLeave={() => setHoverScore(null)}
                      className="p-1.5 transition-transform hover:scale-120 active:scale-95 cursor-pointer rounded-lg focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-500 filter drop-shadow-xs'
                            : 'text-stone-300 fill-stone-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-bold text-amber-700 h-5">
                {getScoreLabel(activeScore)}
              </div>
            </div>

            {/* Quick Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">
                {lang === 'en' ? 'Quick highlights:' : lang === 'kk' ? 'Артықшылықтары:' : 'Что понравилось в сотрудничестве:'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Textarea comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600">
                {lang === 'en' ? 'Your feedback:' : lang === 'kk' ? 'Пікіріңіз:' : 'Ваш отзыв:'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.reviewPlaceholder}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isSelf}
                className={`w-full py-3 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  isSelf
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isSubmitting ? (
                  <span>{t.submittingRating}</span>
                ) : (
                  <>
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span>{t.submitRating}</span>
                  </>
                )}
              </button>
              {isSelf && (
                <p className="text-[11px] text-stone-400 text-center mt-1.5">
                  {t.cannotRateSelf}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
