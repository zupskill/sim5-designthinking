import React, { useState } from "react";
import { Play, Users, Rocket, Sparkles, Brain, CheckCircle, X, LogIn, LogOut, GraduationCap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ThemeToggle from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import { UserProfile } from "../types";

interface LandingScreenProps {
  onStart: () => void;
  onResume?: () => void;
  onNewStart?: () => void;
  hasActiveSession?: boolean;
  onExploreCommunity: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  user: any;
  profile: UserProfile | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
  onSaveOnboarding: (data: {
    username: string;
    email: string;
    phone: string;
    gender: string;
    city: string;
    yearOfBirth: string;
    college: string;
    degree: string;
    yearOfStudy: string;
    primaryInterest?: string;
    careerGoal?: string;
  }) => void;
}

export default function LandingScreen({ 
  onStart, 
  onResume,
  onNewStart,
  hasActiveSession = false,
  onExploreCommunity, 
  theme, 
  onToggleTheme,
  user,
  profile,
  onSignInWithGoogle,
  onSignOut,
  onSaveOnboarding
}: LandingScreenProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Quick Profile Setup Form State
  const [obFullName, setObFullName] = useState("");
  const [obEmail, setObEmail] = useState("");
  const [obPhone, setObPhone] = useState("");
  const [obGender, setObGender] = useState("");
  const [obCity, setObCity] = useState("");
  const [obYearOfBirth, setObYearOfBirth] = useState("");
  const [obCollege, setObCollege] = useState("");
  const [obDegree, setObDegree] = useState("");
  const [obYear, setObYear] = useState("");
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);

  // Sync state values when user loads
  React.useEffect(() => {
    if (user) {
      setObFullName(prev => prev || user.user_metadata?.full_name || user.user_metadata?.name || "");
      setObEmail(prev => prev || user.email || "");
    }
  }, [user]);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStart();
    }, 500); // 500ms transition delay
  };

  const handleResume = () => {
    if (!onResume) return;
    setIsStarting(true);
    setTimeout(() => {
      onResume();
    }, 500);
  };

  const handleNewStart = () => {
    if (!onNewStart) return;
    setIsStarting(true);
    setTimeout(() => {
      onNewStart();
    }, 500);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !obFullName.trim() ||
      !obEmail.trim() ||
      !obPhone.trim() ||
      !obGender.trim() ||
      !obCity.trim() ||
      !obYearOfBirth.trim() ||
      !obCollege.trim() ||
      !obDegree.trim() ||
      !obYear.trim()
    ) {
      return;
    }
    setIsSubmittingOnboarding(true);
    onSaveOnboarding({
      username: obFullName.trim(),
      email: obEmail.trim(),
      phone: obPhone.trim(),
      gender: obGender.trim(),
      city: obCity.trim(),
      yearOfBirth: obYearOfBirth.trim(),
      college: obCollege.trim(),
      degree: obDegree.trim(),
      yearOfStudy: obYear.trim()
    });
  };

  const isFormValid =
    obFullName.trim() !== "" &&
    obEmail.trim() !== "" &&
    obPhone.trim() !== "" &&
    obGender.trim() !== "" &&
    obCity.trim() !== "" &&
    obYearOfBirth.trim() !== "" &&
    obCollege.trim() !== "" &&
    obDegree.trim() !== "" &&
    obYear.trim() !== "";

  return (
    <div className="min-h-screen cyber-grid flex flex-col justify-between py-12 px-6 relative overflow-hidden">
      
      {/* Decorative Glow Elements */}
      <motion.div 
        animate={isStarting ? { scale: 1.4, opacity: 0.1, filter: "blur(150px)" } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" 
      />
      <motion.div 
        animate={isStarting ? { scale: 1.5, opacity: 0.05, filter: "blur(150px)" } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" 
      />

      {/* Central creative studio/lab glow bloom/atmosphere behind hero section */}
      <motion.div 
        animate={isStarting ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-150/20 dark:bg-indigo-950/10 blur-[130px] pointer-events-none -z-10" 
      />

      {/* Subtle Studio Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <motion.div 
          animate={isStarting ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute top-10 left-[8%] w-[500px] h-[500px] rounded-full bg-cyan-200/15 dark:bg-cyan-500/5 blur-[130px] pointer-events-none" 
        />
        <motion.div 
          animate={isStarting ? { scale: 1.2, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-20 right-[8%] w-[600px] h-[600px] rounded-full bg-purple-200/15 dark:bg-purple-500/5 blur-[150px] pointer-events-none" 
        />
      </div>

      {/* Header Logotype */}
      <motion.div 
        animate={isStarting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl mx-auto flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center font-black text-black text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            ZS
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase italic">DT INNOVATION LAB</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          
          {user && profile && profile.isOnboarded ? (
            <>
              <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-in fade-in duration-200">
                {user.photoURL ? (
                  <img referrerPolicy="no-referrer" src={user.photoURL} alt={profile.username} className="w-6.5 h-6.5 rounded-full border border-cyan-400/40 shrink-0" />
                ) : (
                  <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-505 flex items-center justify-center text-[10px] text-black font-black font-mono shrink-0">
                    {profile.username?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-white block line-clamp-1">{profile.username}</span>
                  <span className="text-[9px] font-mono font-semibold text-cyan-400 uppercase tracking-widest">{profile.level}</span>
                </div>
              </div>
              <SignOutButton onSignOut={onSignOut} />
            </>
          ) : (
            <span className="hidden sm:flex text-xs bg-slate-850 text-slate-300 border border-slate-700 px-3 py-1 rounded-full items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> SYSTEM: ONLINE
            </span>
          )}
        </div>
      </motion.div>

      {/* Main Container Switch */}
      <AnimatePresence mode="wait">
        {user && (!profile || !profile.isOnboarded) ? (
          /* QUICK PROFILE SETUP ONBOARDING VIEW */
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl mx-auto z-10 px-4"
          >
            <div className="glass-panel rounded-2xl overflow-hidden p-8 border-slate-805 text-left bg-slate-950/95 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-4 mb-8 border-b border-slate-800/80 pb-5">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Your Profile Setup
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Auto-saves to your account in real time.
                  </p>
                </div>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={obFullName}
                      onChange={(e) => setObFullName(e.target.value)}
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
                      value={obEmail}
                      onChange={(e) => setObEmail(e.target.value)}
                      placeholder="e.g. naveedahamed.1612@gmail.com"
                      className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={obPhone}
                      onChange={(e) => setObPhone(e.target.value)}
                      placeholder="e.g. 8946056229"
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
                      value={obGender}
                      onChange={(e) => setObGender(e.target.value)}
                      placeholder="e.g. Male"
                      className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={obCity}
                      onChange={(e) => setObCity(e.target.value)}
                      placeholder="e.g. Chennai"
                      className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-105 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      Year of Birth
                    </label>
                    <input
                      type="text"
                      required
                      value={obYearOfBirth}
                      onChange={(e) => setObYearOfBirth(e.target.value)}
                      placeholder="e.g. 2004"
                      className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      College
                    </label>
                    <input
                      type="text"
                      required
                      value={obCollege}
                      onChange={(e) => setObCollege(e.target.value)}
                      placeholder="e.g. MGR UNIVERSITY"
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
                      value={obDegree}
                      onChange={(e) => setObDegree(e.target.value)}
                      placeholder="e.g. Data Science"
                      className="w-full bg-[#0b0f19] border border-slate-800 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-350 mb-1.5">
                      Year of Graduation
                    </label>
                    <input
                      type="text"
                      required
                      value={obYear}
                      onChange={(e) => setObYear(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full bg-[#0b0f19] border border-slate-850 focus:border-cyan-505/50 text-slate-100 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmittingOnboarding}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-850 text-white font-extrabold uppercase tracking-widest rounded-full text-xs shadow-[0_8px_24px_rgba(37,99,235,0.25)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    {isSubmittingOnboarding ? (
                      <>Syncing Coordinates...</>
                    ) : (
                      <>
                        Confirm & Complete <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          /* STANDARD ADVANCED HERO AND SIGN IN SWITCH */
          <motion.div 
            key="hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto text-center my-auto z-10 px-4"
          >
            <motion.div
              animate={{
                y: [0, -4, 0],
                rotate: [-0.3, 0.3, -0.3],
                borderColor: [
                  "rgba(6,182,212,0.25)",
                  "rgba(6,182,212,0.6)",
                  "rgba(6,182,212,0.25)"
                ],
                boxShadow: [
                  "0 0 10px rgba(6,182,212,0.04)",
                  "0 0 20px rgba(6,182,212,0.2)",
                  "0 0 10px rgba(6,182,212,0.04)"
                ],
                backgroundColor: [
                  "rgba(6,182,212,0.08)",
                  "rgba(6,182,212,0.16)",
                  "rgba(6,182,212,0.08)"
                ]
              }}
              transition={{
                duration: 5.4,
                ease: "easeInOut",
                repeat: Infinity
              }}
              className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-cyan-400 text-xs font-semibold mb-6 uppercase tracking-wider select-none cursor-default backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> DT INNOVATION LAB
            </motion.div>

            <h2 className="font-extrabold tracking-tight text-white leading-none mb-6" style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}>
              Most people notice problems.<br />
              <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-650 dark:from-cyan-400 dark:via-sky-400 dark:to-indigo-400 text-transparent bg-clip-text">
                Let's learn how to solve them.
              </span>
            </h2>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              Welcome to the <span className="text-white font-medium">DT Innovation Lab 👀</span>. 
              Unleash your creativity, solve real-world struggles with friendly AI assistance, and level up your problem-solving game today!
            </p>

            {/* Dynamic Launch Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
              {!user ? (
                /* GUEST LOGIN GATEWAY */
                <button
                  id="google-signin-btn"
                  onClick={onSignInWithGoogle}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(37,99,235,0.25)] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 font-black text-xs font-mono select-none">G</span>
                  Continue with Google
                </button>
              ) : (
                /* AUTHENTICATED PILOT DRIVERS */
                <>
                  {hasActiveSession ? (
                    <>
                      <button
                        id="resume-simulation-btn"
                        onClick={handleResume}
                        className="w-full sm:w-auto px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black text-sm md:text-base font-extrabold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(34,211,238,0.3)] hover:shadow-[0_15px_35px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Resume Simulation <Rocket className="w-5 h-5" />
                      </button>
                      <button
                        id="start-new-simulation-btn"
                        onClick={handleNewStart}
                        className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-150 active:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-800 hover:text-slate-950 dark:text-white dark:hover:text-white border border-rose-500/30 hover:border-rose-500/60 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Restart New
                      </button>
                    </>
                  ) : (
                    <button
                      id="start-simulation-btn"
                      onClick={handleStart}
                      className="w-full sm:w-auto px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black text-base font-bold uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_10px_30px_rgba(34,211,238,0.3)] hover:shadow-[0_15px_35px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Start Simulation <Rocket className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
              
              <button
                onClick={onExploreCommunity}
                className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-150 active:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-850 hover:text-slate-950 dark:text-white dark:hover:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-650 text-sm font-bold uppercase tracking-widest rounded-full shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:shadow-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4.5 h-4.5" /> Explore Community
              </button>

              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full sm:w-auto px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" /> Watch Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEMO MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl glow-cyan relative p-6 animate-in fade-in zoom-in-95 duration-200 text-left">
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono"> red-lab demo blueprint</h3>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p>
                Welcome, Innovator. Below is the tactical flightplan of your 6-stage redesign simulation. 
                You will not be answering boring questions. You will actively pilot the process:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-slate-905/60 border border-slate-800 rounded-lg">
                  <span className="text-xs text-cyan-400 font-bold block uppercase tracking-wider mb-1">01. EMPATHIZE</span>
                  Explore live micro-environments and click characters to unlock hidden emotional frustrations.
                </div>
                <div className="p-3 bg-slate-905/60 border border-slate-800 rounded-lg">
                  <span className="text-xs text-purple-400 font-bold block uppercase tracking-wider mb-1">02. DEFINE</span>
                  Zoom into real pain points to engineer clean, human-centered "How Might We..." statements.
                </div>
                <div className="p-3 bg-slate-905/60 border border-slate-800 rounded-lg">
                  <span className="text-xs text-orange-400 font-bold block uppercase tracking-wider mb-1">03. IDEATE</span>
                  Drip-feed wild, clever or practical ideas. Watch the AI sort them in parallel into NOW/WOW/HOW vectors!
                </div>
                <div className="p-3 bg-slate-905/60 border border-slate-800 rounded-lg">
                  <span className="text-xs text-emerald-400 font-bold block uppercase tracking-wider mb-1">04. PROTOTYPE & TEST</span>
                  Draw maps or wireframes with digital sticky notes; then subject your system to stress tests.
                </div>
              </div>

              <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-3 mt-4">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200">
                  You'll gain XP points, elevate your Innovation Level from Observer to System Thinker, and earn locked badges.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowDemoModal(false);
                    if (user) {
                      handleStart();
                    } else {
                      onSignInWithGoogle();
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-505 hover:from-cyan-300 hover:to-indigo-400 text-black font-extrabold uppercase tracking-widest rounded-full text-xs transition-all duration-200 cursor-pointer"
                >
                  {user ? "Enter The Lab Now 🚀" : "Sign In & Enter The Lab Now 🚀"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
