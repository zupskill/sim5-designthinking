import React from "react";
import { Check, Compass, Eye, ShieldAlert, Zap, PenTool, Award, Play } from "lucide-react";

interface ProgressTrackerProps {
  currentStage: number; // 1 to 6
  setStage: (stage: number) => void;
  maxReachedStage: number;
}

export default function ProgressTracker({ currentStage, setStage, maxReachedStage }: ProgressTrackerProps) {
  const stages = [
    { num: 1, name: "Topic", icon: Compass },
    { num: 2, name: "Empathize", icon: Eye },
    { num: 3, name: "Define", icon: ShieldAlert },
    { num: 4, name: "Ideate", icon: Zap },
    { num: 5, name: "Prototype", icon: PenTool },
    { num: 6, name: "Test", icon: Award },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-3 px-4 sticky top-0 z-40 shadow-lg shadow-cyan-950/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-1">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = currentStage === stage.num;
          const isCompleted = stage.num < currentStage;
          const isPlayable = stage.num <= maxReachedStage;

          return (
            <React.Fragment key={stage.num}>
              {/* Stage Element */}
              <button
                disabled={!isPlayable}
                onClick={() => setStage(stage.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 relative shrink-0 ${
                  isCurrent
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] font-medium scale-105"
                    : isCompleted
                    ? "bg-slate-800/80 text-cyan-400 font-medium cursor-pointer hover:bg-slate-800 border border-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                    : isPlayable
                    ? "bg-slate-850 text-slate-300 cursor-pointer hover:bg-slate-800 border border-slate-700"
                    : "text-slate-600 cursor-not-allowed opacity-40 bg-transparent"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isCurrent
                      ? "bg-white text-cyan-600 font-bold"
                      : isCompleted
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stage.num}
                </span>

                <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? "animate-pulse" : ""}`} />
                <span className="text-xs tracking-wider uppercase font-semibold hidden md:inline">
                  {stage.name}
                </span>
              </button>

              {/* Connector */}
              {idx < stages.length - 1 && (
                <div
                  className={`h-0.5 min-w-[12px] flex-1 mx-2 transition-all duration-500 rounded-full ${
                    stage.num < currentStage
                      ? "bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]"
                      : "bg-slate-800"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
