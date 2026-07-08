import re

with open('src/supabase.ts', 'r') as f:
    content = f.read()

def replace_test_save(match):
    return """(window as any).testSave = async () => {
  console.log("🔥 RUNNING testSave()...");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) {
    console.error("TEST SAVE FAILED: No authenticated user", authError);
    return;
  }
  
  console.log("Current Supabase User:", user);
  
  const payload = {
    user_id: user.id,
    activity_id: "S003",
    task_id: 999,
    task_name: "TEST",
    task_description: "Testing Supabase",
    value1: "hello",
    completed: true,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("activity_designthinking")
    .upsert(payload, { onConflict: "user_id,activity_id,task_id" })
    .select();
    
  console.log("TEST SAVE SUCCESS", data);
  if (error) console.error("TEST ERROR:", error);
};"""

pattern = re.compile(r"\(window as any\)\.testSave = async \(\) => \{.*?if \(error\) console\.error\(\"TEST ERROR:\", error\);\n\};", re.DOTALL)
content = pattern.sub(replace_test_save, content)

with open('src/supabase.ts', 'w') as f:
    f.write(content)
