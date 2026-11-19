import { useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  FlaskConical,
  Globe,
  HelpCircle,
  Lightbulb,
  MapPin,
  MousePointerClick,
  Navigation,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  GASES_DATA,
  GENERATED_IMAGES,
  GasId,
  SceneHotspot,
  StepBulletPoint,
  StepMiniQuiz,
  TOWN_HOTSPOTS,
} from '../data/gasesData';
import { ResilientImage } from './ResilientImage';

interface TownExplorerProps {
  solvedSpotIds: string[];
  completedMapSpotIds: string[];
  completedMapGasIds: GasId[];
  surpriseQuizResults: Record<string, boolean>;
  hasCheckedSurpriseScore: boolean;
  onSolveSpot: (spotId: string, gasId: GasId) => void;
  onCompleteSpotStudy: (spotId: string, gasId: GasId) => void;
  onUncompleteSpotStudy: (spotId: string, gasId: GasId, revertedStepNum?: number) => void;
  onRecordSurpriseQuizAttempt: (key: string, isCorrect: boolean) => void;
  onCheckSurpriseScore: () => void;
  onResetSpot: (spotId: string, gasId: GasId) => void;
  onGoToLab: (gasId: GasId) => void;
}

export function TownExplorer({
  solvedSpotIds,
  completedMapSpotIds,
  completedMapGasIds,
  surpriseQuizResults,
  hasCheckedSurpriseScore,
  onSolveSpot,
  onCompleteSpotStudy,
  onUncompleteSpotStudy,
  onRecordSurpriseQuizAttempt,
  onCheckSurpriseScore,
  onResetSpot,
  onGoToLab,
}: TownExplorerProps) {
  const [selectedSpot, setSelectedSpot] = useState<SceneHotspot>(TOWN_HOTSPOTS[0]);
  const [wrongGuessBySpot, setWrongGuessBySpot] = useState<Record<string, GasId | null>>({});
  const [showHintBySpot, setShowHintBySpot] = useState<Record<string, boolean>>({});
  const [openedStepsBySpot, setOpenedStepsBySpot] = useState<Record<string, number[]>>({});
  const [quizStartedByKey, setQuizStartedByKey] = useState<Record<string, boolean>>({});
  const [solvedStepsBySpot, setSolvedStepsBySpot] = useState<Record<string, number[]>>(() => {
    const initial: Record<string, number[]> = {};
    completedMapSpotIds.forEach((spotId) => {
      initial[spotId] = [1, 2, 3];
    });
    return initial;
  });
  const [wrongQuizOptByKey, setWrongQuizOptByKey] = useState<Record<string, number | null>>({});

  const isSpotSolved = solvedSpotIds.includes(selectedSpot.id);
  const wrongGasId = wrongGuessBySpot[selectedSpot.id] ?? null;
  const wrongGas = wrongGasId ? GASES_DATA.find((g) => g.id === wrongGasId) : null;
  const showHint = Boolean(showHintBySpot[selectedSpot.id]);

  const openedSteps = openedStepsBySpot[selectedSpot.id] ?? [];
  const isAlreadyCompletedSpot = completedMapSpotIds.includes(selectedSpot.id);
  const solvedSteps =
    solvedStepsBySpot[selectedSpot.id] ?? (isAlreadyCompletedSpot ? [1, 2, 3] : []);
  const allStepsSolvedForSpot = isAlreadyCompletedSpot || solvedSteps.length >= 3;

  // All 6 gases must be explored on the map before the "Check Score -> Go to Lab" flow opens
  const allSixGasesExplored = completedMapGasIds.length >= GASES_DATA.length;

  const targetGas = GASES_DATA.find((g) => g.id === selectedSpot.gasId) ?? GASES_DATA[0];
  const mapHotspots = TOWN_HOTSPOTS.filter((spot) => spot.isOnMap);

  const totalSurpriseQuizzes = TOWN_HOTSPOTS.length * 3;
  const firstTryCorrectCount = TOWN_HOTSPOTS.reduce((acc, spot) => {
    let spotCorrect = 0;
    for (const stepNum of [1, 2, 3]) {
      const key = `${spot.id}:${stepNum}`;
      const recorded = surpriseQuizResults[key];
      if (recorded === true || (recorded === undefined && completedMapSpotIds.includes(spot.id))) {
        spotCorrect += 1;
      }
    }
    return acc + spotCorrect;
  }, 0);

  const handleSelectSpot = (spot: SceneHotspot) => {
    setSelectedSpot(spot);
  };

  const handleGuessGas = (guessedGasId: GasId) => {
    if (guessedGasId === selectedSpot.gasId) {
      setWrongGuessBySpot((prev) => ({ ...prev, [selectedSpot.id]: null }));
      onSolveSpot(selectedSpot.id, selectedSpot.gasId);
      // Automatically open Step 1 so the student reads the explanation first
      setOpenedStepsBySpot((prev) => {
        const cur = prev[selectedSpot.id] ?? [];
        return cur.includes(1) ? prev : { ...prev, [selectedSpot.id]: [...cur, 1] };
      });
    } else {
      setWrongGuessBySpot((prev) => ({ ...prev, [selectedSpot.id]: guessedGasId }));
      setShowHintBySpot((prev) => ({ ...prev, [selectedSpot.id]: true }));
    }
  };

  const handleToggleOpenStep = (stepNum: number) => {
    setOpenedStepsBySpot((prev) => {
      const current = prev[selectedSpot.id] ?? [];
      if (current.includes(stepNum)) {
        return prev;
      }
      return {
        ...prev,
        [selectedSpot.id]: [...current, stepNum],
      };
    });
  };

  const handleStartStepQuiz = (stepNum: number) => {
    const key = `${selectedSpot.id}:${stepNum}`;
    setQuizStartedByKey((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const handleAnswerStepQuiz = (stepNum: number, chosenIdx: number, correctIdx: number) => {
    const key = `${selectedSpot.id}:${stepNum}`;
    if (chosenIdx === correctIdx) {
      onRecordSurpriseQuizAttempt(key, true);
      setWrongQuizOptByKey((prev) => ({ ...prev, [key]: null }));
      const currentSolved = solvedStepsBySpot[selectedSpot.id] ?? [];
      const nextSolved = currentSolved.includes(stepNum) ? currentSolved : [...currentSolved, stepNum];

      setSolvedStepsBySpot((prev) => ({
        ...prev,
        [selectedSpot.id]: nextSolved,
      }));

      // Automatically open the next step for reading first
      if (stepNum < 3) {
        const nextStep = stepNum + 1;
        setOpenedStepsBySpot((prev) => {
          const cur = prev[selectedSpot.id] ?? [];
          return cur.includes(nextStep) ? prev : { ...prev, [selectedSpot.id]: [...cur, nextStep] };
        });
      }

      if (nextSolved.length >= 3) {
        onCompleteSpotStudy(selectedSpot.id, selectedSpot.gasId);
      }
    } else {
      onRecordSurpriseQuizAttempt(key, false);
      setWrongQuizOptByKey((prev) => ({ ...prev, [key]: chosenIdx }));
    }
  };

  const handleRevertStepQuiz = (stepNum: number) => {
    const key = `${selectedSpot.id}:${stepNum}`;
    const baseSolved =
      solvedStepsBySpot[selectedSpot.id] ?? (isAlreadyCompletedSpot ? [1, 2, 3] : []);
    const nextSolved = baseSolved.filter((n) => n !== stepNum);

    setSolvedStepsBySpot((prev) => ({
      ...prev,
      [selectedSpot.id]: nextSolved,
    }));
    setOpenedStepsBySpot((prev) => {
      const cur = prev[selectedSpot.id] ?? (isAlreadyCompletedSpot ? [1, 2, 3] : []);
      return cur.includes(stepNum) ? prev : { ...prev, [selectedSpot.id]: [...cur, stepNum] };
    });
    setQuizStartedByKey((prev) => ({ ...prev, [key]: false }));
    setWrongQuizOptByKey((prev) => ({ ...prev, [key]: null }));

    onUncompleteSpotStudy(selectedSpot.id, selectedSpot.gasId, stepNum);
  };

  const handleRevertSpot = () => {
    setWrongGuessBySpot((prev) => ({ ...prev, [selectedSpot.id]: null }));
    setShowHintBySpot((prev) => ({ ...prev, [selectedSpot.id]: false }));
    setOpenedStepsBySpot((prev) => ({ ...prev, [selectedSpot.id]: [] }));
    setSolvedStepsBySpot((prev) => ({ ...prev, [selectedSpot.id]: [] }));
    setQuizStartedByKey((prev) => ({
      ...prev,
      [`${selectedSpot.id}:1`]: false,
      [`${selectedSpot.id}:2`]: false,
      [`${selectedSpot.id}:3`]: false,
    }));
    setWrongQuizOptByKey((prev) => ({
      ...prev,
      [`${selectedSpot.id}:1`]: null,
      [`${selectedSpot.id}:2`]: null,
      [`${selectedSpot.id}:3`]: null,
    }));
    onResetSpot(selectedSpot.id, selectedSpot.gasId);
  };

  const nextStepToComplete = allStepsSolvedForSpot
    ? null
    : !solvedSteps.includes(1) && !isAlreadyCompletedSpot
    ? 1
    : !solvedSteps.includes(2) && !isAlreadyCompletedSpot
    ? 2
    : !solvedSteps.includes(3) && !isAlreadyCompletedSpot
    ? 3
    : null;

  const nextUnfinishedSpot = TOWN_HOTSPOTS.find(
    (s) => s.id !== selectedSpot.id && !completedMapSpotIds.includes(s.id)
  );

  return (
    <section aria-labelledby="explorer-heading" className="space-y-8">
      {/* Page 1 Hero Banner: Sky Blue Theme */}
      <div className="bg-sky-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
              <Compass className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 break-keep">
                1단계 탐험 미션 · 우리 주변에서 기체 찾기
              </p>
              <h1
                id="explorer-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug break-keep"
              >
                그림 속 1~6번 장소를 눌러 숨은 기체를 맞혀 보세요!
              </h1>
              <p className="text-sm sm:text-base text-sky-100 leading-relaxed break-keep">
                6가지 장소를 모두 탐험해 ‘참 잘했어요’ 도장을 모으면{' '}
                <strong className="font-bold text-white underline decoration-amber-300 decoration-2 underline-offset-4">
                  성질 실험실로 가기
                </strong>{' '}
                버튼이 열립니다.
              </p>
            </div>
          </div>

          {/* High-Visibility 6-Stamp Board */}
          <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shrink-0 shadow-sm space-y-3.5 xl:min-w-[350px]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
                <span className="font-display text-base font-bold text-slate-900">
                  모은 탐험 도장
                </span>
              </div>
              <span className="font-mono-num text-base font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                {completedMapGasIds.length} / {GASES_DATA.length}개
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 xl:grid-cols-3 gap-2.5">
              {TOWN_HOTSPOTS.map((spot) => {
                const gas = GASES_DATA.find((g) => g.id === spot.gasId);
                const done = completedMapGasIds.includes(spot.gasId);
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleSelectSpot(spot)}
                    className={`px-2.5 py-2.5 rounded-xl border text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      done
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <MiniFlowerStampIcon done={done} />
                    <span className="text-xs font-bold truncate max-w-full">
                      {done ? `${gas?.name} 도장` : `${spot.number}번 탐험`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Unified Panorama Town + 6-Zone Detail Map */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* 1) Continuous Single-Scene Town Panorama (all 6 gases 1~6 - visual overview only) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800 inline-flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-600" aria-hidden="true" />
                  우리 동네 한눈에 보기 (하나로 이어진 풍경 · 1~6번)
                </span>
                <span className="text-xs text-slate-500">하나로 이어진 동네 모습을 먼저 살펴보세요</span>
              </div>

              <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 aspect-[16/9] border border-slate-200 select-none">
                <ResilientImage
                  src={GENERATED_IMAGES.heroTownPanorama}
                  alt="공원 아이들(산소), 하늘 풍선(헬륨), 과자 매점(질소), 카페 탄산음료와 소화기(이산화 탄소), 가게 네온사인(네온), 친환경 수소 버스와 우주 로켓(수소)이 하나의 마을 풍경으로 이어진 그림"
                  fallbackTitle="하나로 이어진 우리 동네 1~6번 기체 풍경"
                  className="w-full h-full object-cover select-none"
                />

                {(
                  [
                    { spotId: 'spot-1-oxygen', x: 10, y: 74 },
                    { spotId: 'spot-2-helium', x: 17, y: 18 },
                    { spotId: 'spot-3-nitrogen', x: 34, y: 46 },
                    { spotId: 'spot-4-co2', x: 50, y: 76 },
                    { spotId: 'spot-5-neon', x: 82, y: 38 },
                    { spotId: 'spot-6-hydrogen', x: 88, y: 66 },
                  ] as const
                ).map(({ spotId, x, y }) => {
                  const spot = TOWN_HOTSPOTS.find((s) => s.id === spotId);
                  if (!spot) return null;
                  const isSelected = selectedSpot.id === spot.id;
                  const isCompleted = completedMapSpotIds.includes(spot.id);
                  const isSolved = solvedSpotIds.includes(spot.id);

                  return (
                    <div
                      key={`pano-${spot.id}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      aria-hidden="true"
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
                    >
                      {isSelected && (
                        <span className="absolute inset-0 rounded-full bg-sky-400/75 animate-ping" />
                      )}
                      <span
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full font-display font-bold text-base sm:text-lg flex items-center justify-center shadow-md transition-transform ${
                          isSelected
                            ? 'bg-sky-600 text-white scale-115 ring-4 ring-white'
                            : isCompleted
                            ? 'bg-emerald-600 text-white ring-2 ring-white'
                            : isSolved
                            ? 'bg-sky-500 text-white ring-2 ring-white'
                            : 'bg-amber-500 text-white ring-2 ring-white'
                        }`}
                      >
                        {spot.number}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2) 6-Zone Detailed Scene Grid (1~6 all gases including Hydrogen - interactive) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800 inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-600" aria-hidden="true" />
                  6가지 기체 구역 자세히 보기 (1~6번)
                </span>
                <span className="text-xs font-semibold text-sky-700">아래 그림 속 1~6번 번호를 눌러 탐험하세요!</span>
              </div>

              <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 aspect-[3/2] border border-slate-200">
                <ResilientImage
                  src={GENERATED_IMAGES.heroTown}
                  alt="1번 공원 아이들, 2번 하늘 풍선, 3번 과자 가게, 4번 카페 탄산음료와 소화기, 5번 베이커리 네온사인, 6번 친환경 수소 버스와 로켓 등 6가지 장면이 나란히 그려진 그림"
                  fallbackTitle="우리 동네 1~6번 기체 탐험 지도"
                  className="w-full h-full object-cover select-none"
                />

                {/* All 6 Numbered Pins Placed Cleanly on the 6-Scene Map */}
                {mapHotspots.map((spot) => {
                  const isSelected = selectedSpot.id === spot.id;
                  const isCompleted = completedMapSpotIds.includes(spot.id);
                  const isSolved = solvedSpotIds.includes(spot.id);

                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => handleSelectSpot(spot)}
                      style={{
                        left: `${spot.xPercent}%`,
                        top: `${spot.yPercent}%`,
                      }}
                      aria-label={`${spot.number}번 ${spot.label} 탐구하기`}
                      aria-pressed={isSelected}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    >
                      <span
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-display font-bold text-xl sm:text-2xl flex items-center justify-center shadow-lg transition-transform duration-150 ${
                          isSelected
                            ? 'bg-sky-600 text-white scale-115 ring-4 ring-white'
                            : isCompleted
                            ? 'bg-emerald-600 text-white hover:scale-110 ring-3 ring-white'
                            : isSolved
                            ? 'bg-sky-500 text-white hover:scale-110 ring-3 ring-white'
                            : 'bg-amber-500 text-white hover:scale-110 ring-3 ring-white'
                        }`}
                      >
                        {spot.number}
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap shadow-sm border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white/95 text-slate-900 border-slate-200'
                        }`}
                      >
                        {spot.pinShortLabel}
                        {isCompleted && ' ★'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* At-a-glance 1~6 Exploration List */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <span className="font-bold text-slate-800 inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" aria-hidden="true" />
                탐험 장소 한눈에 보기 (1~6번 모두 탐험해 보세요!)
              </span>
              <span className="text-xs">주황: 찾기 전 · 초록: 도장 획득</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TOWN_HOTSPOTS.map((spot) => {
                const isSelected = selectedSpot.id === spot.id;
                const isCompleted = completedMapSpotIds.includes(spot.id);
                const isSolved = solvedSpotIds.includes(spot.id);
                const gas = GASES_DATA.find((g) => g.id === spot.gasId);

                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleSelectSpot(spot)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 text-slate-900'
                        : isCompleted
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-800 hover:bg-emerald-50'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-8 h-8 rounded-full text-sm font-display font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isSolved
                            ? 'bg-sky-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {spot.number}
                      </span>
                      <span className="text-sm font-semibold truncate">{spot.label}</span>
                    </div>

                    <span className="text-xs font-bold shrink-0">
                      {isCompleted ? (
                        <span className="text-rose-600">참 잘했어요!</span>
                      ) : isSolved ? (
                        <span className="text-sky-700">{gas?.name} · 남음</span>
                      ) : (
                        <span className="text-slate-400">고르기</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Minimap HUD + Structured Itemized Concept Cards */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Upper-Right Intuitive Current Location Minimap */}
            <TownMinimap
              selectedSpot={selectedSpot}
              solvedSpotIds={solvedSpotIds}
              completedMapSpotIds={completedMapSpotIds}
              onSelectSpot={handleSelectSpot}
            />

            {/* Location Kicker */}
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                <MapPin className="w-4 h-4 text-sky-600" aria-hidden="true" />
                {selectedSpot.placeLabel}
              </span>
              <span
                className={`font-bold ${
                  allStepsSolvedForSpot
                    ? 'text-rose-600'
                    : isSpotSolved
                    ? 'text-sky-700'
                    : 'text-amber-700'
                }`}
              >
                {allStepsSolvedForSpot
                  ? '확인 도장 완료!'
                  : isSpotSolved
                  ? '설명 읽고 깜짝 퀴즈'
                  : '1단계 · 기체 고르기'}
              </span>
            </div>

            {/* Spot Title & Question */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-snug flex items-center gap-3 break-keep">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sky-600 text-white text-lg font-bold shrink-0">
                  {selectedSpot.number}
                </span>
                <span>{selectedSpot.label}</span>
              </h2>
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 break-keep">
                {selectedSpot.clueQuestion}
              </p>
            </div>

            {/* PHASE A: Student Picks the Gas */}
            {!isSpotSolved ? (
              <div className="space-y-5">
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setShowHintBySpot((prev) => ({
                        ...prev,
                        [selectedSpot.id]: !showHint,
                      }))
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-700 hover:text-sky-800 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" aria-hidden="true" />
                    {showHint ? '힌트 닫기' : '어려우면 힌트 보기'}
                  </button>
                  {showHint && (
                    <div className="mt-3 p-5 rounded-2xl bg-sky-50 border border-sky-200 text-sm sm:text-base text-sky-950 leading-relaxed break-keep">
                      힌트: {selectedSpot.clueHint}
                    </div>
                  )}
                </div>

                {wrongGas && (
                  <div
                    role="status"
                    className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm sm:text-base text-amber-950 flex items-start gap-3 break-keep"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>
                      <strong>{wrongGas.name}</strong>는 조금 달라요! 위의 힌트를 읽고 다시 골라 보세요.
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <MousePointerClick className="w-4 h-4 text-sky-600" aria-hidden="true" />
                    알맞은 기체를 골라 보세요:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {GASES_DATA.map((gas) => {
                      const isWrongPicked = wrongGasId === gas.id;
                      return (
                        <button
                          key={gas.id}
                          type="button"
                          onClick={() => handleGuessGas(gas.id)}
                          className={`p-4 sm:p-5 rounded-2xl border text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                            isWrongPicked
                              ? 'bg-amber-50/70 border-amber-300 text-slate-700'
                              : 'bg-white border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-900'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-display text-lg font-bold">{gas.name}</span>
                            <span className="font-mono-num text-xs font-semibold text-slate-500">
                              {gas.symbol}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* PHASE B: Solved! Colored-Pencil Answer Card + Itemized Step Cards with Unique Images */
              <div className="space-y-5">
                <div className="relative rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-5 sm:p-6 space-y-4 overflow-hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 pr-2">
                      <p className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                        정답을 맞혔어요!
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight break-keep">
                        {selectedSpot.discoveryTitle}
                      </h3>
                      <p className="text-sm text-emerald-900 font-medium break-keep">
                        {targetGas.name}{' '}
                        <span className="font-mono-num font-bold text-emerald-700">
                          ({targetGas.symbol})
                        </span>{' '}
                        · {targetGas.airShareText} · {targetGas.colorSmell}
                      </p>
                    </div>

                    <TeacherStamp
                      label={allStepsSolvedForSpot ? '참 잘했어요!' : '정답 맞힘!'}
                      subLabel={allStepsSolvedForSpot ? '탐험 완료' : '퀴즈 풀기'}
                      variant={allStepsSolvedForSpot ? 'rose' : 'emerald'}
                    />
                  </div>

                  <div className="rounded-2xl overflow-hidden border-2 border-white shadow-sm aspect-[4/3] bg-amber-50">
                    <ResilientImage
                      src={targetGas.answerIllustration}
                      alt={targetGas.answerIllustrationAlt}
                      fallbackTitle={`${targetGas.name} 색연필 일러스트`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleRevertSpot}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-xs sm:text-sm font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                      <span>{selectedSpot.number}번 장소 실행 전으로 되돌리기</span>
                    </button>
                  </div>
                </div>

                {/* Next Step Prompt */}
                {nextStepToComplete !== null && (
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-display font-bold text-sm break-keep">
                      <MousePointerClick className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
                      <span>
                        아래 {nextStepToComplete === 1 ? '①번' : nextStepToComplete === 2 ? '②번' : '③번'} 설명을 읽고 깜짝 퀴즈를 풀어 보세요!
                      </span>
                    </div>
                    <ArrowDown className="w-5 h-5 text-amber-600" aria-hidden="true" />
                  </div>
                )}

                {/* 3 Interactive Read-Then-Surprise-Quiz Step Cards */}
                <div className="space-y-3">
                  <StepCardButton
                    stepNumber={1}
                    title={`① ${targetGas.name}는 어떤 성질이 있을까요?`}
                    points={selectedSpot.step1Points}
                    quiz={selectedSpot.step1Quiz}
                    imageSrc={selectedSpot.step1Image}
                    imageAlt={selectedSpot.step1ImageAlt}
                    Icon={Atom}
                    isOpen={openedSteps.includes(1) || allStepsSolvedForSpot}
                    isQuizStarted={Boolean(quizStartedByKey[`${selectedSpot.id}:1`])}
                    isQuizSolved={solvedSteps.includes(1) || allStepsSolvedForSpot}
                    isFirstTryCorrect={
                      surpriseQuizResults[`${selectedSpot.id}:1`] ??
                      (isAlreadyCompletedSpot ? true : null)
                    }
                    isNextToClick={nextStepToComplete === 1}
                    wrongOptionIdx={wrongQuizOptByKey[`${selectedSpot.id}:1`] ?? null}
                    onOpen={() => handleToggleOpenStep(1)}
                    onStartQuiz={() => handleStartStepQuiz(1)}
                    onAnswerQuiz={(idx) =>
                      handleAnswerStepQuiz(1, idx, selectedSpot.step1Quiz.correctIndex)
                    }
                    onRevertQuiz={() => handleRevertStepQuiz(1)}
                  />

                  <div className="flex justify-center">
                    <ArrowDown
                      className={`w-5 h-5 ${
                        nextStepToComplete === 2 ? 'text-amber-600' : 'text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <StepCardButton
                    stepNumber={2}
                    title={`② 왜 ${selectedSpot.label}에 쓰였을까요?`}
                    points={selectedSpot.step2Points}
                    quiz={selectedSpot.step2Quiz}
                    imageSrc={selectedSpot.step2Image}
                    imageAlt={selectedSpot.step2ImageAlt}
                    Icon={Lightbulb}
                    isOpen={openedSteps.includes(2) || allStepsSolvedForSpot}
                    isQuizStarted={Boolean(quizStartedByKey[`${selectedSpot.id}:2`])}
                    isQuizSolved={solvedSteps.includes(2) || allStepsSolvedForSpot}
                    isFirstTryCorrect={
                      surpriseQuizResults[`${selectedSpot.id}:2`] ??
                      (isAlreadyCompletedSpot ? true : null)
                    }
                    isNextToClick={nextStepToComplete === 2}
                    wrongOptionIdx={wrongQuizOptByKey[`${selectedSpot.id}:2`] ?? null}
                    onOpen={() => handleToggleOpenStep(2)}
                    onStartQuiz={() => handleStartStepQuiz(2)}
                    onAnswerQuiz={(idx) =>
                      handleAnswerStepQuiz(2, idx, selectedSpot.step2Quiz.correctIndex)
                    }
                    onRevertQuiz={() => handleRevertStepQuiz(2)}
                  />

                  <div className="flex justify-center">
                    <ArrowDown
                      className={`w-5 h-5 ${
                        nextStepToComplete === 3 ? 'text-amber-600' : 'text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  <StepCardButton
                    stepNumber={3}
                    title="③ 일상생활의 또 다른 이용 사례는?"
                    points={selectedSpot.step3Points}
                    quiz={selectedSpot.step3Quiz}
                    imageSrc={selectedSpot.step3Image}
                    imageAlt={selectedSpot.step3ImageAlt}
                    Icon={Globe}
                    isOpen={openedSteps.includes(3) || allStepsSolvedForSpot}
                    isQuizStarted={Boolean(quizStartedByKey[`${selectedSpot.id}:3`])}
                    isQuizSolved={solvedSteps.includes(3) || allStepsSolvedForSpot}
                    isFirstTryCorrect={
                      surpriseQuizResults[`${selectedSpot.id}:3`] ??
                      (isAlreadyCompletedSpot ? true : null)
                    }
                    isNextToClick={nextStepToComplete === 3}
                    wrongOptionIdx={wrongQuizOptByKey[`${selectedSpot.id}:3`] ?? null}
                    onOpen={() => handleToggleOpenStep(3)}
                    onStartQuiz={() => handleStartStepQuiz(3)}
                    onAnswerQuiz={(idx) =>
                      handleAnswerStepQuiz(3, idx, selectedSpot.step3Quiz.correctIndex)
                    }
                    onRevertQuiz={() => handleRevertStepQuiz(3)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Score Verification Gate BEFORE Lab Gate */}
          <div className="pt-5 border-t border-slate-100 space-y-3">
            {allSixGasesExplored ? (
              !hasCheckedSurpriseScore ? (
                <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-bold text-base sm:text-lg text-slate-900 break-keep">
                        6가지 기체 공부를 모두 마쳤어요!
                      </p>
                      <p className="text-xs sm:text-sm text-amber-950 leading-relaxed break-keep">
                        성질 실험실로 가기 전에, 지금까지 푼 <strong>18개의 깜짝 퀴즈</strong> 중 몇 개를 한 번에 맞혔는지 먼저 확인해 볼까요?
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onCheckSurpriseScore}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-500 text-slate-950 font-display font-bold text-base sm:text-lg hover:bg-amber-400 transition-colors cursor-pointer shadow-sm"
                  >
                    <Trophy className="w-5 h-5" aria-hidden="true" />
                    <span>깜짝 퀴즈 몇 개 맞혔는지 확인하기</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Trophy className="w-6 h-6 text-amber-500 shrink-0" aria-hidden="true" />
                        <span className="font-display font-bold text-base sm:text-lg text-emerald-950">
                          깜짝 퀴즈 종합 결과
                        </span>
                      </div>
                      <span className="font-mono-num px-3 py-1 rounded-full bg-white border border-emerald-300 text-sm sm:text-base font-extrabold text-emerald-800">
                        {firstTryCorrectCount} / {totalSurpriseQuizzes}개 정답!
                      </span>
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-800 break-keep">
                      {firstTryCorrectCount === totalSurpriseQuizzes
                        ? '우와! 18개의 깜짝 퀴즈를 모두 한 번에 맞힌 최고의 기체 척척박사예요!'
                        : firstTryCorrectCount >= 14
                        ? `대단해요! ${totalSurpriseQuizzes}개 중 ${firstTryCorrectCount}개를 한 번에 맞히며 성실하게 공부했어요!`
                        : `끝까지 포기하지 않고 ${totalSurpriseQuizzes}개 깜짝 퀴즈를 모두 해결했어요! (${firstTryCorrectCount}개 한 번에 정답)`}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TOWN_HOTSPOTS.map((spot) => {
                        const gas = GASES_DATA.find((g) => g.id === spot.gasId);
                        const stepHits = [1, 2, 3].map((stepNum) => {
                          const key = `${spot.id}:${stepNum}`;
                          const rec = surpriseQuizResults[key];
                          return rec === true || (rec === undefined && completedMapSpotIds.includes(spot.id));
                        });
                        const hitCount = stepHits.filter(Boolean).length;
                        return (
                          <button
                            key={spot.id}
                            type="button"
                            onClick={() => handleSelectSpot(spot)}
                            className="p-2.5 rounded-xl bg-white border border-emerald-200 hover:border-sky-400 text-left transition-colors cursor-pointer space-y-1"
                          >
                            <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-900">
                              <span className="truncate">
                                {spot.number}. {gas?.name}
                              </span>
                              <span className="font-mono-num text-emerald-700 shrink-0">
                                {hitCount}/3
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                              {stepHits.map((ok, i) => (
                                <span
                                  key={i}
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    ok
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {ok ? '★' : '△'}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <p className="text-xs text-slate-600 break-keep">
                      ★ 한 번에 정답 · △ 다시 도전해 해결 (원하는 기체를 눌러 다시 풀어 볼 수도 있어요!)
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onGoToLab(targetGas.id)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-sky-600 text-white font-display font-bold text-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 shadow-sm"
                  >
                    <FlaskConical className="w-5 h-5" aria-hidden="true" />
                    <span>성질 실험실로 가기</span>
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              )
            ) : isSpotSolved && allStepsSolvedForSpot ? (
              <div className="space-y-3">
                {nextUnfinishedSpot && (
                  <button
                    type="button"
                    onClick={() => handleSelectSpot(nextUnfinishedSpot)}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-sky-600 text-white font-display font-bold text-base sm:text-lg hover:bg-sky-700 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
                    <span>
                      다음 {nextUnfinishedSpot.number}번({nextUnfinishedSpot.label}) 탐험하기!
                    </span>
                    <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                  </button>
                )}
                <p className="text-center text-xs sm:text-sm text-slate-500 break-keep">
                  6개 기체 도장을 모두 모으면{' '}
                  <strong className="text-slate-800">깜짝 퀴즈 결과 확인 후 성질 실험실</strong>로 갈 수 있어요! ({completedMapGasIds.length}/6 완료)
                </p>
              </div>
            ) : isSpotSolved ? (
              <p className="text-center py-3.5 px-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-semibold text-amber-900 break-keep">
                위 ①, ②, ③ 설명을 읽고 깜짝 퀴즈를 모두 풀면 &ldquo;참 잘했어요!&rdquo; 확인 도장이 찍혀요!
              </p>
            ) : (
              <p className="text-center py-3.5 px-5 rounded-2xl bg-slate-50 text-sm text-slate-500 break-keep">
                그림 속 번호를 보고 알맞은 기체를 먼저 맞혀 보세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function createScallopedPath(cx: number, cy: number, outerR: number, innerR: number, petals: number) {
  let d = '';
  const total = petals * 2;
  for (let i = 0; i < total; i++) {
    const angle1 = (Math.PI * 2 * i) / total - Math.PI / 2;
    const angle2 = (Math.PI * 2 * (i + 1)) / total - Math.PI / 2;
    const midAngle = (angle1 + angle2) / 2;
    const x1 = cx + innerR * Math.cos(angle1);
    const y1 = cy + innerR * Math.sin(angle1);
    const cpx = cx + outerR * Math.cos(midAngle);
    const cpy = cy + outerR * Math.sin(midAngle);
    const x2 = cx + innerR * Math.cos(angle2);
    const y2 = cy + innerR * Math.sin(angle2);
    if (i === 0) {
      d += `M ${x1.toFixed(1)} ${y1.toFixed(1)} `;
    }
    d += `Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)} `;
  }
  return `${d}Z`;
}

const SCALLOP_120 = createScallopedPath(60, 60, 58, 48, 14);
const SCALLOP_80 = createScallopedPath(40, 40, 38, 32, 12);

function MiniFlowerStampIcon({ done }: { done: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`w-8 h-8 ${done ? '-rotate-6' : ''}`}
      aria-hidden="true"
    >
      <path
        d={SCALLOP_80}
        fill={done ? '#FFF1F2' : '#FFFFFF'}
        stroke={done ? '#E11D48' : '#CBD5E1'}
        strokeWidth="4"
      />
      <circle
        cx="40"
        cy="40"
        r="24"
        fill="none"
        stroke={done ? '#FB7185' : '#E2E8F0'}
        strokeWidth="2"
        strokeDasharray={done ? undefined : '4 3'}
      />
      {done ? (
        <>
          <path
            d="M40 22 L45 33 L57 34 L48 42 L51 54 L40 48 L29 54 L32 42 L23 34 L35 33 Z"
            fill="#FBBF24"
            stroke="#E11D48"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="39" r="1.8" fill="#881337" />
          <circle cx="44" cy="39" r="1.8" fill="#881337" />
          <path d="M36 43 Q40 46.5 44 43" fill="none" stroke="#881337" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : (
        <text
          x="40"
          y="45"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#94A3B8"
        >
          ?
        </text>
      )}
    </svg>
  );
}

function TeacherStamp({
  label,
  subLabel,
  variant = 'rose',
}: {
  label: string;
  subLabel: string;
  variant?: 'rose' | 'emerald';
}) {
  const isRose = variant === 'rose';
  const strokeInk = isRose ? '#E11D48' : '#059669';
  const fillBg = isRose ? '#FFF1F2' : '#ECFDF5';
  const starFill = isRose ? '#FDE047' : '#A7F3D0';
  const textInk = isRose ? '#BE123C' : '#047857';

  return (
    <div
      className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 -rotate-10 select-none drop-shadow-xs"
      aria-label={`${label} 도장`}
    >
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <path
          d={SCALLOP_120}
          fill={fillBg}
          stroke={strokeInk}
          strokeWidth="3.5"
        />
        <circle
          cx="60"
          cy="60"
          r="43"
          fill="#FFFFFF"
          fillOpacity="0.7"
          stroke={strokeInk}
          strokeWidth="2"
        />
        <circle
          cx="60"
          cy="60"
          r="39"
          fill="none"
          stroke={strokeInk}
          strokeWidth="1.2"
          strokeDasharray="3 2.5"
        />
        <path
          d="M60 24 L65.5 35.5 L78 37 L68.8 45.5 L71.2 58 L60 51.8 L48.8 58 L51.2 45.5 L42 37 L54.5 35.5 Z"
          fill={starFill}
          stroke={strokeInk}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <circle cx="55.5" cy="42" r="2" fill={textInk} />
        <circle cx="64.5" cy="42" r="2" fill={textInk} />
        <circle cx="52" cy="45" r="2" fill="#FB7185" opacity="0.65" />
        <circle cx="68" cy="45" r="2" fill="#FB7185" opacity="0.65" />
        <path
          d="M55.5 46.5 Q60 50.5 64.5 46.5"
          fill="none"
          stroke={textInk}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="60"
          y="74"
          textAnchor="middle"
          fontSize="13.5"
          fontWeight="800"
          fill={textInk}
          style={{ fontFamily: '"IBM Plex Sans KR", "Noto Sans KR", sans-serif' }}
        >
          {label}
        </text>
        <text
          x="60"
          y="90"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700"
          fill={strokeInk}
          style={{ fontFamily: '"IBM Plex Sans KR", "Noto Sans KR", sans-serif' }}
        >
          ★ {subLabel} ★
        </text>
      </svg>
    </div>
  );
}

function StepGoodJobStamp() {
  return (
    <div className="w-14 h-14 shrink-0 -rotate-8 select-none" aria-label="참 잘했어요 확인 도장">
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <path
          d={SCALLOP_80}
          fill="#FFF1F2"
          stroke="#E11D48"
          strokeWidth="3"
        />
        <circle
          cx="40"
          cy="40"
          r="27"
          fill="#FFFFFF"
          fillOpacity="0.8"
          stroke="#E11D48"
          strokeWidth="1.6"
        />
        <path
          d="M40 16 L43.5 24 L52 25 L45.8 30.8 L47.5 39 L40 35 L32.5 39 L34.2 30.8 L28 25 L36.5 24 Z"
          fill="#FDE047"
          stroke="#E11D48"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="37.5" cy="28.5" r="1.3" fill="#9F1239" />
        <circle cx="42.5" cy="28.5" r="1.3" fill="#9F1239" />
        <path
          d="M37.5 31.5 Q40 33.8 42.5 31.5"
          fill="none"
          stroke="#9F1239"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <text
          x="40"
          y="50"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#BE123C"
          style={{ fontFamily: '"IBM Plex Sans KR", "Noto Sans KR", sans-serif' }}
        >
          참잘했어요
        </text>
        <text
          x="40"
          y="60"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#E11D48"
          style={{ fontFamily: '"IBM Plex Sans KR", "Noto Sans KR", sans-serif' }}
        >
          확인완료
        </text>
      </svg>
    </div>
  );
}

function StepCardButton({
  stepNumber,
  title,
  points,
  quiz,
  imageSrc,
  imageAlt,
  Icon,
  isOpen,
  isQuizStarted,
  isQuizSolved,
  isFirstTryCorrect,
  isNextToClick,
  wrongOptionIdx,
  onOpen,
  onStartQuiz,
  onAnswerQuiz,
  onRevertQuiz,
}: {
  stepNumber: number;
  title: string;
  points: StepBulletPoint[];
  quiz: StepMiniQuiz;
  imageSrc: string;
  imageAlt: string;
  Icon: typeof Atom;
  isOpen: boolean;
  isQuizStarted: boolean;
  isQuizSolved: boolean;
  isFirstTryCorrect: boolean | null;
  isNextToClick: boolean;
  wrongOptionIdx: number | null;
  onOpen: () => void;
  onStartQuiz: () => void;
  onAnswerQuiz: (optionIdx: number) => void;
  onRevertQuiz: () => void;
}) {
  const numberCircles = ['①', '②', '③'];
  const [peekExplanation, setPeekExplanation] = useState<boolean>(false);

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all ${
        isQuizSolved
          ? 'border border-sky-300'
          : isNextToClick
          ? 'border-2 border-amber-500 shadow-md ring-4 ring-amber-100'
          : 'border border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={isOpen}
        className={`w-full px-5 py-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
          isQuizSolved
            ? 'bg-sky-50 text-sky-950'
            : isNextToClick
            ? 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
        }`}
      >
        <span className="inline-flex items-center gap-3 font-display font-bold text-base sm:text-lg break-keep">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isQuizSolved
                ? 'bg-emerald-600 text-white'
                : isNextToClick
                ? 'bg-slate-950 text-amber-300'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {isQuizSolved ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Icon className="w-4 h-4" aria-hidden="true" />
            )}
          </span>
          <span>{title}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 shrink-0">
          {!isOpen && isNextToClick && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 text-white text-xs font-bold">
              설명 읽기
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </span>
          )}
          {isOpen && !isQuizSolved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-amber-900 border border-amber-300 text-xs font-bold">
              {isQuizStarted ? '깜짝 퀴즈!' : '설명 읽는 중'}
            </span>
          )}
          {isQuizSolved && <StepGoodJobStamp />}
        </span>
      </button>

      {isOpen && (
        <div className="p-5 sm:p-6 bg-white border-t border-sky-100 space-y-5">
          <span className="sr-only">{stepNumber}번 활동: </span>

          {/* Illustration */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[4/3]">
            <ResilientImage
              src={imageSrc}
              alt={imageAlt}
              fallbackTitle={`${stepNumber}번 설명 그림`}
              className="w-full h-full object-cover"
            />
          </div>

          {!isQuizSolved ? (
            !isQuizStarted ? (
              /* PHASE 1: Read Explanation First */
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-900 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                    그림을 보며 핵심 설명을 읽어 보세요!
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-sm sm:text-base leading-relaxed break-keep"
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900 font-bold text-xs sm:text-sm shrink-0 mt-0.5">
                        {point.label}
                      </span>
                      <span className="text-slate-800">{point.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    setPeekExplanation(false);
                    onStartQuiz();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-display font-bold text-sm sm:text-base transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-900" aria-hidden="true" />
                  <span>설명을 다 읽었어요! 깜짝 퀴즈 풀기</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              /* PHASE 2: Surprise Quiz AFTER Reading Explanation */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPeekExplanation((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{peekExplanation ? '설명 다시 접기' : '방금 읽은 설명 잠깐 다시 보기'}</span>
                  </button>
                </div>

                {peekExplanation && (
                  <ul className="space-y-2 p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
                    {points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed break-keep"
                      >
                        <span className="font-bold text-sky-800 shrink-0">[{point.label}]</span>
                        <span className="text-slate-700">{point.text}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                      깜짝 퀴즈!
                    </span>
                    <span className="text-xs font-semibold text-amber-800">
                      방금 읽은 내용을 떠올려 보세요
                    </span>
                  </div>

                  <p className="font-display font-bold text-base text-slate-900 leading-snug break-keep">
                    {quiz.question}
                  </p>

                  <div className="space-y-2">
                    {quiz.options.map((opt, idx) => {
                      const isWrong = wrongOptionIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onAnswerQuiz(idx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold flex items-start gap-2.5 transition-colors cursor-pointer break-keep ${
                            isWrong
                              ? 'bg-amber-100 border-amber-400 text-amber-950'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-400'
                          }`}
                        >
                          <span className="font-display font-bold text-sky-700 shrink-0">
                            {numberCircles[idx] ?? `${idx + 1}.`}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {wrongOptionIdx !== null && (
                    <div
                      role="status"
                      className="p-3.5 rounded-xl bg-white border border-amber-300 text-xs sm:text-sm text-amber-950 flex items-start gap-2 break-keep"
                    >
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        <strong>아쉬워요!</strong> 힌트: {quiz.hint}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Solved State: Result Badge + Celebration + Explanation Review + Revert */
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-bold flex items-start justify-between gap-2 break-keep">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{quiz.successNote}</span>
                </div>
                {isFirstTryCorrect !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold shrink-0 ${
                      isFirstTryCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isFirstTryCorrect ? '★ 한 번에 정답!' : '△ 다시 도전 해결'}
                  </span>
                )}
              </div>

              <ul className="space-y-2.5">
                {points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-sm sm:text-base leading-relaxed break-keep"
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-900 font-bold text-xs sm:text-sm shrink-0 mt-0.5">
                      {point.label}
                    </span>
                    <span className="text-slate-800">{point.text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPeekExplanation(false);
                    onRevertQuiz();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-950 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                  <span>실행 전으로 되돌리기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MINIMAP_ZONES: {
  spotId: string;
  shortName: string;
  bgClass: string;
  borderClass: string;
}[] = [
  { spotId: 'spot-1-oxygen', shortName: '공원', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-200' },
  { spotId: 'spot-2-helium', shortName: '하늘 풍선', bgClass: 'bg-sky-50', borderClass: 'border-sky-200' },
  { spotId: 'spot-3-nitrogen', shortName: '과자 매점', bgClass: 'bg-amber-50', borderClass: 'border-amber-200' },
  { spotId: 'spot-4-co2', shortName: '카페·소화기', bgClass: 'bg-teal-50', borderClass: 'border-teal-200' },
  { spotId: 'spot-5-neon', shortName: '네온 거리', bgClass: 'bg-indigo-50', borderClass: 'border-indigo-200' },
  { spotId: 'spot-6-hydrogen', shortName: '미래 도로', bgClass: 'bg-cyan-50', borderClass: 'border-cyan-200' },
];

function TownMinimap({
  selectedSpot,
  solvedSpotIds,
  completedMapSpotIds,
  onSelectSpot,
}: {
  selectedSpot: SceneHotspot;
  solvedSpotIds: string[];
  completedMapSpotIds: string[];
  onSelectSpot: (spot: SceneHotspot) => void;
}) {
  return (
    <div
      role="region"
      aria-label="현재 위치 미니맵"
      className="rounded-2xl border-2 border-sky-200 bg-sky-50/70 p-3.5 sm:p-4 space-y-3"
    >
      {/* Minimap Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-900">
          <span className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
          </span>
          <span>현재 위치 미니맵</span>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-600 text-white text-xs font-bold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" aria-hidden="true" />
          <span>
            지금 여기: {selectedSpot.number}번 ({selectedSpot.pinShortLabel.replace(/^\d+\.\s*/, '')})
          </span>
        </span>
      </div>

      {/* 3x2 Spatial Town Grid Matching the 6-Scene Map */}
      <div className="relative rounded-xl bg-white border border-sky-200/90 p-2.5 shadow-2xs">
        {/* Connecting Town Path SVG Behind Tiles */}
        <svg
          viewBox="0 0 300 120"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M50 32 L150 32 L250 32 C275 32 275 88 250 88 L50 88"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="3"
            strokeDasharray="6 5"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-3 gap-2">
          {MINIMAP_ZONES.map((zone) => {
            const spot = TOWN_HOTSPOTS.find((s) => s.id === zone.spotId);
            if (!spot) return null;
            const isCurrent = selectedSpot.id === spot.id;
            const isCompleted = completedMapSpotIds.includes(spot.id);
            const isSolved = solvedSpotIds.includes(spot.id);

            return (
              <button
                key={`mini-${spot.id}`}
                type="button"
                onClick={() => onSelectSpot(spot)}
                aria-label={`미니맵 ${spot.number}번 ${zone.shortName}${isCurrent ? ' (현재 위치)' : ''}`}
                aria-current={isCurrent ? 'location' : undefined}
                className={`relative rounded-xl p-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                  isCurrent
                    ? 'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-300 shadow-sm scale-[1.03]'
                    : isCompleted
                    ? 'bg-emerald-50/90 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                    : isSolved
                    ? 'bg-sky-50 text-sky-950 border-sky-300 hover:bg-sky-100'
                    : `${zone.bgClass} ${zone.borderClass} text-slate-700 hover:brightness-95`
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2 right-1.5 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-extrabold shadow-xs leading-tight">
                    여기!
                  </span>
                )}

                <div className="relative flex items-center justify-center">
                  {isCurrent && (
                    <span
                      className="absolute inset-0 rounded-full bg-white/60 animate-ping"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative w-6 h-6 rounded-full font-display font-bold text-xs flex items-center justify-center ${
                      isCurrent
                        ? 'bg-white text-sky-700'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isSolved
                        ? 'bg-sky-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {spot.number}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold leading-tight truncate max-w-full ${
                    isCurrent ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {zone.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact Minimap Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-200" aria-hidden="true" />
            현재 위치
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
            완료
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
            탐험 전
          </span>
        </div>
        <span className="text-sky-800 font-bold">눌러서 바로 이동</span>
      </div>
    </div>
  );
}
