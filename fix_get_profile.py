import re

with open('src/supabase.ts', 'r') as f:
    content = f.read()

def replace_get_profile(match):
    return """export async function getSupabaseProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: activities, error: activityErr } = await supabase
      .from("activity_designthinking")
      .select("*")
      .eq("user_id", userId)
      .eq("activity_id", "S003");

    if (activityErr) {
      console.warn("Could not find activities.", activityErr);
    }
    
    if (!activities || activities.length === 0) {
      return null;
    }

    const testStage = activities.find(a => a.task_id === 5);
    const completedCount = testStage ? 1 : 0;
    
    let lastCompletedSimulation = null;
    if (testStage) {
      const stage1 = activities.find(a => a.task_id === 1);
      const stage2 = activities.find(a => a.task_id === 2);

      let parsedScores = { overallScore: testStage.score || 0, creativity: 0, understanding: 0, innovation: 0 };
      try {
        if (testStage.value3) {
          parsedScores = JSON.parse(testStage.value3);
        }
      } catch (e) {}

      lastCompletedSimulation = {
        date: testStage.updated_at,
        topicId: stage1?.value1 || "custom",
        topicTitle: stage1?.value2 || "Custom Challenge",
        refinedProblem: stage2?.value1 || "Problem definition not found",
        prototypeTitle: testStage.value1 || "Untitled Prototype",
        prototypeDescription: testStage.value2 || "Prototype description not found",
        scores: parsedScores
      };
    }

    return {
      uid: userId,
      email: "",
      username: "Innovator",
      photoURL: "",
      college: "",
      degree: "",
      yearOfStudy: "",
      primaryInterest: "",
      careerGoal: "",
      isOnboarded: true,
      xp: 60 + (completedCount * 100),
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
}"""

pattern = re.compile(r"export async function getSupabaseProfile.*?return null;\n  }\n}", re.DOTALL)
content = pattern.sub(replace_get_profile, content)

with open('src/supabase.ts', 'w') as f:
    f.write(content)
