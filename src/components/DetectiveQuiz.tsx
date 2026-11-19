import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  Download,
  HelpCircle,
  NotebookPen,
  RotateCcw,
  SearchCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { GASES_DATA, GasId, QUIZ_MISSIONS } from '../data/gasesData';
import { ResilientImage } from './ResilientImage';

interface DetectiveQuizProps {
  solvedMissionIds: string[];
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onSolveMission: (missionId: string, gasId: GasId) => void;
  onRevertMission: (missionId: string) => void;
  onResetQuiz: () => void;
  onGoToNotebook: () => void;
}

export function DetectiveQuiz({
  solvedMissionIds,
  studentName,
  onChangeStudentName,
  onSolveMission,
  onRevertMission,
  onResetQuiz,
  onGoToNotebook,
}: DetectiveQuizProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, GasId>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [downloadedCert, setDownloadedCert] = useState<boolean>(false);

  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mission = QUIZ_MISSIONS[activeIndex] ?? QUIZ_MISSIONS[0];
  const isMissionSolved = solvedMissionIds.includes(mission.id);
  const chosenGasId =
    selectedAnswers[mission.id] ?? (isMissionSolved ? mission.correctGasId : undefined);
  const isCorrect = chosenGasId === mission.correctGasId;
  const hasAnswered = Boolean(chosenGasId);
  const correctGas = GASES_DATA.find((g) => g.id === mission.correctGasId) ?? GASES_DATA[0];
  const isAllSolved = solvedMissionIds.length >= QUIZ_MISSIONS.length;

  useEffect(() => {
    if (!isAllSolved) return;
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 960;
    const H = 680;
    canvas.width = W;
    canvas.height = H;

    // Warm cream certificate paper background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FFFBEB');
    bgGrad.addColorStop(0.5, '#FFFFFF');
    bgGrad.addColorStop(1, '#FEF3C7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Outer & inner decorative golden borders
    drawRoundedRect(ctx, 20, 20, W - 40, H - 40, 26);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    drawRoundedRect(ctx, 36, 36, W - 72, H - 72, 18);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    // Subtle diagonal watermark stars
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    for (let i = 0; i < 14; i++) {
      const sx = 90 + ((i * 157) % (W - 180));
      const sy = 90 + ((i * 113) % (H - 180));
      drawStar(ctx, sx, sy, 5, 16, 7);
      ctx.fill();
    }
    ctx.restore();

    // Top medal circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, 108, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFFBEB';
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    drawStar(ctx, W / 2, 108, 5, 22, 10);
    ctx.fill();
    ctx.restore();

    // Top Ribbon Label
    ctx.textAlign = 'center';
    ctx.fillStyle = '#B45309';
    ctx.font = '700 20px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
    ctx.fillText('초등학교 4학년 과학 · 기체 탐험대', W / 2, 182);

    // Main Certificate Title
    ctx.fillStyle = '#1E1B4B';
    ctx.font = '700 44px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
    ctx.fillText('명예 기체 탐정 임명장', W / 2, 238);

    // Student Name Box
    const displayName = studentName.trim() ? `${studentName.trim()} 탐정` : '멋진 과학 탐정';
    drawRoundedRect(ctx, W / 2 - 220, 266, 440, 62, 16);
    ctx.fillStyle = '#FEF3C7';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = '700 30px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
    ctx.fillText(`이름: ${displayName}`, W / 2, 308);

    // Citation body text
    ctx.fillStyle = '#334155';
    ctx.font = '500 22px "Noto Sans KR", sans-serif';
    ctx.fillText('위 학생은 일상생활 속 기체의 성질과 이용 사례를 스스로 탐구하고,', W / 2, 372);
    ctx.fillText('기체 탐정 퀴즈 6가지 사건을 모두 해결하였기에 명예 기체 탐정으로 임명합니다!', W / 2, 408);

    // 6 Conquered Gas Badges Row
    const gasBadges = ['산소 O₂', '헬륨 He', '질소 N₂', '이산화 탄소 CO₂', '네온 Ne', '수소 H₂'];
    const pillW = 128;
    const gap = 12;
    const totalRowW = gasBadges.length * pillW + (gasBadges.length - 1) * gap;
    const startX = (W - totalRowW) / 2;
    gasBadges.forEach((label, idx) => {
      const bx = startX + idx * (pillW + gap);
      drawRoundedRect(ctx, bx, 444, pillW, 44, 22);
      ctx.fillStyle = '#EEF2FF';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#A5B4FC';
      ctx.stroke();

      ctx.fillStyle = '#312E81';
      ctx.font = '700 15px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
      ctx.fillText(label, bx + pillW / 2, 472);
    });

    // Date & Signature at bottom left
    const today = new Date();
    const dateText = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '600 19px "Noto Sans KR", sans-serif';
    ctx.fillText(`발급일: ${dateText}`, 86, 566);
    ctx.fillStyle = '#1E293B';
    ctx.font = '700 23px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
    ctx.fillText('기체 탐험대 탐구 본부', 86, 602);

    // Scalloped red "참 잘했어요!" teacher stamp on bottom right
    drawTeacherStamp(ctx, W - 160, 565);
  }, [isAllSolved, studentName]);

  const handleChooseGas = (gasId: GasId) => {
    setSelectedAnswers((prev) => ({ ...prev, [mission.id]: gasId }));
    if (gasId === mission.correctGasId) {
      onSolveMission(mission.id, gasId);
    }
  };

  const handleSelectMission = (index: number) => {
    setActiveIndex(index);
    setShowHint(false);
  };

  const handleRevertCurrentMission = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[mission.id];
      return next;
    });
    setShowHint(false);
    onRevertMission(mission.id);
  };

  const handleResetAll = () => {
    setSelectedAnswers({});
    setShowHint(false);
    setActiveIndex(0);
    onResetQuiz();
  };

  const handleDownloadCertificate = () => {
    const canvas = certCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = studentName.trim() ? `_${studentName.trim().replace(/\s+/g, '_')}` : '';
    link.download = `명예기체탐정_임명장${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloadedCert(true);
    window.setTimeout(() => setDownloadedCert(false), 2400);
  };

  return (
    <section aria-labelledby="quiz-heading" className="space-y-8">
      {/* Page 3 Hero Banner: Deep Indigo Theme */}
      <div className="bg-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
              <SearchCheck className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 break-keep">
                3단계 · 기체 탐정 퀴즈
              </p>
              <h1
                id="quiz-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug break-keep"
              >
                상황에 알맞은 기체를 추리해 보세요!
              </h1>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed break-keep">
                6가지 사건을 모두 해결하면 <strong>명예 기체 탐정 임명장</strong>과 기체 카드 <strong>황금 탐정 마크</strong> 보상을 받을 수 있어요!
              </p>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-5 shrink-0 shadow-sm flex items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500">해결한 탐정 미션</p>
              <p className="font-mono-num text-xl font-bold text-indigo-700 mt-0.5">
                {solvedMissionIds.length} / {QUIZ_MISSIONS.length}개
              </p>
            </div>
            {solvedMissionIds.length > 0 && (
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                다시 풀기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ALL-SOLVED REWARD PANEL */}
      {isAllSolved && (
        <div
          role="region"
          aria-label="명예 기체 탐정 보상"
          className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-8 h-8" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-amber-800">
                  6개 미션 모두 해결! 탐정 퀴즈 완벽 클리어 보상
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 break-keep">
                  축하해요! &ldquo;명예 기체 탐정&rdquo;이 되었어요!
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToNotebook}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-700 text-white text-sm font-bold hover:bg-indigo-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
            >
              <NotebookPen className="w-4 h-4" aria-hidden="true" />
              <span>황금 마크 달린 기체 카드 만들러 가기</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Reward Description + Name Input + Download Button */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-amber-200 rounded-2xl p-5 space-y-3">
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                  탐정 퀴즈 완료 2가지 특별 보상
                </p>
                <ul className="space-y-2 text-sm text-slate-700 leading-relaxed break-keep">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">①</span>
                    <span>
                      내 이름이 적힌 <strong>명예 기체 탐정 임명장(PNG)</strong>을 다운받아 간직할 수 있어요.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">②</span>
                    <span>
                      4단계 기체 탐험 카드 위에 <strong>★ 명예 기체 탐정 ★ 황금 마크</strong>가 특별히 새겨집니다.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="detective-reward-name"
                  className="block text-sm font-bold text-slate-900"
                >
                  임명장에 넣을 탐정 이름 적기
                </label>
                <input
                  id="detective-reward-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => onChangeStudentName(e.target.value)}
                  placeholder="예: 4학년 2반 김과학"
                  className="w-full px-4 py-3 rounded-2xl border border-amber-300 bg-white text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={handleDownloadCertificate}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-amber-500 text-slate-950 text-sm sm:text-base font-bold hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
              >
                {downloadedCert ? (
                  <>
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                    명예 기체 탐정 임명장을 다운받았어요!
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" aria-hidden="true" />
                    명예 기체 탐정 임명장 저장하기 (PNG)
                  </>
                )}
              </button>
            </div>

            {/* Right: Live Preview of Detective Certificate */}
            <div className="lg:col-span-7 bg-white border border-amber-200 rounded-2xl p-4 sm:p-5 flex justify-center">
              <canvas
                ref={certCanvasRef}
                className="w-full max-w-[540px] aspect-[960/680] rounded-xl shadow-md"
                aria-label="명예 기체 탐정 임명장 미리보기"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mission Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {QUIZ_MISSIONS.map((item, idx) => {
          const isSolved = solvedMissionIds.includes(item.id);
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectMission(idx)}
              className={`px-5 py-2.5 rounded-2xl border text-sm font-bold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                isActive
                  ? 'bg-indigo-700 border-indigo-700 text-white shadow-sm'
                  : isSolved
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.caseNumber}</span>
              {isSolved && (
                <CheckCircle2
                  className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Mission Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Mission Clue & Visual Answer */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{mission.caseNumber} · 일상생활 추리</span>
              <span className={`font-bold ${solvedMissionIds.includes(mission.id) ? 'text-emerald-600' : 'text-amber-700'}`}>
                {solvedMissionIds.includes(mission.id) ? '해결 완료' : '추리 중'}
              </span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 break-keep">
              {mission.situation}
            </h2>

            <div>
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 hover:text-indigo-800 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                {showHint ? '힌트 숨기기' : '탐정 힌트 보기'}
              </button>

              {showHint && (
                <p className="mt-3 p-5 rounded-2xl bg-indigo-50 border border-indigo-200 text-sm sm:text-base text-indigo-950 leading-relaxed break-keep">
                  힌트: {mission.hint}
                </p>
              )}
            </div>
          </div>

          {/* Feedback Area */}
          {hasAnswered && (
            <div
              role="status"
              className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}
            >
              <div className="flex items-center gap-2 font-display font-bold text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                    <span>정답이에요!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
                    <span>아쉬워요, 다른 기체를 골라 볼까요?</span>
                  </>
                )}
              </div>
              <p className="text-sm sm:text-base leading-relaxed break-keep">
                {isCorrect
                  ? mission.explanation
                  : '힌트를 읽어 보거나 성질 실험실에서 기체의 성질을 다시 확인해 보세요.'}
              </p>
              {isCorrect && (
                <div className="rounded-xl overflow-hidden border-2 border-white shadow-sm aspect-[4/3] bg-white">
                  <ResilientImage
                    src={correctGas.answerIllustration}
                    alt={correctGas.answerIllustrationAlt}
                    fallbackTitle={`${correctGas.name} 설명 그림`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleRevertCurrentMission}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                  <span>{mission.caseNumber} 실행 전으로 되돌리기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: 6 Gas Choices */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h3 className="font-display text-base font-bold text-slate-900">
              이 상황에 꼭 맞는 기체를 선택하세요
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GASES_DATA.map((gas) => {
                const isSelected = chosenGasId === gas.id;
                const isRightOption = isSelected && gas.id === mission.correctGasId;
                const isWrongOption = isSelected && gas.id !== mission.correctGasId;

                return (
                  <button
                    key={gas.id}
                    type="button"
                    onClick={() => handleChooseGas(gas.id)}
                    className={`p-5 rounded-2xl border text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                      isRightOption
                        ? 'bg-emerald-50 border-emerald-400'
                        : isWrongOption
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-lg font-bold text-slate-900">
                        {gas.name}
                      </span>
                      <span className="font-mono-num text-xs font-semibold text-slate-500">
                        {gas.symbol}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed break-keep">
                      {gas.shortTagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => handleSelectMission(Math.max(0, activeIndex - 1))}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
            >
              이전 미션
            </button>
            <button
              type="button"
              disabled={activeIndex === QUIZ_MISSIONS.length - 1}
              onClick={() =>
                handleSelectMission(Math.min(QUIZ_MISSIONS.length - 1, activeIndex + 1))
              }
              className="px-5 py-2.5 rounded-2xl bg-indigo-700 text-sm font-bold text-white hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
            >
              다음 미션
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Certificate Canvas Helpers ---------- */

function drawRoundedRect(
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

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
    rot += step;
  }
  ctx.closePath();
}

function drawTeacherStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.14);

  // Scalloped red flower circle
  ctx.fillStyle = '#FFF1F2';
  ctx.strokeStyle = '#E11D48';
  ctx.lineWidth = 3.5;

  const petals = 12;
  ctx.beginPath();
  for (let i = 0; i < petals; i++) {
    const a1 = (i / petals) * Math.PI * 2;
    const aMid = ((i + 0.5) / petals) * Math.PI * 2;
    const rOuter = 54;
    const rInner = 45;
    if (i === 0) {
      ctx.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
    }
    ctx.quadraticCurveTo(
      Math.cos(aMid) * rOuter,
      Math.sin(aMid) * rOuter,
      Math.cos(((i + 1) / petals) * Math.PI * 2) * rInner,
      Math.sin(((i + 1) / petals) * Math.PI * 2) * rInner
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#FDA4AF';
  ctx.stroke();

  ctx.fillStyle = '#BE123C';
  ctx.textAlign = 'center';
  ctx.font = '700 16px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
  ctx.fillText('탐정 임명', 0, -4);
  ctx.font = '700 13px "IBM Plex Sans KR", "Noto Sans KR", sans-serif';
  ctx.fillText('참 잘했어요!', 0, 16);

  ctx.restore();
}
