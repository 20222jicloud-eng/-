import { useState } from 'react';
import { Check, Copy, Printer, X } from 'lucide-react';
import { GASES_DATA, GasId } from '../data/gasesData';

interface SummaryTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  selectedGasId: GasId;
}

export function SummaryTableModal({
  isOpen,
  onClose,
  studentName,
  selectedGasId,
}: SummaryTableModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const focusGas = GASES_DATA.find((g) => g.id === selectedGasId) ?? GASES_DATA[0];

  const handleCopyText = async () => {
    const headerLine = studentName.trim()
      ? `[${studentName.trim()}의 실험관찰 42쪽 정리표 - 대표 기체: ${focusGas.name}]`
      : `[실험관찰 42쪽 정리표 - 대표 기체: ${focusGas.name}]`;

    const focusBlock = `★ 내가 선택한 대표 기체: ${focusGas.name} (${focusGas.symbol})\n- 성질: ${focusGas.workbookModelProperties}\n- 이용되는 곳과 까닭: ${focusGas.workbookModelUses}`;

    const rows = GASES_DATA.map(
      (gas) =>
        `■ ${gas.name} (${gas.symbol})\n- 성질: ${gas.workbookModelProperties}\n- 이용되는 곳과 까닭: ${gas.workbookModelUses}`
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(`${headerLine}\n\n${focusBlock}\n\n[전체 기체 비교표]\n${rows}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden print-only-area">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <h2
              id="summary-modal-title"
              className="font-display text-xl font-bold text-slate-900"
            >
              실험관찰 42쪽 정리표 한눈에 보기
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {studentName.trim()
                ? `${studentName.trim()} 학생 · 대표 탐구 기체: ${focusGas.name}`
                : `대표 탐구 기체: ${focusGas.name} · 실험관찰 42쪽에 옮겨 적어 보세요`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  복사 완료
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  내용 복사
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              인쇄하기
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="창 닫기"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="hidden print:block pb-3 border-b border-slate-300">
            <h1 className="text-xl font-bold text-slate-900">
              초등학교 4학년 과학 · 일상생활에서 이용되는 기체 조사 보고서 (실험관찰 42쪽)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              이름: {studentName.trim() || '____________________'}
            </p>
          </div>

          {/* Focused 1-Gas Report Box */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-sky-950">
              내가 선택한 대표 탐구 기체: {focusGas.name} ({focusGas.symbol})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="bg-white border border-sky-200 rounded-xl p-5 space-y-1.5">
                <p className="text-xs font-bold text-slate-500">기체의 성질</p>
                <p className="text-slate-800 leading-relaxed">
                  {focusGas.workbookModelProperties}
                </p>
              </div>
              <div className="bg-white border border-sky-200 rounded-xl p-5 space-y-1.5">
                <p className="text-xs font-bold text-slate-500">일상생활에서 이용되는 곳과 까닭</p>
                <p className="text-slate-800 leading-relaxed">
                  {focusGas.workbookModelUses}
                </p>
              </div>
            </div>
          </div>

          {/* Full 6-Gas Reference Table */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-slate-800">
              우리 주변 6가지 대표 기체 전체 비교표
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                    <th className="py-3.5 px-5 font-bold w-28 whitespace-nowrap">기체 이름</th>
                    <th className="py-3.5 px-5 font-bold w-5/12">기체의 주요 성질</th>
                    <th className="py-3.5 px-5 font-bold">일상생활에서 이용되는 곳과 까닭</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {GASES_DATA.map((gas) => {
                    const isFocus = gas.id === selectedGasId;

                    return (
                      <tr
                        key={gas.id}
                        className={`align-top ${isFocus ? 'bg-sky-50/40' : 'hover:bg-slate-50/50'}`}
                      >
                        <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                          {gas.name}
                          <span className="block font-mono-num text-xs font-medium text-sky-700 mt-0.5">
                            {gas.symbol}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-700 leading-relaxed">
                          {gas.workbookModelProperties}
                        </td>
                        <td className="py-4 px-5 text-slate-700 leading-relaxed">
                          {gas.workbookModelUses}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
