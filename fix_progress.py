import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                      onNext={() => {
                        // Compute Recap"""

replacement = """                      onNext={async () => {
                        // Compute Recap"""

content = content.replace(target, replacement)

target2 = """                        triggerTransition("report", undefined, "Testing complete. Let's inspect final scores! 🧪");
                      }}
                    />"""

replacement2 = """                        try {
                          await supabase.functions.invoke("progress-engine", {
                            body: {
                              action: "complete_simulator",
                              activity_id: "S003",
                              activity_name: "Design Thinking",
                              final_score: overallScore
                            }
                          });
                        } catch (err) {
                          console.error("Failed to update achievements", err);
                        }

                        triggerTransition("report", undefined, "Testing complete. Let's inspect final scores! 🧪");
                      }}
                    />"""

content = content.replace(target2, replacement2)

with open('src/App.tsx', 'w') as f:
    f.write(content)
