import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add imports
if 'import NewSimConfirmModal' not in content:
    content = content.replace('import LandingScreen from "./components/LandingScreen";', 'import LandingScreen from "./components/LandingScreen";\nimport NewSimConfirmModal from "./components/NewSimConfirmModal";\nimport { generateRecapReport } from "./utils/pdfGenerator";')

# 2. Add state variables inside App()
state_var_pattern = r"const \[showAccountChooser, setShowAccountChooser\] = useState<boolean>\(false\);"
if 'showNewSimConfirm' not in content:
    content = re.sub(state_var_pattern, r"const [showAccountChooser, setShowAccountChooser] = useState<boolean>(false);\n  const [showNewSimConfirm, setShowNewSimConfirm] = useState<boolean>(false);\n  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);", content)

# 3. Add handler
handler_str = """  const handleSafeNewStart = () => {
    setShowNewSimConfirm(true);
  };

  const handleConfirmNewStart = () => {
    setShowNewSimConfirm(false);
    handleResetSim();
    triggerTransition("intro");
  };

  const handleDownloadReport = async () => {
    if (!profile.lastCompletedSimulation) return;
    setIsGeneratingPDF(true);
    try {
      await generateRecapReport(profile.lastCompletedSimulation, profile);
    } catch (e) {
      console.error(e);
    }
    setIsGeneratingPDF(false);
  };"""

if 'handleSafeNewStart' not in content:
    content = content.replace("const advanceStage = (stageNum: number) => {", handler_str + "\n\n  const advanceStage = (stageNum: number) => {")

# 4. Replace handleResetSim() inside RecapScreen and LandingScreen with handleSafeNewStart()
content = re.sub(r"onNewStart=\{\(\) => \{\s*handleResetSim\(\);\s*triggerTransition\(\"intro\"\);\s*\}\}", 'onNewStart={handleSafeNewStart}', content)

modal_render = """      {/* New Simulation Confirmation Modal */}
      <NewSimConfirmModal
        isOpen={showNewSimConfirm}
        onClose={() => setShowNewSimConfirm(false)}
        onConfirm={handleConfirmNewStart}
        onDownload={handleDownloadReport}
        isDownloading={isGeneratingPDF}
        theme={theme}
        profile={profile}
      />
"""

if '<NewSimConfirmModal' not in content:
    content = content.replace("      {/* Main Content Area */}", modal_render + "\n      {/* Main Content Area */}")

with open('src/App.tsx', 'w') as f:
    f.write(content)
