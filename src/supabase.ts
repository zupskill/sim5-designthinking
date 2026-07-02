import { createClient } from "@supabase/supabase-js";
import { UserProfile } from "./types";
import { getOrCreateUser } from "./utils/auth";

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
    const user = await getOrCreateUser();

    if (!user) {
      console.warn("Could not find or create centralized user record.");
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
    // Calculate simple stats based on distinct completed activity_ids
    const completedSimulationIds = new Set(
      activities.filter(a => a.task_id === "5.0" && a.completed).map(a => a.activity_id)
    );
    const completedCount = completedSimulationIds.size;
    
    const testStages = activities.filter(a => a.task_id === "5.0" && a.completed);
    testStages.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    const latestTest = testStages[0];

    let lastCompletedSimulation = null;
    if (latestTest) {
      const runStages = activities.filter(a => a.activity_id === latestTest.activity_id);
      const stage1 = runStages.find(a => a.task_id === "1.0");
      const stage2 = runStages.find(a => a.task_id === "2.0");
      const stage4 = runStages.find(a => a.task_id === "4.0");

      let parsedScores = { overallScore: latestTest.score || 0, creativity: 0, understanding: 0, innovation: 0 };
      try {
        if (latestTest.value2) {
          parsedScores = JSON.parse(latestTest.value2);
        }
      } catch (e) {}

      lastCompletedSimulation = {
        date: latestTest.updated_at,
        topicId: stage1?.value1 || "custom",
        topicTitle: stage1?.value2 || "Custom Challenge",
        refinedProblem: stage2?.value1 || "Problem definition not found",
        prototypeTitle: stage4?.value1 || "Untitled Prototype",
        prototypeDescription: stage4?.value2 || "Prototype description not found",
        scores: parsedScores
      };
    }

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
      lastCompletedSimulation
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
 * Store progressive simulation results per stage
 */
export async function saveStageProgress(payloadDetails: {
  activity_id: string;
  task_id: string;
  task_name: string;
  task_description: string;
  value1?: string;
  value2?: string;
  value3?: string;
  score?: number;
  completed: boolean;
}): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const user = await getOrCreateUser();

    if (!user) {
      console.warn("User not found for saving stage progress.");
      return false;
    }

    const payload = {
      user_id: user.id,
      activity_id: payloadDetails.activity_id,
      task_id: payloadDetails.task_id,
      task_name: payloadDetails.task_name,
      task_description: payloadDetails.task_description,
      value1: payloadDetails.value1 || null,
      value2: payloadDetails.value2 || null,
      value3: payloadDetails.value3 || null,
      score: payloadDetails.score || 0,
      completed: payloadDetails.completed,
      updated_at: new Date().toISOString()
    };

    console.log(`Checking existing row for user_id=${user.id}, activity_id=${payload.activity_id}, task_id=${payload.task_id}`);

    const { data: existing, error: selectErr } = await supabase
      .from("activity_designthinking")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", payload.activity_id)
      .eq("task_id", payload.task_id)
      .maybeSingle();

    if (selectErr) {
      console.error("Error checking existing row:", selectErr);
    }

    if (existing) {
      console.log(`Updating existing row ID: ${existing.id}`);
      const { error: updateErr } = await supabase
        .from("activity_designthinking")
        .update(payload)
        .eq("id", existing.id);
      
      if (updateErr) throw updateErr;
    } else {
      console.log("Inserting new row...");
      const { error: insertErr } = await supabase
        .from("activity_designthinking")
        .insert(payload);
        
      if (insertErr) {
        if (insertErr.code === '23505') {
          console.warn("Unique constraint violation. Falling back to update by user_id and task_id...");
          const { error: fallbackUpdateErr } = await supabase
            .from("activity_designthinking")
            .update(payload)
            .eq("user_id", user.id)
            .eq("task_id", payload.task_id);
            
          if (fallbackUpdateErr) throw fallbackUpdateErr;
        } else {
          throw insertErr;
        }
      }
    }

    console.log(`Successfully saved stage ${payload.task_id}`);
    return true;
  } catch (err) {
    console.error("Error saving stage progress:", err);
    return false;
  }
}

