import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Compass,
  Download,
  FlaskConical,
  Lock,
  RefreshCw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { CardSceneVariant, GasInfo } from '../data/gasesData';

interface GasCardStudioProps {
  gas: GasInfo;
  studentName: string;
  isMapDone: boolean;
  labDoneCount: number;
  isChecklistDone: boolean;
  isDetectiveMaster?: boolean;
  onGoToMap: () => void;
  onGoToLab: () => void;
}

interface CardTheme {
  id: string;
  name: string;
  outerGradientTop: string;
  outerGradientBottom: string;
  innerBg: string;
  borderAccent: string;
  headerBg: string;
  textDark: string;
  badgeBg: string;
  badgeText: string;
  patternType: 'stars' | 'bubbles' | 'sparkles' | 'clouds' | 'diamonds';
}

const CARD_THEMES: CardTheme[] = [
  {
    id: 'sky-holo',
    name: '하늘 홀로그램',
    outerGradientTop: '#38BDF8',
    outerGradientBottom: '#0284C7',
    innerBg: '#F0F9FF',
    borderAccent: '#BAE6FD',
    headerBg: '#E0F2FE',
    textDark: '#0C4A6E',
    badgeBg: '#0284C7',
    badgeText: '#FFFFFF',
    patternType: 'bubbles',
  },
  {
    id: 'gold-star',
    name: '태양 골드 레어',
    outerGradientTop: '#FDE047',
    outerGradientBottom: '#F59E0B',
    innerBg: '#FFFBEB',
    borderAccent: '#FDE68A',
    headerBg: '#FEF3C7',
    textDark: '#78350F',
    badgeBg: '#D97706',
    badgeText: '#FFFFFF',
    patternType: 'stars',
  },
  {
    id: 'mint-leaf',
    name: '숲속 민트 에디션',
    outerGradientTop: '#34D399',
    outerGradientBottom: '#059669',
    innerBg: '#ECFDF5',
    borderAccent: '#A7F3D0',
    headerBg: '#D1FAE5',
    textDark: '#064E3B',
    badgeBg: '#059669',
    badgeText: '#FFFFFF',
    patternType: 'sparkles',
  },
  {
    id: 'coral-sunset',
    name: '노을 코랄 스페셜',
    outerGradientTop: '#FB7185',
    outerGradientBottom: '#E11D48',
    innerBg: '#FFF1F2',
    borderAccent: '#FECDD3',
    headerBg: '#FFE4E6',
    textDark: '#881337',
    badgeBg: '#E11D48',
    badgeText: '#FFFFFF',
    patternType: 'clouds',
  },
  {
    id: 'starlight-indigo',
    name: '별빛 탐험가 에디션',
    outerGradientTop: '#818CF8',
    outerGradientBottom: '#4F46E5',
    innerBg: '#EEF2FF',
    borderAccent: '#C7D2FE',
    headerBg: '#E0E7FF',
    textDark: '#312E81',
    badgeBg: '#4F46E5',
    badgeText: '#FFFFFF',
    patternType: 'diamonds',
  },
];

const RARITY_LABELS = ['★★★ 레어', '★★★★ 슈퍼 레어', '★★★★★ 울트라 탐험'];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function GasCardStudio({
  gas,
  studentName,
  isMapDone,
  labDoneCount,
  isChecklistDone,
  isDetectiveMaster = false,
  onGoToMap,
  onGoToLab,
}: GasCardStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sessionSeed] = useState<number>(() => getRandomInt(100, 999));

  const [variantIndex, setVariantIndex] = useState<number>(() =>
    getRandomInt(0, Math.max(0, gas.cardVariants.length - 1))
  );
  const [themeIndex, setThemeIndex] = useState<number>(() => getRandomInt(0, CARD_THEMES.length - 1));
  const [cardSerial, setCardSerial] = useState<number>(() => getRandomInt(101, 999));
  const [rarityIndex, setRarityIndex] = useState<number>(() => getRandomInt(0, RARITY_LABELS.length - 1));
  const [mascotMood, setMascotMood] = useState<number>(() => getRandomInt(0, 2));
  const [downloadDone, setDownloadDone] = useState<boolean>(false);

  const isLabDone = labDoneCount >= 2;
  const isUnlocked = isMapDone && isLabDone && isChecklistDone;

  // Automatically pick a different illustration & card theme per student name + gas
  useEffect(() => {
    const cleanName = studentName.trim();
    const seed = cleanName
      ? hashString(`${cleanName}:${gas.id}:${sessionSeed}`)
      : hashString(`${gas.id}:${sessionSeed}:${Date.now() % 97}`);
    const len = Math.max(1, gas.cardVariants.length);

    setVariantIndex(seed % len);
    setThemeIndex((seed >> 2) % CARD_THEMES.length);
    setCardSerial(101 + (seed % 899));
    setRarityIndex((seed >> 4) % RARITY_LABELS.length);
    setMascotMood((seed >> 6) % 3);
  }, [gas.id, gas.cardVariants.length, studentName, sessionSeed]);

  const variants = gas.cardVariants;
  const activeVariant: CardSceneVariant = variants[variantIndex] ?? variants[0];
  const activeTheme = CARD_THEMES[themeIndex] ?? CARD_THEMES[0];

  const handleRandomizeDesign = () => {
    if (variants.length > 1) {
      setVariantIndex((prev) => (prev + 1) % variants.length);
    }
    setThemeIndex((prev) => {
      const next = getRandomInt(0, CARD_THEMES.length - 1);
      return next === prev ? (prev + 1) % CARD_THEMES.length : next;
    });
    setCardSerial(getRandomInt(101, 999));
    setRarityIndex(getRandomInt(0, RARITY_LABELS.length - 1));
    setMascotMood((prev) => (prev + 1) % 3);
  };

  useEffect(() => {
    if (!isUnlocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;

    const drawCard = (loadedImg?: HTMLImageElement) => {
      if (cancelled) return;
      const W = 720;
      const H = 1020;
      canvas.width = W;
      canvas.height = H;

      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, activeTheme.outerGradientTop);
      grad.addColorStop(0.5, activeTheme.borderAccent);
      grad.addColorStop(1, activeTheme.outerGradientBottom);
      roundRectPath(ctx, 0, 0, W, H, 42);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      roundRectPath(ctx, 0, 0, W, H, 42);
      ctx.clip();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
      for (let i = -H; i < W + H; i += 90) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 34, 0);
        ctx.lineTo(i - 260, H);
        ctx.lineTo(i - 294, H);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      roundRectPath(ctx, 26, 26, W - 52, H - 52, 28);
      ctx.fillStyle = activeTheme.innerBg;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.stroke();

      drawPattern(ctx, activeTheme, cardSerial);

      roundRectPath(ctx, 48, 48, W - 96, 94, 18);
      ctx.fillStyle = activeTheme.headerBg;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = activeTheme.borderAccent;
      ctx.stroke();

      ctx.fillStyle = activeTheme.textDark;
      ctx.font = '600 20px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText('기체 탐험대 수집 카드', 70, 82);

      ctx.fillStyle = '#0F172A';
      ctx.font = '700 38px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText(gas.name, 70, 126);

      const symbolBadgeText = `${gas.symbol} · ${activeVariant.powerLabel}`;
      ctx.font = '700 22px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      const badgeWidth = Math.max(190, ctx.measureText(symbolBadgeText).width + 36);
      roundRectPath(ctx, W - 66 - badgeWidth, 68, badgeWidth, 50, 25);
      ctx.fillStyle = activeTheme.badgeBg;
      ctx.fill();
      ctx.fillStyle = activeTheme.badgeText;
      ctx.textAlign = 'center';
      ctx.fillText(symbolBadgeText, W - 66 - badgeWidth / 2, 101);
      ctx.textAlign = 'left';

      const artX = 50;
      const artY = 162;
      const artW = W - 100;
      const artH = 420;

      ctx.save();
      roundRectPath(ctx, artX, artY, artW, artH, 22);
      ctx.clip();

      if (loadedImg) {
        const scale = Math.max(artW / loadedImg.width, artH / loadedImg.height);
        const drawW = loadedImg.width * scale;
        const drawH = loadedImg.height * scale;
        const offsetX = artX + (artW - drawW) / 2;
        const offsetY = artY + (artH - drawH) / 2;
        ctx.drawImage(loadedImg, offsetX, offsetY, drawW, drawH);
      } else if (activeVariant.customIllustrationType) {
        drawCustomIllustration(
          ctx,
          activeVariant.customIllustrationType,
          artX,
          artY,
          artW,
          artH,
          gas.accentHex
        );
      } else {
        ctx.fillStyle = '#E0F2FE';
        ctx.fillRect(artX, artY, artW, artH);
      }

      drawCuteGasMascot(ctx, artX + artW - 64, artY + artH - 64, gas.symbol, gas.accentHex, mascotMood);

      if (isDetectiveMaster) {
        drawDetectiveMasterMark(ctx, artX, artY, artW, artH);
      }

      ctx.restore();

      roundRectPath(ctx, artX, artY, artW, artH, 22);
      ctx.lineWidth = isDetectiveMaster ? 7 : 6;
      ctx.strokeStyle = isDetectiveMaster ? '#FDE047' : '#FFFFFF';
      ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isDetectiveMaster ? '#D97706' : activeTheme.outerGradientBottom;
      ctx.stroke();

      roundRectPath(ctx, 64, 598, W - 128, 44, 14);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = activeTheme.borderAccent;
      ctx.stroke();

      ctx.fillStyle = activeTheme.textDark;
      ctx.font = '700 22px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${activeVariant.title} — ${activeVariant.subtitle}`, W / 2, 628);
      ctx.textAlign = 'left';

      roundRectPath(ctx, 48, 660, W - 96, 226, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = activeTheme.borderAccent;
      ctx.stroke();

      ctx.fillStyle = activeTheme.badgeBg;
      ctx.font = '700 25px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText(`특수 능력: ${activeVariant.skillTitle}`, 72, 702);

      ctx.fillStyle = '#1E293B';
      ctx.font = '500 21px "Noto Sans KR", sans-serif';
      drawWrappedText(ctx, activeVariant.skillDesc, 72, 740, W - 144, 30, 3);

      ctx.beginPath();
      ctx.moveTo(72, 816);
      ctx.lineTo(W - 72, 816);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      const noteLine = `성질 요약: ${gas.workbookModelProperties}`;
      ctx.fillStyle = '#475569';
      ctx.font = '500 18px "Noto Sans KR", sans-serif';
      drawWrappedText(ctx, noteLine, 72, 846, W - 144, 25, 2);

      const explorerLabel = studentName.trim()
        ? `탐험가: ${studentName.trim()}`
        : '탐험가: 초등 4학년 과학 탐험대';
      ctx.fillStyle = activeTheme.textDark;
      ctx.font = '700 21px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText(explorerLabel, 56, 944);

      ctx.font = '600 18px "Noto Sans KR", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`카드 번호 #${String(cardSerial).padStart(4, '0')} · ${activeTheme.name}`, 56, 974);

      ctx.textAlign = 'right';
      ctx.fillStyle = activeTheme.badgeBg;
      ctx.font = '700 21px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText(RARITY_LABELS[rarityIndex] ?? RARITY_LABELS[0], W - 56, 956);
      ctx.textAlign = 'left';
    };

    if (activeVariant.imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => drawCard(img);
      img.onerror = () => drawCard();
      img.src = activeVariant.imageSrc;
    } else {
      drawCard();
    }

    return () => {
      cancelled = true;
    };
  }, [
    isUnlocked,
    gas,
    activeVariant,
    activeTheme,
    cardSerial,
    rarityIndex,
    mascotMood,
    studentName,
    isDetectiveMaster,
  ]);

  const handleDownloadPng = () => {
    if (!isUnlocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = studentName.trim() ? `_${studentName.trim().replace(/\s+/g, '_')}` : '';
    link.download = `기체탐험카드_${gas.name}${safeName}_${cardSerial}.png`;
    link.href = dataUrl;
    link.click();

    setDownloadDone(true);
    window.setTimeout(() => setDownloadDone(false), 2200);
  };

  /* ---------- LOCKED STATE: Must finish all 3 study steps for this gas ---------- */
  if (!isUnlocked) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-700">공부 완료 후 열려요!</p>
            <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5 break-keep">
              {gas.name} 탐험 카드 잠금 상태
            </h3>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5">
          카드는 아무 때나 만들 수 없어요! <strong className="font-bold text-slate-900">{gas.name}</strong> 공부를 아래 3단계 모두 끝내야 나만의 포켓몬풍 탐험 카드를 만들고 다운받을 수 있습니다.
        </p>

        {/* 3-Step Unlock Checklist */}
        <div className="space-y-3">
          {/* Check 1: Map */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 ${
              isMapDone
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isMapDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">
                  1. 탐험 지도에서 {gas.name} 찾고 설명 3개 다 읽기
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {isMapDone ? '완료했어요!' : '아직 설명 버튼 3개를 다 누르지 않았어요.'}
                </p>
              </div>
            </div>
            {!isMapDone && (
              <button
                type="button"
                onClick={onGoToMap}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                이동
              </button>
            )}
          </div>

          {/* Check 2: Lab */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 ${
              isLabDone
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isLabDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">
                  2. 성질 실험실에서 {gas.name} 실험 2개 이상 하기
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {isLabDone
                    ? `완료했어요! (${labDoneCount}개 실험 확인)`
                    : `현재 ${labDoneCount}/2개 완료 — 실험실에서 직접 눌러 보세요.`}
                </p>
              </div>
            </div>
            {!isLabDone && (
              <button
                type="button"
                onClick={onGoToLab}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer whitespace-nowrap shrink-0"
              >
                <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                이동
              </button>
            )}
          </div>

          {/* Check 3: Self-Evaluation Checklist */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 ${
              isChecklistDone
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {isChecklistDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-bold text-slate-900 break-keep">
                  3. 위쪽 자기평가 체크리스트 4개 모두 체크하기
                </p>
                <p className="text-xs text-slate-600 mt-1 break-keep">
                  {isChecklistDone
                    ? '자기평가 체크 완료!'
                    : '화면 위쪽 자기평가 체크리스트 4가지를 모두 체크해 주세요.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- UNLOCKED STATE: Collectible Card Studio ---------- */
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-emerald-700">
            공부 완료! 카드 잠금 해제
          </p>
          <h3 className="font-display text-xl font-bold text-slate-900 mt-0.5 break-keep">
            {gas.name} 탐험 결과 카드
          </h3>
        </div>
        <button
          type="button"
          onClick={handleRandomizeDesign}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
          다른 그림·스타일 뽑기
        </button>
      </div>

      {isDetectiveMaster && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-2 border-amber-600 shadow-md text-slate-950 flex items-center gap-3 break-keep">
          <div className="w-10 h-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
              황금 스페셜 에디션 잠금 해제!
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-950">
              탐정 퀴즈 6문제 완료 보상으로 반짝이는 <strong>★ 명예 기체 탐정 ★ 황금 왕관 마크</strong>가 새겨졌어요!
            </p>
          </div>
        </div>
      )}

      {/* Variant Selector Chips */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500">
          카드 속 이용 장면 고르기 (학생 이름마다 처음 그림과 테두리가 다르게 나와요!):
        </p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant, idx) => (
            <button
              key={variant.id}
              type="button"
              onClick={() => setVariantIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                idx === variantIndex
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {variant.title.replace(gas.name, '').trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Live Canvas Card Preview */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex justify-center">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[300px] aspect-[720/1020] rounded-2xl shadow-lg"
          aria-label={`${gas.name} 기체 탐험 수집 카드 미리보기`}
        />
      </div>

      {/* Download Button */}
      <button
        type="button"
        onClick={handleDownloadPng}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-sky-600 text-white text-sm sm:text-base font-bold hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      >
        {downloadDone ? (
          <>
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            카드 이미지를 다운받았어요!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" aria-hidden="true" />
            기체 탐험 카드 저장하기 (PNG)
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center leading-relaxed break-keep">
        친구들과 같은 {gas.name}를 골라도 탐험가 이름과 <strong>다른 그림·스타일 뽑기</strong>에 따라 그림 장면, 테두리 색, 별 등급, 마스코트 표정이 다르게 만들어집니다!
      </p>
    </div>
  );
}

/* ---------- Canvas Helper Functions ---------- */

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const chars = Array.from(text);
  let line = '';
  let currentLine = 0;

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i];
    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
      if (currentLine === maxLines - 1) {
        ctx.fillText(`${line.slice(0, -1)}…`, x, y + currentLine * lineHeight);
        return;
      }
      ctx.fillText(line, x, y + currentLine * lineHeight);
      line = chars[i];
      currentLine++;
    } else {
      line = testLine;
    }
  }
  if (line && currentLine < maxLines) {
    ctx.fillText(line, x, y + currentLine * lineHeight);
  }
}

function drawPattern(ctx: CanvasRenderingContext2D, theme: CardTheme, seed: number) {
  ctx.save();
  ctx.fillStyle = theme.borderAccent;
  ctx.globalAlpha = 0.45;
  for (let i = 0; i < 14; i++) {
    const px = ((seed * (i + 3) * 73) % 620) + 50;
    const py = ((seed * (i + 7) * 97) % 880) + 70;
    const r = ((i + seed) % 6) + 5;
    ctx.beginPath();
    if (theme.patternType === 'bubbles' || theme.patternType === 'clouds') {
      ctx.arc(px, py, r, 0, Math.PI * 2);
    } else {
      ctx.moveTo(px, py - r);
      ctx.lineTo(px + r, py);
      ctx.lineTo(px, py + r);
      ctx.lineTo(px - r, py);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.restore();
}

function drawCuteGasMascot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  symbol: string,
  accentColor: string,
  mood: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 42, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = accentColor;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 36, 0, Math.PI * 2);
  ctx.fillStyle = `${accentColor}22`;
  ctx.fill();

  ctx.fillStyle = '#0F172A';
  if (mood === 0) {
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 6, 4, 0, Math.PI * 2);
    ctx.arc(cx + 12, cy - 6, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (mood === 1) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 4, 5, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 12, cy - 4, 5, Math.PI, 0);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(cx - 12, cy - 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx + 12, cy - 4, 5, Math.PI, 0);
    ctx.stroke();
  }

  ctx.fillStyle = '#FB7185';
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx - 20, cy + 3, 4.5, 0, Math.PI * 2);
  ctx.arc(cx + 20, cy + 3, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy + 2, 7, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = '700 13px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(symbol, cx, cy + 26);
  ctx.restore();
}

function drawCustomIllustration(
  ctx: CanvasRenderingContext2D,
  type: NonNullable<CardSceneVariant['customIllustrationType']>,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string
) {
  const bg = ctx.createLinearGradient(x, y, x, y + h);
  if (type === 'rocket-hydrogen' || type === 'airport-neon') {
    bg.addColorStop(0, '#1E1B4B');
    bg.addColorStop(1, '#312E81');
  } else if (type === 'liquid-nitrogen' || type === 'dryice-co2') {
    bg.addColorStop(0, '#ECFEFF');
    bg.addColorStop(1, '#CFFAFE');
  } else {
    bg.addColorStop(0, '#E0F2FE');
    bg.addColorStop(1, '#F0FDF4');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  const cx = x + w / 2;
  const cy = y + h / 2;

  if (type === 'hospital-oxygen') {
    ctx.fillStyle = '#FFFFFF';
    roundRectPath(ctx, cx - 150, cy - 120, 300, 240, 26);
    ctx.fill();
    ctx.strokeStyle = '#BAE6FD';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#0284C7';
    roundRectPath(ctx, cx - 105, cy - 55, 68, 145, 22);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 26px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('O₂', cx - 71, cy + 20);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 37, cy - 30);
    ctx.quadraticCurveTo(cx + 15, cy - 75, cx + 65, cy - 10);
    ctx.stroke();

    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(cx + 68, cy + 20, 44, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx + 58, cy - 2, 20, 44);
    ctx.fillRect(cx + 46, cy + 10, 44, 20);
  } else if (type === 'dryice-co2' || type === 'liquid-nitrogen') {
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(cx - 140 + i * 56, cy + 95, 38, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FDBA74';
    ctx.beginPath();
    ctx.moveTo(cx - 48, cy + 10);
    ctx.lineTo(cx + 48, cy + 10);
    ctx.lineTo(cx, cy + 115);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = type === 'dryice-co2' ? '#F472B6' : '#34D399';
    ctx.beginPath();
    ctx.arc(cx - 24, cy - 10, 36, 0, Math.PI * 2);
    ctx.arc(cx + 24, cy - 10, 36, 0, Math.PI * 2);
    ctx.arc(cx, cy - 42, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0284C7';
    ctx.font = '700 32px sans-serif';
    ctx.fillText('❄', cx - 150, cy - 60);
    ctx.fillText('❄', cx + 120, cy - 75);
    ctx.fillText('❄', cx + 105, cy + 30);
  } else if (type === 'weather-helium') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - 150, cy + 90, 45, 0, Math.PI * 2);
    ctx.arc(cx - 105, cy + 80, 55, 0, Math.PI * 2);
    ctx.arc(cx - 55, cy + 95, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(cx + 150, cy - 100, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.arc(cx, cy - 42, 74, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 32);
    ctx.lineTo(cx, cy + 92);
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    roundRectPath(ctx, cx - 28, cy + 92, 56, 40, 8);
    ctx.fill();
  } else if (type === 'rocket-hydrogen') {
    ctx.fillStyle = '#FDE047';
    for (let i = 0; i < 16; i++) {
      const sx = x + ((i * 97) % (w - 40)) + 20;
      const sy = y + ((i * 53) % (h - 40)) + 20;
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#FB923C';
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy + 75);
    ctx.lineTo(cx + 24, cy + 75);
    ctx.lineTo(cx, cy + 145);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    roundRectPath(ctx, cx - 42, cy - 95, 84, 175, 42);
    ctx.fill();
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.moveTo(cx - 42, cy + 35);
    ctx.lineTo(cx - 78, cy + 88);
    ctx.lineTo(cx - 42, cy + 75);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 42, cy + 35);
    ctx.lineTo(cx + 78, cy + 88);
    ctx.lineTo(cx + 42, cy + 75);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 4;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(cx - 180, y + h);
    ctx.lineTo(cx - 45, cy - 10);
    ctx.lineTo(cx + 45, cy - 10);
    ctx.lineTo(cx + 180, y + h);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 5; i++) {
      const ly = cy + 10 + i * 38;
      const spread = 52 + i * 32;
      ctx.fillStyle = '#FB923C';
      ctx.beginPath();
      ctx.arc(cx - spread, ly, 9 + i, 0, Math.PI * 2);
      ctx.arc(cx + spread, ly, 9 + i, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = accent;
    roundRectPath(ctx, cx - 65, cy - 95, 130, 28, 14);
    ctx.fill();
  }
}

function drawFourPointSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx + size * 0.18, cy - size * 0.18, cx + size, cy);
  ctx.quadraticCurveTo(cx + size * 0.18, cy + size * 0.18, cx, cy + size);
  ctx.quadraticCurveTo(cx - size * 0.18, cy + size * 0.18, cx - size, cy);
  ctx.quadraticCurveTo(cx - size * 0.18, cy - size * 0.18, cx, cy - size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDetectiveMasterMark(
  ctx: CanvasRenderingContext2D,
  artX: number,
  artY: number,
  artW: number,
  artH: number
) {
  ctx.save();

  // Subtle golden corner spotlight glow
  const glowGrad = ctx.createRadialGradient(
    artX + 60,
    artY + 52,
    10,
    artX + 120,
    artY + 60,
    240
  );
  glowGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
  glowGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.18)');
  glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(artX, artY, artW, artH);

  // Twinkling sparkles scattered in upper art area
  drawFourPointSparkle(ctx, artX + 355, artY + 34, 15, '#FEF9C3');
  drawFourPointSparkle(ctx, artX + 382, artY + 64, 10, '#FDE047');
  drawFourPointSparkle(ctx, artX + 28, artY + 104, 11, '#FFFFFF');
  drawFourPointSparkle(ctx, artX + 125, artY + 98, 9, '#FEF08A');

  // Metallic gold ribbon banner extending from crest medal
  ctx.save();
  ctx.shadowColor = 'rgba(180, 83, 9, 0.55)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 4;

  const ribbonGrad = ctx.createLinearGradient(artX + 45, artY + 20, artX + 340, artY + 84);
  ribbonGrad.addColorStop(0, '#FEF08A');
  ribbonGrad.addColorStop(0.35, '#FACC15');
  ribbonGrad.addColorStop(0.7, '#F59E0B');
  ribbonGrad.addColorStop(1, '#EA580C');

  roundRectPath(ctx, artX + 36, artY + 22, 304, 58, 29);
  ctx.fillStyle = ribbonGrad;
  ctx.fill();
  ctx.restore();

  // Crisp double rim on ribbon
  roundRectPath(ctx, artX + 36, artY + 22, 304, 58, 29);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  roundRectPath(ctx, artX + 41, artY + 26, 294, 50, 25);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#92400E';
  ctx.stroke();

  // Golden Sunburst Crest Medal on top-left
  const mx = artX + 52;
  const my = artY + 51;
  ctx.save();
  ctx.shadowColor = 'rgba(180, 83, 9, 0.55)';
  ctx.shadowBlur = 14;

  // 16-point sunburst star seal
  ctx.beginPath();
  const points = 16;
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const rad = i % 2 === 0 ? 37 : 30;
    const px = mx + Math.cos(angle) * rad;
    const py = my + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  const medalGrad = ctx.createRadialGradient(mx - 8, my - 8, 4, mx, my, 38);
  medalGrad.addColorStop(0, '#FEF9C3');
  medalGrad.addColorStop(0.55, '#FACC15');
  medalGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = medalGrad;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.restore();

  // Inner circle + Royal Crown icon inside medal
  ctx.beginPath();
  ctx.arc(mx, my, 23, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFBEB';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#D97706';
  ctx.stroke();

  // Royal crown silhouette
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.moveTo(mx - 12, my + 8);
  ctx.lineTo(mx - 14, my - 5);
  ctx.lineTo(mx - 6, my + 1);
  ctx.lineTo(mx, my - 11);
  ctx.lineTo(mx + 6, my + 1);
  ctx.lineTo(mx + 14, my - 5);
  ctx.lineTo(mx + 12, my + 8);
  ctx.closePath();
  ctx.fill();

  // Crown jewels
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.arc(mx, my + 3, 2.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  ctx.arc(mx - 7, my + 3, 1.8, 0, Math.PI * 2);
  ctx.arc(mx + 7, my + 3, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Two-line crisp high-contrast banner text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#78350F';
  ctx.font = '800 11px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
  ctx.fillText('★ GOLDEN DETECTIVE ★', artX + 208, artY + 41);

  ctx.fillStyle = '#451A03';
  ctx.font = '800 22px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
  ctx.fillText('명예 기체 탐정', artX + 208, artY + 67);

  ctx.textAlign = 'left';
  ctx.restore();
}

