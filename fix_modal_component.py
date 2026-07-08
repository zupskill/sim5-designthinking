with open('src/components/NewSimConfirmModal.tsx', 'r') as f:
    content = f.read()

# Add Topic to imports
content = content.replace("import { UserProfile } from '../types';", "import { UserProfile, Topic } from '../types';")

# Add topic and currentStage to props interface
content = content.replace(
    "profile: UserProfile | null;\n}",
    "profile: UserProfile | null;\n  topic: Topic | null;\n  currentStage: number;\n}"
)

# Add them to component arguments
content = content.replace(
    "profile\n}: NewSimConfirmModalProps)",
    "profile,\n  topic,\n  currentStage\n}: NewSimConfirmModalProps)"
)

# Replace Current Journey Details section
old_journey_details = """            {/* Current Journey Details */}
            {recap && (
              <div className={`p-6 sm:px-8 border-b ${isDark ? 'border-slate-800/50 bg-slate-900/50' : 'border-slate-100/50 bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>Current Journey</span>
                </div>
                
                <div className="space-y-2">
                  {recap.topicTitle && (
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Challenge</span>
                      <span className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{recap.topicTitle}</span>
                    </div>
                  )}
                  {recap.prototypeTitle && (
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Prototype</span>
                      <span className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{recap.prototypeTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            )}"""

new_journey_details = """            {/* Current Journey Details */}
            {(recap || topic) && (
              <div className={`p-6 sm:px-8 border-b ${isDark ? 'border-slate-800/50 bg-slate-900/50' : 'border-slate-100/50 bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>Current Journey</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-col mb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Status</span>
                    <span className={`text-sm font-semibold truncate ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {recap ? 'Completed' : `In Progress (Stage ${currentStage})`}
                    </span>
                  </div>
                  {(recap?.topicTitle || topic?.title) && (
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Challenge</span>
                      <span className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{recap?.topicTitle || topic?.title}</span>
                    </div>
                  )}
                  {recap?.prototypeTitle && (
                    <div className="flex flex-col">
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Prototype</span>
                      <span className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{recap.prototypeTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            )}"""

content = content.replace(old_journey_details, new_journey_details)

with open('src/components/NewSimConfirmModal.tsx', 'w') as f:
    f.write(content)
