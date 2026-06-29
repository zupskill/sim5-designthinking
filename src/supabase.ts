import { createClient } from "@supabase/supabase-js";
import { UserProfile } from "./types";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

const finalUrl = isSupabaseConfigured ? supabaseUrl : "https://placeholder-project.supabase.co";
const finalKey = isSupabaseConfigured ? supabaseAnonKey : "placeholder-key-xyz";

export const supabase = createClient(finalUrl, finalKey);

/**
 * Fetch unified profile and progress from Supabase
 */
export async function getSupabaseProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;

  try {
    // 1. Fetch profile using id (maps to auth.users.id in your new schema)
    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileErr) {
      console.warn("Could not find public.profiles record.", profileErr);
    }

    // 2. Fetch progress (optional table)
    let progressData: any = null;
    try {
      const { data, error: progressErr } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (!progressErr) {
        progressData = data;
      }
    } catch (e) {
      // Optional table, ignore failure
    }

    // 3. Fetch badges (optional table)
    let unlockedBadgeIds = ["problem-hunter"];
    try {
      const { data: badgeRows, error: badgErr } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);
      if (!badgErr && badgeRows) {
        unlockedBadgeIds = badgeRows.map(b => b.badge_id);
      }
    } catch (e) {
      // Optional table, ignore failure
    }

    if (!profileData && !progressData) {
      return null;
    }

    // Convert potential integer years from DB back to string for UI state
    const phoneVal = profileData?.phone || "";
    const genderVal = profileData?.gender || "";
    const cityVal = profileData?.city || "";
    const yearOfBirthVal = profileData?.year_of_birth ? String(profileData.year_of_birth) : "";
    const yearOfGraduationVal = profileData?.year_of_graduation ? String(profileData.year_of_graduation) : "";

    // Combine profile & progress into frontend UserProfile structure
    return {
      uid: userId,
      email: profileData?.email || "",
      username: profileData?.full_name || profileData?.email?.split("@")[0] || "Innovator",
      photoURL: "", // Not present in the new profiles table structure
      college: profileData?.college || "",
      degree: profileData?.branch || "",
      yearOfStudy: yearOfGraduationVal,
      primaryInterest: "", // Not present in the new profiles table structure
      careerGoal: "", // Not present in the new profiles table structure
      isOnboarded: profileData?.profile_submitted || false,
      xp: progressData?.xp ?? 60,
      level: (progressData?.level as any) || "Explorer",
      unlockedBadgeIds: unlockedBadgeIds.length > 0 ? unlockedBadgeIds : ["problem-hunter"],
      problemsSolved: progressData?.problems_solved ?? 0,
      ideasGenerated: progressData?.ideas_generated ?? 0,
      prototypesBuilt: progressData?.prototypes_built ?? 0,
      phone: phoneVal,
      gender: genderVal,
      city: cityVal,
      yearOfBirth: yearOfBirthVal,
    };
  } catch (err) {
    console.error("Error retrieving Supabase profile:", err);
    return null;
  }
}

/**
 * Save / Update profile details in Supabase
 */
export async function saveSupabaseProfile(userId: string, data: Partial<UserProfile> & { email?: string; photoURL?: string }): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const profileUpdates: any = {
      id: userId,
      updated_at: new Date().toISOString()
    };

    if (data.username !== undefined) profileUpdates.full_name = data.username;
    if (data.email !== undefined) profileUpdates.email = data.email;
    if (data.college !== undefined) profileUpdates.college = data.college;
    if (data.degree !== undefined) profileUpdates.branch = data.degree;
    
    // Parse yearOfStudy (graduation year) to integer
    if (data.yearOfStudy !== undefined) {
      if (data.yearOfStudy === "") {
        profileUpdates.year_of_graduation = null;
      } else {
        const parsedGradYear = parseInt(data.yearOfStudy, 10);
        profileUpdates.year_of_graduation = isNaN(parsedGradYear) ? null : parsedGradYear;
      }
    }
    
    if (data.phone !== undefined) profileUpdates.phone = data.phone;
    if (data.gender !== undefined) profileUpdates.gender = data.gender;
    if (data.city !== undefined) profileUpdates.city = data.city;

    // Parse yearOfBirth to integer
    if (data.yearOfBirth !== undefined) {
      if (data.yearOfBirth === "") {
        profileUpdates.year_of_birth = null;
      } else {
        const parsedBirthYear = parseInt(data.yearOfBirth, 10);
        profileUpdates.year_of_birth = isNaN(parsedBirthYear) ? null : parsedBirthYear;
      }
    }

    if (data.isOnboarded !== undefined) {
      profileUpdates.profile_submitted = data.isOnboarded;
    }

    // Upsert into profile table using "id" as matching column (maps to auth.users.id)
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert(profileUpdates);

    if (profileErr) throw profileErr;

    // Save progress updates if present (optional fallback)
    const progressUpdates: any = {};
    if (data.xp !== undefined) progressUpdates.xp = data.xp;
    if (data.level !== undefined) progressUpdates.level = data.level;
    if (data.problemsSolved !== undefined) progressUpdates.problems_solved = data.problemsSolved;
    if (data.ideasGenerated !== undefined) progressUpdates.ideas_generated = data.ideasGenerated;
    if (data.prototypesBuilt !== undefined) progressUpdates.prototypes_built = data.prototypesBuilt;
    progressUpdates.updated_at = new Date().toISOString();

    if (Object.keys(progressUpdates).length > 1) {
      try {
        await supabase
          .from("user_progress")
          .upsert({ user_id: userId, ...progressUpdates });
      } catch (progressErr) {
        console.warn("Optional user_progress save bypassed:", progressErr);
      }
    }

    return true;
  } catch (err) {
    console.error("Error saving Supabase profile data:", err);
    return false;
  }
}

/**
 * Save user badges
 */
export async function unlockSupabaseBadge(userId: string, badgeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("user_badges")
      .upsert({ user_id: userId, badge_id: badgeId, earned_at: new Date().toISOString() });

    if (error) {
      if (error.code === "23505") { // Unique constraint violation (badge already unlocked)
        return true;
      }
      throw error;
    }
    return true;
  } catch (err) {
    console.error("Error saving badge:", err);
    return false;
  }
}

/**
 * Store completed simulation results
 */
export async function saveSimulationResult(userId: string, resultDetails: {
  topic: any;
  problem_definition: string;
  idea: string;
  solution: string;
  overall_score: number;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from("simulation_results")
      .insert({
        user_id: userId,
        topic: resultDetails.topic,
        problem_definition: resultDetails.problem_definition,
        idea: resultDetails.idea,
        solution: resultDetails.solution,
        overall_score: resultDetails.overall_score,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error saving simulation results:", err);
    return false;
  }
}
