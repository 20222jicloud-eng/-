import {
  BookOpen,
  Check,
  CheckSquare,
  FileSpreadsheet,
  Lock,
  NotebookPen,
  PencilLine,
  Sparkles,
  Square,
  Star,
} from 'lucide-react';
import { ExperimentId, GASES_DATA, GasId } from '../data/gasesData';
import { GasCardStudio } from './GasCardStudio';

export const SELF_EVAL_ITEMS = [
  {
    id: 'eval-1',
    text: '탐험 지도에서 6가지 기체의 성질과 이용 사례를 모두 읽어 보았어요.',
  },
  {
    id: 'eval-2',
    text: '성질 실험실에서 먼저 예상해 본 뒤 직접 실험 결과를 확인했어요.',
  },
  {
    id: 'eval-3',
    text: '내가 고른 기체가 어디에 왜 쓰이는지 친구에게 설명할 수 있어요.',
  },
  {
    id: 'eval-4',
    text: '아래 정리표를 보고 종이 실험관찰 42쪽에 바르게 옮겨 적을 준비가 되었어요.',
  },
] as const;

interface ObservationNotebookProps {
  selectedGasId: GasId;
  onSelectGasId: (gasId: GasId) => void;
  studentName: string;
  onChangeStudentName: (name: string) => void;
  checkedEvalIds: string[];
  onToggleEvalItem: (evalId: string) => void;
  onOpenSummaryModal: () => void;
  completedMapGasIds: GasId[];
  testedExperimentsByGas: Record<GasId, ExperimentId[]>;
  isDetectiveMaster?: boolean;
  onGoToMap: () => void;
  onGoToLab: (gasId: GasId) => void;
}

export function ObservationNotebook({
  selectedGasId,
  onSelectGasId,
  studentName,
  onChangeStudentName,
  checkedEvalIds,
  onToggleEvalItem,
  onOpenSummaryModal,
  completedMapGasIds,
  testedExperimentsByGas,
  isDetectiveMaster = false,
  onGoToMap,
  onGoToLab,
}: ObservationNotebookProps) {
  const activeGas = GASES_DATA.find((g) => g.id === selectedGasId) ?? GASES_DATA[0];

  const isMapDone = completedMapGasIds.includes(activeGas.id);
  const labDoneCount = (testedExperimentsByGas[activeGas.id] ?? []).length;
  const isChecklistDone = checkedEvalIds.length >= SELF_EVAL_ITEMS.length;
  const progressPercent = Math.round((checkedEvalIds.length / SELF_EVAL_ITEMS.length) * 100);

  return (
    <section aria-labelledby="notebook-heading" className="space-y-8">
      {/* Page 4 Hero Banner: Soft Pastel Rose Theme */}
      <div className="bg-rose-100 border-2 border-rose-200 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-rose-200 text-rose-500 flex items-center justify-center shrink-0 shadow-xs">
              <NotebookPen className="w-8 h-8 sm:w-9 sm:h-9" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-bold tracking-wide text-rose-700 break-keep">
                4단계 · 실험관찰 정리 및 나만의 기체 카드
              </p>
              <h1
                id="notebook-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug break-keep"
              >
                자기평가를 마치고 실험관찰 42쪽에 기록해 보세요!
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-keep">
                ① 체크리스트를 먼저 완료한 뒤, ② 카드를 만들 기체를 고르고 탐험가 이름을 적어 보세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSummaryModal}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-sm self-start md:self-center focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" aria-hidden="true" />
            실험관찰 표 크게 보기
          </button>
        </div>
      </div>

      {/* STEP 1 (Prominent & Eye-Catching First Step!): Self-Evaluation Checklist */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border-2 transition-colors space-y-6 ${
          isChecklistDone
            ? 'bg-emerald-50/70 border-emerald-400'
            : 'bg-amber-50/70 border-amber-400 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-display font-bold text-xl ${
                isChecklistDone
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              1
            </div>
            <div>
              <p className="text-xs font-bold text-amber-800">가장 먼저 확인해요!</p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 break-keep">
                스스로 잘했다! 자기평가 체크리스트
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="w-32 h-3 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-200 ${
                  isChecklistDone ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span
              className={`font-mono-num text-sm font-bold px-3.5 py-1.5 rounded-xl border ${
                isChecklistDone
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-900 border-amber-300'
              }`}
            >
              {checkedEvalIds.length} / {SELF_EVAL_ITEMS.length} 완료
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SELF_EVAL_ITEMS.map((item, idx) => {
            const checked = checkedEvalIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleEvalItem(item.id)}
                aria-pressed={checked}
                className={`p-5 rounded-2xl border-2 text-left flex items-start gap-3.5 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-600 ${
                  checked
                    ? 'bg-white border-emerald-500 text-slate-900 shadow-xs'
                    : 'bg-white/90 border-amber-200 text-slate-800 hover:border-amber-400 hover:bg-white'
                }`}
              >
                {checked ? (
                  <CheckSquare
                    className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <Square
                    className="w-6 h-6 text-amber-500 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <div className="space-y-1">
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-1 ${
                      checked ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        checked ? 'fill-emerald-500 text-emerald-500' : 'text-amber-400'
                      }`}
                      aria-hidden="true"
                    />
                    확인 {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed break-keep">
                    {item.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isChecklistDone && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
            <span>자기평가 4가지 모두 완료! 이제 아래 ②번에서 기체를 고르고 이름을 써 보세요!</span>
          </div>
        )}
      </div>

      {/* Main Split: Left Step 2 (Gas & Name) + Workbook p.42 Guide / Right Card Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 2: Pick a Gas for the Card & Enter Explorer Name */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 font-display font-bold text-lg">
                2
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 break-keep">
                  카드를 만들 기체 선택 &amp; 탐험가 이름 쓰기
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 break-keep">
                  공부 완료 표시(✓)가 있는 기체를 고르고 이름을 적으면 오른쪽 카드에 반영됩니다.
                </p>
              </div>
            </div>

            {/* Pick 1 Gas */}
            <div className="space-y-2.5">
              <p className="text-sm font-bold text-slate-900">1) 집중 탐구 &amp; 카드 만들 기체 고르기</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GASES_DATA.map((gas) => {
                  const isSelected = gas.id === selectedGasId;
                  const gasMapDone = completedMapGasIds.includes(gas.id);
                  const gasLabDone = (testedExperimentsByGas[gas.id] ?? []).length >= 2;
                  const readyForCard = gasMapDone && gasLabDone && isChecklistDone;

                  return (
                    <button
                      key={gas.id}
                      type="button"
                      onClick={() => onSelectGasId(gas.id)}
                      aria-pressed={isSelected}
                      className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-rose-500 ${
                        isSelected
                          ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-display font-bold text-base">{gas.name}</span>
                        {readyForCard ? (
                          <Check
                            className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock
                            className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-rose-200' : 'text-slate-400'}`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p
                        className={`mt-1 text-xs truncate ${
                          isSelected ? 'text-rose-100' : 'text-slate-500'
                        }`}
                      >
                        {readyForCard ? '카드 생성 가능' : '공부 진행 중'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explorer Name Input */}
            <div className="space-y-2 pt-2">
              <label htmlFor="student-name" className="block text-sm font-bold text-slate-900">
                2) 탐험가 이름 쓰기 (내 기체 카드에 들어가요!)
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => onChangeStudentName(e.target.value)}
                placeholder="예: 4학년 2반 김과학"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-600"
              />
            </div>
          </div>

          {/* STEP 3 (High-Visibility Textbook Guide): 실험관찰 42쪽에 기록해 봅시다. */}
          <div className="bg-sky-50 border-2 border-sky-400 rounded-3xl p-6 sm:p-8 space-y-5 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-200">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-800 inline-flex items-center gap-1">
                    <PencilLine className="w-3.5 h-3.5" aria-hidden="true" />
                    3단계 · 종이 책 옮겨 적기 미션
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 leading-snug break-keep mt-0.5">
                    <span className="bg-amber-200 px-1.5 py-0.5 rounded-md">실험관찰 42쪽</span>에 기록해 봅시다.
                  </h2>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-900 bg-white px-3.5 py-2 rounded-xl border border-sky-300 shadow-2xs shrink-0 self-start sm:self-center">
                연필로 옮겨 적어요!
              </span>
            </div>

            <div className="bg-white border-2 border-sky-200 rounded-2xl p-6 sm:p-7 space-y-5 text-sm sm:text-base shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 font-bold text-xs sm:w-36 shrink-0">
                  ① 조사한 기체
                </span>
                <span className="font-display font-bold text-slate-900 text-xl">
                  {activeGas.name}{' '}
                  <span className="font-mono-num text-sky-700">({activeGas.symbol})</span>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2.5 pb-4 border-b border-slate-100">
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs sm:w-36 shrink-0">
                  ② 기체의 성질
                </span>
                <p className="text-slate-900 font-medium leading-relaxed break-keep">
                  {activeGas.workbookModelProperties}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start gap-2.5">
                <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-bold text-xs sm:w-36 shrink-0">
                  ③ 이용되는 곳과 까닭
                </span>
                <p className="text-slate-900 font-medium leading-relaxed break-keep">
                  {activeGas.workbookModelUses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Collectible Gas Card Studio */}
        <div className="lg:col-span-5">
          <GasCardStudio
            gas={activeGas}
            studentName={studentName}
            isMapDone={isMapDone}
            labDoneCount={labDoneCount}
            isChecklistDone={isChecklistDone}
            isDetectiveMaster={isDetectiveMaster}
            onGoToMap={onGoToMap}
            onGoToLab={() => onGoToLab(activeGas.id)}
          />
        </div>
      </div>
    </section>
  );
}
