import { useEffect, useState } from 'react';
import {
  Compass,
  FileSpreadsheet,
  FlaskConical,
  NotebookPen,
  SearchCheck,
  Wind,
} from 'lucide-react';
import { DetectiveQuiz } from './components/DetectiveQuiz';
import { ObservationNotebook } from './components/ObservationNotebook';
import { PropertyLab } from './components/PropertyLab';
import { SummaryTableModal } from './components/SummaryTableModal';
import { TownExplorer } from './components/TownExplorer';
import {
  ExperimentId,
  GASES_DATA,
  GasId,
  QUIZ_MISSIONS,
  TOWN_HOTSPOTS,
} from './data/gasesData';

type ActiveSection = 'explore' | 'lab' | 'quiz' | 'notebook';

const STORAGE_KEY = 'gas-explorer-grade4-v4';

const EMPTY_TESTED_EXPERIMENTS: Record<GasId, ExperimentId[]> = {
  oxygen: [],
  co2: [],
  nitrogen: [],
  helium: [],
  hydrogen: [],
  neon: [],
};

interface SavedState {
  discoveredGasIds: GasId[];
  solvedSpotIds: string[];
  completedMapSpotIds: string[];
  completedMapGasIds: GasId[];
  surpriseQuizResults: Record<string, boolean>;
  hasCheckedSurpriseScore: boolean;
  testedExperimentsByGas: Record<GasId, ExperimentId[]>;
  solvedMissionIds: string[];
  notebookGasId: GasId;
  studentName: string;
  checkedEvalIds: string[];
}

function loadSavedState(): SavedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        discoveredGasIds: [],
        solvedSpotIds: [],
        completedMapSpotIds: [],
        completedMapGasIds: [],
        surpriseQuizResults: {},
        hasCheckedSurpriseScore: false,
        testedExperimentsByGas: EMPTY_TESTED_EXPERIMENTS,
        solvedMissionIds: [],
        notebookGasId: 'oxygen',
        studentName: '',
        checkedEvalIds: [],
      };
    }
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      discoveredGasIds: Array.isArray(parsed.discoveredGasIds) ? parsed.discoveredGasIds : [],
      solvedSpotIds: Array.isArray(parsed.solvedSpotIds) ? parsed.solvedSpotIds : [],
      completedMapSpotIds: Array.isArray(parsed.completedMapSpotIds)
        ? parsed.completedMapSpotIds
        : [],
      completedMapGasIds: Array.isArray(parsed.completedMapGasIds)
        ? parsed.completedMapGasIds
        : [],
      surpriseQuizResults:
        parsed.surpriseQuizResults && typeof parsed.surpriseQuizResults === 'object'
          ? parsed.surpriseQuizResults
          : {},
      hasCheckedSurpriseScore: Boolean(parsed.hasCheckedSurpriseScore),
      testedExperimentsByGas: {
        ...EMPTY_TESTED_EXPERIMENTS,
        ...(parsed.testedExperimentsByGas ?? {}),
      },
      solvedMissionIds: Array.isArray(parsed.solvedMissionIds) ? parsed.solvedMissionIds : [],
      notebookGasId: parsed.notebookGasId ?? 'oxygen',
      studentName: typeof parsed.studentName === 'string' ? parsed.studentName : '',
      checkedEvalIds: Array.isArray(parsed.checkedEvalIds) ? parsed.checkedEvalIds : [],
    };
  } catch {
    return {
      discoveredGasIds: [],
      solvedSpotIds: [],
      completedMapSpotIds: [],
      completedMapGasIds: [],
      surpriseQuizResults: {},
      hasCheckedSurpriseScore: false,
      testedExperimentsByGas: EMPTY_TESTED_EXPERIMENTS,
      solvedMissionIds: [],
      notebookGasId: 'oxygen',
      studentName: '',
      checkedEvalIds: [],
    };
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('explore');
  const [labGasId, setLabGasId] = useState<GasId>('oxygen');
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const [savedState, setSavedState] = useState<SavedState>(() => loadSavedState());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [savedState]);

  const handleSolveSpot = (spotId: string, gasId: GasId) => {
    setSavedState((prev) => {
      const nextSpots = prev.solvedSpotIds.includes(spotId)
        ? prev.solvedSpotIds
        : [...prev.solvedSpotIds, spotId];
      const nextGases = prev.discoveredGasIds.includes(gasId)
        ? prev.discoveredGasIds
        : [...prev.discoveredGasIds, gasId];
      return {
        ...prev,
        solvedSpotIds: nextSpots,
        discoveredGasIds: nextGases,
      };
    });
  };

  const handleCompleteSpotStudy = (spotId: string, gasId: GasId) => {
    setSavedState((prev) => {
      const nextCompletedSpots = prev.completedMapSpotIds.includes(spotId)
        ? prev.completedMapSpotIds
        : [...prev.completedMapSpotIds, spotId];
      const nextCompletedGases = prev.completedMapGasIds.includes(gasId)
        ? prev.completedMapGasIds
        : [...prev.completedMapGasIds, gasId];
      return {
        ...prev,
        completedMapSpotIds: nextCompletedSpots,
        completedMapGasIds: nextCompletedGases,
      };
    });
  };

  const handleResetSpot = (spotId: string, gasId: GasId) => {
    setSavedState((prev) => {
      const nextSolvedSpots = prev.solvedSpotIds.filter((id) => id !== spotId);
      const nextCompletedSpots = prev.completedMapSpotIds.filter((id) => id !== spotId);
      const nextCompletedGases = prev.completedMapGasIds.filter((id) => id !== gasId);

      const nextQuizResults = { ...prev.surpriseQuizResults };
      delete nextQuizResults[`${spotId}:1`];
      delete nextQuizResults[`${spotId}:2`];
      delete nextQuizResults[`${spotId}:3`];

      const stillDiscoveredBySpot = TOWN_HOTSPOTS.some(
        (spot) => spot.gasId === gasId && nextSolvedSpots.includes(spot.id)
      );
      const stillDiscoveredByMission = QUIZ_MISSIONS.some(
        (m) => m.correctGasId === gasId && prev.solvedMissionIds.includes(m.id)
      );
      const nextDiscoveredGases =
        stillDiscoveredBySpot || stillDiscoveredByMission
          ? prev.discoveredGasIds
          : prev.discoveredGasIds.filter((id) => id !== gasId);

      return {
        ...prev,
        solvedSpotIds: nextSolvedSpots,
        completedMapSpotIds: nextCompletedSpots,
        completedMapGasIds: nextCompletedGases,
        surpriseQuizResults: nextQuizResults,
        hasCheckedSurpriseScore: false,
        discoveredGasIds: nextDiscoveredGases,
      };
    });
  };

  const handleUncompleteSpotStudy = (spotId: string, gasId: GasId, revertedStepNum?: number) => {
    setSavedState((prev) => {
      const nextQuizResults = { ...prev.surpriseQuizResults };
      if (revertedStepNum !== undefined) {
        delete nextQuizResults[`${spotId}:${revertedStepNum}`];
      }
      return {
        ...prev,
        completedMapSpotIds: prev.completedMapSpotIds.filter((id) => id !== spotId),
        completedMapGasIds: prev.completedMapGasIds.filter((id) => id !== gasId),
        surpriseQuizResults: nextQuizResults,
        hasCheckedSurpriseScore: false,
      };
    });
  };

  const handleRecordSurpriseQuizAttempt = (key: string, isCorrect: boolean) => {
    setSavedState((prev) => {
      // Preserve first-attempt status if already recorded (wrong on 1st try stays false)
      if (prev.surpriseQuizResults[key] !== undefined) {
        return prev;
      }
      return {
        ...prev,
        surpriseQuizResults: {
          ...prev.surpriseQuizResults,
          [key]: isCorrect,
        },
      };
    });
  };

  const handleCheckSurpriseScore = () => {
    setSavedState((prev) => ({
      ...prev,
      hasCheckedSurpriseScore: true,
    }));
  };

  const handleRecordExperiment = (gasId: GasId, experimentId: ExperimentId) => {
    setSavedState((prev) => {
      const current = prev.testedExperimentsByGas[gasId] ?? [];
      if (current.includes(experimentId)) return prev;
      return {
        ...prev,
        testedExperimentsByGas: {
          ...prev.testedExperimentsByGas,
          [gasId]: [...current, experimentId],
        },
      };
    });
  };

  const handleRevertExperiment = (gasId: GasId, experimentId: ExperimentId) => {
    setSavedState((prev) => {
      const current = prev.testedExperimentsByGas[gasId] ?? [];
      if (!current.includes(experimentId)) return prev;
      return {
        ...prev,
        testedExperimentsByGas: {
          ...prev.testedExperimentsByGas,
          [gasId]: current.filter((id) => id !== experimentId),
        },
      };
    });
  };

  const handleToggleEvalItem = (evalId: string) => {
    setSavedState((prev) => {
      const exists = prev.checkedEvalIds.includes(evalId);
      return {
        ...prev,
        checkedEvalIds: exists
          ? prev.checkedEvalIds.filter((id) => id !== evalId)
          : [...prev.checkedEvalIds, evalId],
      };
    });
  };

  const handleSolveMission = (missionId: string, gasId: GasId) => {
    setSavedState((prev) => {
      const nextSolved = prev.solvedMissionIds.includes(missionId)
        ? prev.solvedMissionIds
        : [...prev.solvedMissionIds, missionId];
      const nextDiscovered = prev.discoveredGasIds.includes(gasId)
        ? prev.discoveredGasIds
        : [...prev.discoveredGasIds, gasId];
      return {
        ...prev,
        solvedMissionIds: nextSolved,
        discoveredGasIds: nextDiscovered,
      };
    });
  };

  const handleRevertMission = (missionId: string) => {
    setSavedState((prev) => ({
      ...prev,
      solvedMissionIds: prev.solvedMissionIds.filter((id) => id !== missionId),
    }));
  };

  const handleResetQuiz = () => {
    setSavedState((prev) => ({
      ...prev,
      solvedMissionIds: [],
    }));
  };

  const handleGoToLab = (gasId: GasId) => {
    setLabGasId(gasId);
    setActiveSection('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToNotebook = (gasId: GasId) => {
    setSavedState((prev) => ({ ...prev, notebookGasId: gasId }));
    setActiveSection('notebook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const focusGas = GASES_DATA.find((g) => g.id === savedState.notebookGasId) ?? GASES_DATA[0];

  const navItems: { id: ActiveSection; label: string; Icon: typeof Compass }[] = [
    { id: 'explore', label: '탐험 지도', Icon: Compass },
    { id: 'lab', label: '성질 실험실', Icon: FlaskConical },
    { id: 'quiz', label: '탐정 퀴즈', Icon: SearchCheck },
    { id: 'notebook', label: '실험관찰 노트', Icon: NotebookPen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title with Icon */}
          <button
            type="button"
            onClick={() => setActiveSection('explore')}
            className="inline-flex items-center gap-2.5 font-display font-bold text-xl tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600"
          >
            <span className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Wind className="w-5 h-5" aria-hidden="true" />
            </span>
            <span>기체 탐험대</span>
          </button>

          {/* Zone 2: 4 single-line nav links with icons */}
          <nav
            aria-label="학습 메뉴"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map(({ id, label, Icon }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-sky-600 ${
                    active
                      ? 'border-sky-600 text-sky-700 font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${active ? 'text-sky-600' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsSummaryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs sm:text-sm font-bold hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>실험관찰 표 보기</span>
            </button>
          </div>
        </div>

        {/* Mobile navigation row inside compact header */}
        <nav
          aria-label="모바일 학습 메뉴"
          className="md:hidden border-t border-slate-100 px-4 flex items-center justify-between gap-2 overflow-x-auto"
        >
          {navItems.map(({ id, label, Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`py-2.5 px-2 text-xs font-medium border-b-2 whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1 ${
                  active
                    ? 'border-sky-600 text-sky-700 font-bold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 no-print">
        {/* Clean Unboxed Learning Progress Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs sm:text-sm text-slate-600">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">
              초등학교 4학년 과학 · 일상생활에서 이용되는 기체를 찾아라!
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono-num">
            <span>
              장소 탐험 <strong className="text-slate-900">{savedState.completedMapSpotIds.length}/{TOWN_HOTSPOTS.length}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              퀴즈 <strong className="text-slate-900">{savedState.solvedMissionIds.length}/{QUIZ_MISSIONS.length}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              선택 기체 <strong className="text-sky-700">{focusGas.name}</strong>
            </span>
          </div>
        </div>

        {/* Active View */}
        {activeSection === 'explore' && (
          <TownExplorer
            solvedSpotIds={savedState.solvedSpotIds}
            completedMapSpotIds={savedState.completedMapSpotIds}
            completedMapGasIds={savedState.completedMapGasIds}
            surpriseQuizResults={savedState.surpriseQuizResults}
            hasCheckedSurpriseScore={savedState.hasCheckedSurpriseScore}
            onSolveSpot={handleSolveSpot}
            onCompleteSpotStudy={handleCompleteSpotStudy}
            onUncompleteSpotStudy={handleUncompleteSpotStudy}
            onRecordSurpriseQuizAttempt={handleRecordSurpriseQuizAttempt}
            onCheckSurpriseScore={handleCheckSurpriseScore}
            onResetSpot={handleResetSpot}
            onGoToLab={handleGoToLab}
          />
        )}

        {activeSection === 'lab' && (
          <PropertyLab
            selectedGasId={labGasId}
            onSelectGasId={setLabGasId}
            testedExperimentsByGas={savedState.testedExperimentsByGas}
            onRecordExperiment={handleRecordExperiment}
            onRevertExperiment={handleRevertExperiment}
            onGoToNotebook={handleGoToNotebook}
          />
        )}

        {activeSection === 'quiz' && (
          <DetectiveQuiz
            solvedMissionIds={savedState.solvedMissionIds}
            studentName={savedState.studentName}
            onChangeStudentName={(name) =>
              setSavedState((prev) => ({ ...prev, studentName: name }))
            }
            onSolveMission={handleSolveMission}
            onRevertMission={handleRevertMission}
            onResetQuiz={handleResetQuiz}
            onGoToNotebook={() => {
              setActiveSection('notebook');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeSection === 'notebook' && (
          <ObservationNotebook
            selectedGasId={savedState.notebookGasId}
            onSelectGasId={(gasId) =>
              setSavedState((prev) => ({ ...prev, notebookGasId: gasId }))
            }
            studentName={savedState.studentName}
            onChangeStudentName={(name) =>
              setSavedState((prev) => ({ ...prev, studentName: name }))
            }
            checkedEvalIds={savedState.checkedEvalIds}
            onToggleEvalItem={handleToggleEvalItem}
            onOpenSummaryModal={() => setIsSummaryOpen(true)}
            completedMapGasIds={savedState.completedMapGasIds}
            testedExperimentsByGas={savedState.testedExperimentsByGas}
            isDetectiveMaster={savedState.solvedMissionIds.length >= QUIZ_MISSIONS.length}
            onGoToMap={() => {
              setActiveSection('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToLab={handleGoToLab}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            초등학교 4학년 과학 · 여러 가지 기체 탐구 및 실험관찰 42쪽 조사학습 도우미
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveSection('explore')}
              className="hover:text-slate-900 cursor-pointer"
            >
              탐험 지도
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('lab')}
              className="hover:text-slate-900 cursor-pointer"
            >
              성질 실험실
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('notebook')}
              className="hover:text-slate-900 cursor-pointer"
            >
              실험관찰 노트
            </button>
          </div>
        </div>
      </footer>

      {/* Printable & Copyable Summary Table Modal */}
      <SummaryTableModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        studentName={savedState.studentName}
        selectedGasId={savedState.notebookGasId}
      />
    </div>
  );
}
