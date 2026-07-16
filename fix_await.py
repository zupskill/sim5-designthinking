import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                        import("./supabase").then(mod => mod.saveStageProgress({
                            activity_id: "S003",
                            task_id: "5.0",
                            task_name: "Test",
                            task_description: "Evaluated prototype",
                            value1: selectedPrototype?.title || "",
                            value2: selectedPrototype?.description || "",
                            value3: JSON.stringify({ creativity, understanding, innovation, overallScore }),
                            score: overallScore,
                            completed: true
                          }));"""

replacement = """                        try {
                          const { saveStageProgress } = await import("./supabase");
                          await saveStageProgress({
                            activity_id: "S003",
                            task_id: "5.0",
                            task_name: "Test",
                            task_description: "Evaluated prototype",
                            value1: selectedPrototype?.title || "",
                            value2: selectedPrototype?.description || "",
                            value3: JSON.stringify({ creativity, understanding, innovation, overallScore }),
                            score: overallScore,
                            completed: true
                          });
                        } catch (err) {
                          console.error("Failed to save stage progress", err);
                        }"""

content = content.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)
