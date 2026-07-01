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
    const authUserResponse = await supabase.auth.getUser();
    const authUser = authUserResponse.data?.user;
    if (!authUser || !authUser.email) return null;

    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (userErr || !user) {
      console.warn("Could not find centralized user record.", userErr);
      return null;
    }

    const { data: activities, error: activityErr } = await supabase
      .from("activity_designthinking")
      .select("*")
      .eq("user_id", user.id);

    if (activityErr) {
      console.warn("Could not find activities.", activityErr);
    }
    
    if (!activities || activities.length === 0) {
      // If no activity rows exist, return null so local logic initializes fresh
      return null;
    }

    // Map the centralized user and activity data to UserProfile
    // Calculate simple stats based on activities
    const completedCount = activities.filter(a => a.completed).length;
    
    // Sort activities by updated_at descending to find the last completed simulation
    const sortedActivities = [...activities].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    const latest = sortedActivities[0];

    return {
      uid: userId, // Keep auth.users.id as uid to satisfy UI constraints
      email: user.email || "",
      username: user.full_name || user.email?.split("@")[0] || "Innovator",
      photoURL: user.avatar_url || "",
      college: "",
      degree: "",
      yearOfStudy: "",
      primaryInterest: "",
      careerGoal: "",
      isOnboarded: true,
      xp: 60 + (completedCount * 100), // example derivation
      level: completedCount >= 1 ? "Innovator" : "Explorer",
      unlockedBadgeIds: ["problem-hunter"],
      problemsSolved: completedCount,
      ideasGenerated: completedCount,
      prototypesBuilt: completedCount,
      phone: "",
      gender: "",
      city: "",
      yearOfBirth: "",
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
  // Per standardized Zup architecture, profile info is managed in centralized users table by Zup Profile app.
  // We do not save profile updates here.
  return true;
}

/**
 * Save user badges
 */
export async function unlockSupabaseBadge(userId: string, badgeId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  // Per standardized Zup architecture, badges are not stored in this app.
  return true;
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
    const authUserResponse = await supabase.auth.getUser();
    const authUser = authUserResponse.data?.user;
    if (!authUser || !authUser.email) {
      console.error("No authenticated user found.");
      return false;
    }

    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", authUser.email)
      .single();

    if (userErr || !user) {
      alert("Please log in through the Zup Profile application.");
      return false;
    }

    console.log("Authenticated User:", authUser);
    console.log("Resolved Profile ID:", user.id);

    const payload = {
      user_id: user.id,
      activity_id: "S003",
      task_id: resultDetails.topic.id,
      task_name: resultDetails.topic.title,
      task_description: resultDetails.topic.description,
      value1: resultDetails.problem_definition,
      value2: resultDetails.idea,
      value3: resultDetails.solution,
      score: resultDetails.overall_score,
      completed: true,
      updated_at: new Date().toISOString()
    };

    console.log("Payload:", payload);
    console.log("Supabase Request: upsert to activity_designthinking");

    const { data, error } = await supabase
      .from("activity_designthinking")
      .upsert(payload, { onConflict: "user_id,task_id" })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    console.log("Supabase Response:", data);
    return true;
  } catch (err) {
    console.error("Error saving simulation results:", err);
    return false;
  }
}
