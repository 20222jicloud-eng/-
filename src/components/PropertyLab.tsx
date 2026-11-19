import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Flame,
  FlaskConical,
  HelpCircle,
  Play,
  RotateCcw,
  Scale,
  Zap,
} from 'lucide-react';
import {
  EXPERIMENT_LIST,
  ExperimentId,
  ExperimentResult,
  GASES_DATA,
  GasId,
} from '../data/gasesData';
import { ResilientImage } from './ResilientImage';

interface PropertyLabProps {
  selectedGasId: GasId;
  onSelectGasId: (gasId: GasId) => void;
  testedExperimentsByGas: Record<GasId, ExperimentId[]>;
  onRecordExperiment: (gasId: GasId, experimentId: ExperimentId) => void;
  onRevertExperiment: (gasId: GasId, experimentId: ExperimentId) => void;
  onGoToNotebook: (gasId: GasId) => void;
}

const BEFORE_STATE_LABELS: Record<ExperimentId, string> = {
  flame: '실험 전: 뚜껑이 닫힌 병 밖에 향불이 대기 중',
  limewater: '실험 전: 비커 속 석회수가 맑고 투명한 상태',
  weight: '실험 전: 공기 풍선과 기체 풍선이 출발선 대기',
  electric: '실험 전: 전원 스위치가 꺼져 유리관이 어두운 상태',
};

export function PropertyLab({
  selectedGasId,
  onSelectGasId,
  testedExperimentsByGas,
  onRecordExperiment,
  onRevertExperiment,
  onGoToNotebook,
}: PropertyLabProps) {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentId>('flame');
  const [runExperimentsMap, setRunExperimentsMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    (Object.keys(testedExperimentsByGas) as GasId[]).forEach((gId) => {
      (testedExperimentsByGas[gId] ?? []).forEach((expId) => {
        initial[`${gId}:${expId}`] = true;
      });
    });
    return initial;
  });

  const activeGas = GASES_DATA.find((g) => g.id === selectedGasId) ?? GASES_DATA[0];
  const currentExperimentMeta =
    EXPERIMENT_LIST.find((e) => e.id === selectedExperiment) ?? EXPERIMENT_LIST[0];
  const result = activeGas.experiments[selectedExperiment];

  const currentExpKey = `${activeGas.id}:${selectedExperiment}`;
  const testedForGas = testedExperimentsByGas[activeGas.id] ?? [];
  const hasRunExperiment =
    Boolean(runExperimentsMap[currentExpKey]) || testedForGas.includes(selectedExperiment);
  const isLabCompleteForGas = testedForGas.length >= 2;
  const hasAnyTestedForGas = testedForGas.length > 0;

  const handleRunTest = () => {
    setRunExperimentsMap((prev) => ({
      ...prev,
      [currentExpKey]: true,
    }));
    onRecordExperiment(activeGas.id, selectedExperiment);
  };

  const handleRevertTest = () => {
    setRunExperimentsMap((prev) => ({
      ...prev,
      [currentExpKey]: false,
    }));
    onRevertExperiment(activeGas.id, selectedExperiment);
  };

  const handleSelectExperiment = (expId: ExperimentId) => {
    setSelectedExperiment(expId);
  };

  const handleGasChange = (gasId: GasId) => {
    onSelectGasId(gasId);
  };

  return (
    <section aria-labelledby="lab-heading" className="space-y-8">
      {/* Page 2 Hero Banner: Emerald Green Theme */}
      <div className="bg-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0">
              <FlaskConical className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-wide text-amber-300 break-keep">
                2단계 · 기체의 성질 실험실
              </p>
              <h1
                id="lab-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug break-keep"
              >
                실험 전 모습을 보고 예상한 뒤, 결과를 확인하세요!
              </h1>
              <p className="text-sm sm:text-base text-emerald-50 leading-relaxed break-keep">
                기체와 실험 방법을 고른 다음{' '}
                <strong className="font-bold text-white underline decoration-amber-300 decoration-2 underline-offset-4">
                  실험 결과 확인하기
                </strong>{' '}
                버튼을 누르면 실험 전과 후의 변화를 비교할 수 있어요.
              </p>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl p-5 shrink-0 shadow-sm min-w-[220px] space-y-1">
            <p className="text-xs font-bold text-slate-500">현재 기체 실험 진행</p>
            <p className="font-display text-lg font-bold text-slate-900">
              {activeGas.name} ({activeGas.symbol})
            </p>
            <p
              className={`font-mono-num text-base font-bold ${
                isLabCompleteForGas ? 'text-emerald-600' : 'text-sky-700'
              }`}
            >
              {testedForGas.length} / {EXPERIMENT_LIST.length}개 완료 (2개 이상 필수)
            </p>
          </div>
        </div>
      </div>

      {/* Gas Selector Bar */}
      <div
        role="tablist"
        aria-label="실험할 기체 선택"
        className="flex flex-wrap items-center gap-2 p-2 bg-slate-100 rounded-2xl w-fit border border-slate-200"
      >
        {GASES_DATA.map((gas) => {
          const active = gas.id === activeGas.id;
          const doneCount = (testedExperimentsByGas[gas.id] ?? []).length;
          return (
            <button
              key={gas.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => handleGasChange(gas.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                active
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <span>{gas.name}</span>
              <span
                className={`font-mono-num text-xs ${
                  active ? 'text-emerald-100' : 'text-slate-500'
                }`}
              >
                {gas.symbol}
              </span>
              {doneCount >= 2 && (
                <Check
                  className={`w-4 h-4 ${active ? 'text-amber-300' : 'text-emerald-600'}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Two-Zone Educational Simulation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          {/* Experiment Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EXPERIMENT_LIST.map((exp) => {
              const active = exp.id === selectedExperiment;
              const alreadyTested = testedForGas.includes(exp.id);
              const Icon =
                exp.id === 'flame'
                  ? Flame
                  : exp.id === 'limewater'
                  ? FlaskConical
                  : exp.id === 'weight'
                  ? Scale
                  : Zap;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => handleSelectExperiment(exp.id)}
                  className={`px-3.5 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                    active
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-100'
                      : alreadyTested
                      ? 'bg-sky-50/60 border-sky-200 text-sky-900 hover:bg-sky-50'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{exp.shortLabel}</span>
                  {alreadyTested && (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Before vs After Stage */}
          <div
            className={`border rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center min-h-[380px] space-y-5 transition-colors ${
              hasRunExperiment
                ? 'bg-emerald-50/40 border-emerald-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Clear State Header Strip */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <span className="text-xs sm:text-sm font-bold text-slate-700">
                {activeGas.name} ({activeGas.symbol}) · {currentExperimentMeta.title}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  hasRunExperiment
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {hasRunExperiment ? '실험 후 관찰 결과!' : '실험 전 상태 (예상하기)'}
              </span>
            </div>

            <p className="font-display text-lg sm:text-xl font-bold text-slate-900 text-center break-keep">
              {currentExperimentMeta.question}
            </p>

            {/* Clear Before -> After Comparison Visual */}
            <ExperimentVisual
              gasName={activeGas.name}
              gasSymbol={activeGas.symbol}
              experimentId={selectedExperiment}
              visualState={hasRunExperiment ? result.visualState : 'no-change'}
              hasRun={hasRunExperiment}
            />

            {/* Before vs After Summary Comparison Box (when experiment ran) */}
            {hasRunExperiment && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm space-y-1">
                  <p className="font-bold text-slate-500">실험 전 모습</p>
                  <p className="text-slate-700 break-keep">
                    {BEFORE_STATE_LABELS[selectedExperiment].replace('실험 전: ', '')}
                  </p>
                </div>
                <div className="bg-emerald-100/70 border border-emerald-300 rounded-xl p-3.5 text-xs sm:text-sm space-y-1">
                  <p className="font-bold text-emerald-800">실험 후 변화</p>
                  <p className="font-bold text-emerald-950 break-keep">{result.outcomeTitle}</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {!hasRunExperiment ? (
                <button
                  type="button"
                  onClick={handleRunTest}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 text-white text-sm sm:text-base font-bold hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-2 focus-visible:outline-emerald-600"
                >
                  <Play className="w-4 h-4" aria-hidden="true" />
                  실험 결과 확인하기
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRunTest}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-700 text-white text-sm sm:text-base font-bold hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm focus-visible:outline-2 focus-visible:outline-emerald-600"
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    실험 다시 관찰하기
                  </button>
                  <button
                    type="button"
                    onClick={handleRevertTest}
                    className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50 text-amber-950 text-sm sm:text-base font-bold hover:bg-amber-100 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-700" aria-hidden="true" />
                    실행 전으로 되돌리기
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Textbook Reference Illustration */}
          {activeGas.labImage && (
            <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-100">
                <ResilientImage
                  src={activeGas.labImage}
                  alt={activeGas.labImageAlt ?? `${activeGas.name} 실험 그림`}
                  fallbackTitle={`${activeGas.name} 실험 자료`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 space-y-2 p-2">
                <p className="text-xs font-bold text-slate-500">
                  교과서 참고 그림 · {activeGas.name} ({activeGas.symbol})
                </p>
                {hasAnyTestedForGas ? (
                  <>
                    <p className="font-display text-lg font-bold text-slate-900 break-keep">
                      {activeGas.shortTagline}
                    </p>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-keep">
                      {activeGas.keyProperties[1] ?? activeGas.keyProperties[0]}
                    </p>
                  </>
                ) : (
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed break-keep">
                    먼저 위에서 실험 전 모습을 보고 어떤 변화가 생길지 예상한 뒤{' '}
                    <strong className="text-emerald-700">실험 결과 확인하기</strong> 버튼을 눌러 보세요!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Concept & Observation Deck (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
              <span className="font-semibold text-slate-700">
                {activeGas.name} ({activeGas.symbol}) · {currentExperimentMeta.shortLabel}
              </span>
              <span className={`font-bold ${hasRunExperiment ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hasRunExperiment ? '관찰 완료' : '예상 후 클릭하기'}
              </span>
            </div>

            {/* Result Card */}
            {hasRunExperiment ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-2.5">
                <p className="text-xs font-bold text-emerald-800">관찰한 실험 결과</p>
                <h2 className="font-display text-xl font-bold text-slate-900 break-keep">
                  {result.outcomeTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed break-keep">
                  {result.observation}
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 space-y-2.5">
                <p className="text-xs font-bold text-amber-800 inline-flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  결과를 먼저 예상해 볼까요?
                </p>
                <h2 className="font-display text-lg font-bold text-slate-900 break-keep">
                  {activeGas.name}에 {currentExperimentMeta.shortLabel}을 하면 어떻게 될까요?
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-keep">
                  실험 전 모습을 살펴본 뒤{' '}
                  <strong className="font-bold text-emerald-700">실험 결과 확인하기</strong> 버튼을 눌러 변화를 확인하세요!
                </p>
              </div>
            )}

            {/* Summary of Properties */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {activeGas.name}의 주요 성질 정리
              </h3>
              {hasAnyTestedForGas ? (
                <ul className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  {activeGas.keyProperties.map((prop, index) => (
                    <li
                      key={index}
                      className="text-sm sm:text-base text-slate-700 leading-relaxed flex gap-2.5 break-keep"
                    >
                      <span className="font-mono-num text-xs font-bold text-emerald-700 mt-1 shrink-0">
                        0{index + 1}
                      </span>
                      <span>{prop}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-sm text-slate-500 leading-relaxed break-keep">
                  {activeGas.name} 실험 결과를 1가지 이상 직접 확인하면 성질 정리가 열립니다.
                </div>
              )}
            </div>

            {/* Everyday Use Connection */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                이 성질 덕분에 어디에 쓰일까요?
              </h3>
              {hasAnyTestedForGas ? (
                <div className="space-y-3">
                  {activeGas.everydayUses.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-sm space-y-1.5"
                    >
                      <p className="font-bold text-slate-900 break-keep">
                        {item.objectName}{' '}
                        <span className="font-normal text-slate-500">({item.place})</span>
                      </p>
                      <p className="text-slate-700 leading-relaxed break-keep">{item.whyReason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-sm text-slate-500 leading-relaxed break-keep">
                  실험을 실행하면 {activeGas.name}의 이용 사례와 까닭을 확인할 수 있어요.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 space-y-2">
            {isLabCompleteForGas ? (
              <button
                type="button"
                onClick={() => onGoToNotebook(activeGas.id)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-emerald-700 text-white font-display font-bold text-base sm:text-lg hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                <span>{activeGas.name} 실험관찰 정리하러 가기</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            ) : (
              <div className="text-center py-3.5 px-5 rounded-2xl bg-slate-100 text-sm font-semibold text-slate-600 break-keep">
                {activeGas.name} 실험을 <strong className="text-slate-900">2가지 이상</strong> 눌러 확인해 보세요! ({testedForGas.length}/2 완료)
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperimentVisual({
  gasName,
  gasSymbol,
  experimentId,
  visualState,
  hasRun,
}: {
  gasName: string;
  gasSymbol: string;
  experimentId: ExperimentId;
  visualState: ExperimentResult['visualState'];
  hasRun: boolean;
}) {
  if (experimentId === 'flame') {
    const isBright = hasRun && visualState === 'bright-burn';
    const isExtinguish = hasRun && visualState === 'extinguish';
    const isPop = hasRun && visualState === 'pop-burn';

    return (
      <div className="flex flex-col items-center w-full">
        <svg
          viewBox="0 0 340 200"
          className="w-full max-w-[340px] h-48"
          role="img"
          aria-label={`${gasName} 향불 실험 모형`}
        >
          {/* Lab table */}
          <rect x="20" y="172" width="300" height="10" rx="5" fill="#CBD5E1" />

          {/* Gas jar */}
          <rect
            x="105"
            y="62"
            width="130"
            height="110"
            rx="16"
            fill={isBright ? '#FEF9C3' : isPop ? '#FFEDD5' : '#E0F2FE'}
            fillOpacity={hasRun ? 0.65 : 0.45}
            stroke="#475569"
            strokeWidth="3"
          />

          {/* Lid: closed before experiment, open/removed after */}
          {!hasRun ? (
            <rect x="98" y="50" width="144" height="12" rx="5" fill="#64748B" />
          ) : (
            <rect x="248" y="158" width="56" height="12" rx="4" fill="#94A3B8" />
          )}

          {/* Jar label */}
          <text
            x="170"
            y="160"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#1E293B"
          >
            {gasName} ({gasSymbol})
          </text>

          {/* Before: incense stick waiting OUTSIDE above jar */}
          {!hasRun && (
            <>
              <line x1="170" y1="6" x2="170" y2="38" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="170" cy="40" rx="5" ry="7" fill="#F97316" />
              <text x="234" y="28" fontSize="11" fontWeight="700" fill="#B45309">
                뚜껑 닫힘
              </text>
            </>
          )}

          {/* After: incense stick lowered INSIDE the jar */}
          {hasRun && (
            <line x1="170" y1="16" x2="170" y2="112" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          )}

          {isBright && (
            <>
              <ellipse cx="170" cy="96" rx="34" ry="42" fill="#FDE047" opacity="0.55" />
              <path
                d="M170 52 C192 80 194 114 170 124 C146 114 148 80 170 52 Z"
                fill="#F97316"
              />
              <path
                d="M170 70 C182 88 182 108 170 116 C158 108 158 88 170 70 Z"
                fill="#FEF08A"
              />
              <text x="170" y="34" textAnchor="middle" fontSize="12" fontWeight="800" fill="#C2410C">
                확! 밝게 타오름
              </text>
            </>
          )}

          {isPop && (
            <>
              <circle cx="170" cy="105" r="32" fill="#FB923C" opacity="0.4" />
              <path
                d="M170 74 L179 94 L200 91 L184 108 L196 126 L174 118 L158 131 L160 111 L140 102 L161 95 Z"
                fill="#EA580C"
              />
              <circle cx="128" cy="128" r="4.5" fill="#0284C7" />
              <circle cx="212" cy="130" r="4.5" fill="#0284C7" />
              <circle cx="136" cy="142" r="3.5" fill="#0284C7" />
              <text x="170" y="34" textAnchor="middle" fontSize="12" fontWeight="800" fill="#C2410C">
                &quot;퍽!&quot; + 물방울 생성
              </text>
            </>
          )}

          {isExtinguish && (
            <>
              <circle cx="170" cy="113" r="4" fill="#334155" />
              <path
                d="M170 105 Q156 88 172 74 Q186 62 168 48"
                fill="none"
                stroke="#64748B"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M178 100 Q190 86 176 74"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text x="170" y="34" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
                불꽃 꺼짐 (연기만 남)
              </text>
            </>
          )}

          {hasRun && !isBright && !isPop && !isExtinguish && (
            <>
              <ellipse cx="170" cy="112" rx="6" ry="9" fill="#FB923C" opacity="0.7" />
              <text x="170" y="34" textAnchor="middle" fontSize="12" fontWeight="800" fill="#047857">
                불이 붙지 않아 안전함
              </text>
            </>
          )}
        </svg>
        <span className="mt-1.5 text-xs sm:text-sm font-bold text-slate-700">
          {!hasRun
            ? BEFORE_STATE_LABELS.flame
            : isBright
            ? '실험 후: 불꽃이 훨씬 크고 환하게 타오름'
            : isPop
            ? '실험 후: "퍽" 소리를 내며 타고 병 안에 물방울이 생김'
            : isExtinguish
            ? '실험 후: 불꽃이 곧바로 꺼지고 연기만 피어오름'
            : '실험 후: 기체에 불이 붙거나 폭발하지 않음'}
        </span>
      </div>
    );
  }

  if (experimentId === 'limewater') {
    const isCloudy = hasRun && visualState === 'cloudy';
    return (
      <div className="flex flex-col items-center w-full">
        <svg
          viewBox="0 0 340 200"
          className="w-full max-w-[340px] h-48"
          role="img"
          aria-label={`${gasName} 석회수 실험 모형`}
        >
          <rect x="20" y="172" width="300" height="10" rx="5" fill="#CBD5E1" />
          <path
            d="M110 56 L110 164 Q110 172 118 172 L222 172 Q230 172 230 164 L230 56"
            fill="none"
            stroke="#475569"
            strokeWidth="3.5"
          />
          <rect
            x="113"
            y="96"
            width="114"
            height="73"
            rx="8"
            fill={isCloudy ? '#F1F5F9' : '#BAE6FD'}
            fillOpacity={isCloudy ? 0.98 : 0.55}
            stroke={isCloudy ? '#94A3B8' : 'none'}
            strokeWidth={isCloudy ? '1.5' : '0'}
          />

          {/* Gas delivery tube: above beaker before, inside liquid bubbling after */}
          <path
            d={hasRun ? 'M55 24 L156 24 L156 146' : 'M55 24 L156 24 L156 44'}
            fill="none"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {hasRun && (
            <>
              <circle cx="156" cy="132" r="5" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
              <circle cx="168" cy="118" r="6" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
              <circle cx="144" cy="112" r="4.5" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
            </>
          )}

          {isCloudy && (
            <>
              <circle cx="136" cy="148" r="12" fill="#FFFFFF" opacity="0.9" />
              <circle cx="184" cy="146" r="14" fill="#FFFFFF" opacity="0.9" />
              <circle cx="196" cy="126" r="10" fill="#FFFFFF" opacity="0.85" />
              <text x="170" y="84" textAnchor="middle" fontSize="13" fontWeight="800" fill="#334155">
                우유처럼 뿌옇게 변함!
              </text>
            </>
          )}

          {!isCloudy && (
            <text x="170" y="84" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#0369A1">
              {hasRun ? '여전히 맑고 투명함' : '맑은 석회수'}
            </text>
          )}
        </svg>
        <span className="mt-1.5 text-xs sm:text-sm font-bold text-slate-700">
          {!hasRun
            ? BEFORE_STATE_LABELS.limewater
            : isCloudy
            ? '실험 후: 기체가 들어가자 석회수가 우유처럼 뿌옇게 흐려짐!'
            : '실험 후: 기체를 섞어도 석회수가 맑고 투명하게 유지됨'}
        </span>
      </div>
    );
  }

  if (experimentId === 'weight') {
    const isUp = hasRun && visualState === 'float-up';
    const isDown = hasRun && visualState === 'sink-down';
    const targetBalloonY = !hasRun ? 108 : isUp ? 42 : isDown ? 136 : 94;
    const airBalloonY = !hasRun ? 108 : 94;

    return (
      <div className="flex flex-col items-center w-full">
        <svg
          viewBox="0 0 340 200"
          className="w-full max-w-[340px] h-48"
          role="img"
          aria-label={`${gasName} 무게 비교 풍선 모형`}
        >
          <rect x="20" y="172" width="300" height="10" rx="5" fill="#CBD5E1" />
          <line
            x1="36"
            y1="94"
            x2="304"
            y2="94"
            stroke="#94A3B8"
            strokeDasharray="5 5"
            strokeWidth="1.5"
          />
          <text x="40" y="88" fontSize="10.5" fontWeight="600" fill="#64748B">
            공기 기준 높이
          </text>

          {/* Left: Reference Air Balloon */}
          <g transform={`translate(115, ${airBalloonY})`} style={{ transition: 'transform 220ms ease' }}>
            <ellipse cx="0" cy="0" rx="24" ry="28" fill="#94A3B8" />
            <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
              공기
            </text>
            <line x1="0" y1="28" x2="0" y2="54" stroke="#64748B" strokeWidth="1.5" />
          </g>

          {/* Right: Target Gas Balloon */}
          <g transform={`translate(225, ${targetBalloonY})`} style={{ transition: 'transform 220ms ease' }}>
            <ellipse cx="0" cy="0" rx="28" ry="32" fill="#059669" />
            <ellipse cx="-8" cy="-10" rx="6" ry="9" fill="#A7F3D0" opacity="0.65" />
            <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FFFFFF">
              {gasSymbol}
            </text>
            <line x1="0" y1="32" x2="0" y2="54" stroke="#64748B" strokeWidth="1.5" />
          </g>

          {/* Upward / Downward comparison arrows */}
          {isUp && (
            <text x="274" y="46" fontSize="14" fontWeight="800" fill="#059669">
              ↑ 붕 뜸!
            </text>
          )}
          {isDown && (
            <text x="266" y="144" fontSize="13" fontWeight="800" fill="#D97706">
              ↓ 가라앉음
            </text>
          )}
          {hasRun && !isUp && !isDown && (
            <text x="264" y="98" fontSize="12" fontWeight="700" fill="#475569">
              ≈ 비슷함
            </text>
          )}
        </svg>
        <span className="mt-1.5 text-xs sm:text-sm font-bold text-slate-700">
          {!hasRun
            ? BEFORE_STATE_LABELS.weight
            : isUp
            ? '실험 후: 공기 풍선보다 훨씬 가벼워 하늘 위로 둥실 떠오름!'
            : isDown
            ? '실험 후: 공기 풍선보다 무거워 바닥으로 가라앉음!'
            : '실험 후: 공기 풍선과 비슷한 높이에 머무름'}
        </span>
      </div>
    );
  }

  const isGlow = hasRun && visualState === 'glow-orange';
  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox="0 0 340 200"
        className="w-full max-w-[340px] h-48"
        role="img"
        aria-label={`${gasName} 전기 및 특징 관찰 모형`}
      >
        <rect x="20" y="172" width="300" height="10" rx="5" fill="#CBD5E1" />

        {/* Radiant light rays when Neon glows */}
        {isGlow && (
          <ellipse cx="170" cy="88" rx="115" ry="44" fill="#FB923C" opacity="0.28" />
        )}

        {/* Discharge glass tube */}
        <rect
          x="70"
          y="68"
          width="200"
          height="40"
          rx="20"
          fill={isGlow ? '#F97316' : '#E2E8F0'}
          fillOpacity={isGlow ? 0.95 : 0.45}
          stroke={isGlow ? '#C2410C' : '#64748B'}
          strokeWidth="3.5"
        />
        <rect x="56" y="76" width="14" height="24" rx="3" fill="#334155" />
        <rect x="270" y="76" width="14" height="24" rx="3" fill="#334155" />

        {/* Wires & Power Switch (OFF vs ON) */}
        <path d="M63 100 L63 144 L132 144" fill="none" stroke="#475569" strokeWidth="3" />
        <path d="M277 100 L277 144 L208 144" fill="none" stroke="#475569" strokeWidth="3" />
        <rect x="132" y="132" width="76" height="24" rx="6" fill={hasRun ? '#10B981' : '#94A3B8'} />
        <text x="170" y="148" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#FFFFFF">
          {hasRun ? '전원 ON' : '전원 OFF'}
        </text>

        <text
          x="170"
          y="93"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={isGlow ? '#FFFFFF' : '#334155'}
        >
          {gasName} ({gasSymbol})
        </text>
      </svg>
      <span className="mt-1.5 text-xs sm:text-sm font-bold text-slate-700">
        {!hasRun
          ? BEFORE_STATE_LABELS.electric
          : isGlow
          ? '실험 후: 전원을 켜자 유리관 전체가 밝은 주황빛으로 빛남!'
          : '실험 후: 전원을 켜도 색깔 없이 투명한 상태를 유지함'}
      </span>
    </div>
  );
}
