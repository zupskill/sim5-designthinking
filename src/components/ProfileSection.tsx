import React, { useState, useEffect } from "react";
import { UserProfile, Badge } from "../types";
import { BADGES } from "../data";
import { Award, Compass, Heart, Activity, Briefcase, ShieldCheck, Star } from "lucide-react";
import { X, User, Trophy, Flame } from "lucide-react";
import { saveSupabaseProfile } from "../supabase";

interface ProfileSectionProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onClose: () => void;
  onAddXP: (amount: number) => void;
}

const badgeIcons: Record<string, React.ComponentType<any>> = {
  Compass: Compass,
  Heart: Heart,
  Briefcase: Briefcase,
  Activity: Activity,
  ShieldCheck: ShieldCheck,
  Award: Award
};

export default function ProfileSection({
  profile,
  setProfile,
  onClose,
  onAddXP
}: ProfileSectionProps) {
  const [activeTab, setActiveTab] = useState<"details" | "achievements">("details");

  const XP_LEVEL_TARGETS: Record<string, number> = {
    "Explorer": 150,
    "Observer": 350,
    "Problem Finder": 600,
    "Innovator": 950,
    "Visionary": 1400,
    "System Thinker": 2500,
  };

  const currentLevelTarget = XP_LEVEL_TARGETS[profile.level] || 1000;
  const progressRatio = Math.min((profile.xp / currentLevelTarget) * 100, 100);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl relative p-8 border-slate-800 text-left bg-slate-950/95 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-450 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header Selector */}
        <div className="flex border-b border-slate-900 mb-6 gap-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "details"
                ? "border-cyan-405 text-white"
                : "border-transparent text-slate-500 hover:text-slate-350"
            }`}
          >
            <User className="w-4 h-4" />
            Your Profile
          </button>
          
          <button
            onClick={() => setActiveTab("achievements")}
            className={`pb-3 text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "achievements"
                ? "border-cyan-405 text-white"
                : "border-transparent text-slate-500 hover:text-slate-350"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Achievements & XP
          </button>
        </div>

        {/* TAB 1: DETAILS EDIT FORM */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="relative">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.username} className="w-24 h-24 rounded-full border-2 border-cyan-400/30 object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-cyan-400/10 text-cyan-400 flex items-center justify-center border-2 border-cyan-400/30">
                    <User className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 p-1.5 rounded-full shadow-lg">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">{profile.username}</h3>
                <p className="text-slate-400 mb-4">{profile.email}</p>
                <div className="inline-block bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase border border-cyan-500/20">
                  {profile.level}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{profile.xp}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Total XP</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">{profile.completedSimulations || 0}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Simulations</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">{profile.problemsSolved}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Problems</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">{profile.unlockedBadgeIds.length}</div>
                <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Badges</div>
              </div>
            </div>

            <p className="text-xs text-center text-slate-500 font-medium">
              Your account information is securely provided by your Google account.
            </p>
          </div>
        )}

        {/* TAB 2: ACHIEVEMENTS & ROAD */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="min-w-0">
                <span className="text-[10px] inline-block uppercase font-mono tracking-wider text-slate-500 font-semibold mb-0.5">CURRENT LEVEL TITLE</span>
                <span className="text-xl font-black uppercase text-cyan-400 block tracking-tight">{profile.level}</span>
              </div>
              <div className="flex gap-1 items-center bg-cyan-950/20 px-3.5 py-1.5 rounded-full border border-cyan-500/20 text-cyan-400 text-xs font-bold font-mono">
                <Flame className="w-4 h-4" /> {profile.xp} XP acumulados
              </div>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 font-mono">
                <span>XP PROGRESSION RATIO</span>
                <span className="text-cyan-400">{profile.xp} / {currentLevelTarget} XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 p-0.5">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-350" style={{ width: `${progressRatio}%` }} />
              </div>
            </div>

            {/* ACHIEVEMENTS GRID */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block">
                ZUPSKILL ACHIEVEMENTS ({BADGES.filter(b => b.unlocked || profile.unlockedBadgeIds.includes(b.id)).length} UNLOCKED)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BADGES.map((b) => {
                  const isUnlocked = profile.unlockedBadgeIds.includes(b.id) || b.id === "problem-hunter";
                  const Icon = badgeIcons[b.icon] || Star;
                  
                  return (
                    <div
                      key={b.id}
                      className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                        isUnlocked
                          ? "bg-cyan-950/20 border-cyan-500/25 text-cyan-200"
                          : "bg-slate-950/40 border-slate-900 text-slate-650 opacity-40 select-none"
                      }`}
                    >
                      <div className={`p-2 rounded-lg border shrink-0 ${isUnlocked ? "bg-cyan-900/30 border-cyan-400/30 text-cyan-400" : "bg-slate-900 border-slate-850"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="min-w-0">
                        <span className="text-xs font-bold block leading-snug truncate" title={b.name}>{b.name}</span>
                        <span className="text-[10px] text-slate-500 block leading-tight line-clamp-1" title={b.description}>{b.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SIMULATION STATS */}
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-center gap-4">
              <div>
                <span className="text-base font-black text-white">{profile.problemsSolved}</span>
                <span className="text-[9px] font-mono text-slate-505 block uppercase mt-0.5">PROBLEMS SOLVED</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div>
                <span className="text-base font-black text-white">{profile.ideasGenerated}</span>
                <span className="text-[9px] font-mono text-slate-505 block uppercase mt-0.5">IDEAS GENERATED</span>
              </div>
              <div className="h-5 w-px bg-slate-800" />
              <div>
                <span className="text-base font-black text-white">{profile.prototypesBuilt}</span>
                <span className="text-[9px] font-mono text-slate-505 block uppercase mt-0.5">PROTOTYPES BUILT</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-405 hover:text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors border border-slate-805"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
