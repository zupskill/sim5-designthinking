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

  // Input states filled with existing profile fields
  const [fullName, setFullName] = useState(profile.username || "");
  const [emailVal, setEmailVal] = useState(profile.email || "");
  const [phoneVal, setPhoneVal] = useState(profile.phone || "");
  const [genderVal, setGenderVal] = useState(profile.gender || "");
  const [cityVal, setCityVal] = useState(profile.city || "");
  const [yearOfBirthVal, setYearOfBirthVal] = useState(profile.yearOfBirth || "");
  const [collegeVal, setCollegeVal] = useState(profile.college || "");
  const [branchVal, setBranchVal] = useState(profile.degree || "");
  const [yearOfGraduationVal, setYearOfGraduationVal] = useState(profile.yearOfStudy || "");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

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

  // Auto-save logic triggers after 800ms debounce of any input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Check if anything actually changed from current profile values
      if (
        fullName === profile.username &&
        emailVal === profile.email &&
        phoneVal === (profile.phone || "") &&
        genderVal === (profile.gender || "") &&
        cityVal === (profile.city || "") &&
        yearOfBirthVal === (profile.yearOfBirth || "") &&
        collegeVal === profile.college &&
        branchVal === (profile.degree || "") &&
        yearOfGraduationVal === (profile.yearOfStudy || "")
      ) {
        return;
      }

      setSaveStatus("saving");
      
      const newProfile: UserProfile = {
        ...profile,
        username: fullName,
        email: emailVal,
        phone: phoneVal,
        gender: genderVal,
        city: cityVal,
        yearOfBirth: yearOfBirthVal,
        college: collegeVal,
        degree: branchVal,
        yearOfStudy: yearOfGraduationVal
      };

      setProfile(newProfile);

      if (profile.uid) {
        const success = await saveSupabaseProfile(profile.uid, newProfile);
        if (success) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } else {
          setSaveStatus("idle");
        }
      } else {
         setSaveStatus("saved");
         setTimeout(() => setSaveStatus("idle"), 2500);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [
    fullName,
    emailVal,
    phoneVal,
    genderVal,
    cityVal,
    yearOfBirthVal,
    collegeVal,
    branchVal,
    yearOfGraduationVal
  ]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
      <div className="glass-panel max-w-2xl w-full rounded-2xl overflow-hidden relative p-8 border-slate-800 text-left bg-slate-950/95 shadow-2xl">
        
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
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-slate-400">
                  Auto-saves to your account in real time.
                </p>
              </div>
              <div>
                {saveStatus === "saving" && (
                  <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    AUTO-SAVING...
                  </span>
                )}
                {saveStatus === "saved" && (
                  <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    ALL CHANGES SAVED
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Naveed Ahamed"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  placeholder="e.g. name@domain.com"
                  className="w-full bg-[#0b0f19] border border-slate-850 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="e.g. 5550212354"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Gender
                </label>
                <input
                  type="text"
                  required
                  value={genderVal}
                  onChange={(e) => setGenderVal(e.target.value)}
                  placeholder="e.g. Male / Female"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={cityVal}
                  onChange={(e) => setCityVal(e.target.value)}
                  placeholder="e.g. Seattle"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Year of Birth
                </label>
                <input
                  type="text"
                  required
                  value={yearOfBirthVal}
                  onChange={(e) => setYearOfBirthVal(e.target.value)}
                  placeholder="e.g. 2004"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-110 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  College
                </label>
                <input
                  type="text"
                  required
                  value={collegeVal}
                  onChange={(e) => setCollegeVal(e.target.value)}
                  placeholder="e.g. State University"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Branch
                </label>
                <input
                  type="text"
                  required
                  value={branchVal}
                  onChange={(e) => setBranchVal(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                  Year of Graduation
                </label>
                <input
                  type="text"
                  required
                  value={yearOfGraduationVal}
                  onChange={(e) => setYearOfGraduationVal(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                />
              </div>
            </div>
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
