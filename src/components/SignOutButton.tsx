import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  onSignOut: () => void;
  className?: string;
}

export default function SignOutButton({ onSignOut, className = "" }: SignOutButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        title="Sign Out"
        className={`bg-slate-900/60 backdrop-blur hover:bg-slate-850 border border-slate-800 rounded-xl px-2 sm:px-3 py-1.5 flex items-center justify-center gap-2 transition-all hover:border-cyan-500/20 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)] group shrink-0 ${className}`}
      >
        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        <span className="hidden sm:inline text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors">Sign Out</span>
      </button>

      {showConfirm && createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden relative z-[9999]">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to sign out?
                <br /><br />
                Your progress and completed simulations have already been saved.
              </p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-sm font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    onSignOut();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-bold text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
