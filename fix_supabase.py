import re

with open('src/supabase.ts', 'r') as f:
    content = f.read()

def replace_save_stage(match):
    return """export async function saveStageProgress(payloadDetails: {
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
    console.log("🔥 DESIGN THINKING SAVE FUNCTION CALLED");
    console.log("Supabase Client:", supabase);
    console.log("Saving Design Thinking activity...");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("CURRENT USER:", user);
    
    if (!user) {
      console.warn("User not found for saving stage progress.", authError);
      return false;
    }

    const payload = {
      user_id: user.id,
      activity_id: "S003",
      task_id: parseFloat(payloadDetails.task_id), // Cast to float/int
      task_name: payloadDetails.task_name,
      task_description: payloadDetails.task_description,
      value1: payloadDetails.value1 || null,
      value2: payloadDetails.value2 || null,
      value3: payloadDetails.value3 || null,
      score: payloadDetails.score || 0,
      completed: payloadDetails.completed,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("activity_designthinking")
      .upsert(payload, { onConflict: "user_id,activity_id,task_id" })
      .select();

    if (error) {
      console.error("SUPABASE INSERT FAILED:", error);
      throw error;
    }

    console.log("Design Thinking saved:", data);
    return true;
  } catch (err) {
    console.error("Error saving stage progress:", err);
    return false;
  }
}"""

pattern = re.compile(r"export async function saveStageProgress.*?return false;\n  }\n}", re.DOTALL)
content = pattern.sub(replace_save_stage, content)

with open('src/supabase.ts', 'w') as f:
    f.write(content)
