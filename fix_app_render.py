import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

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
