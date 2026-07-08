import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace <NewSimConfirmModal ... />
old_modal = """      <NewSimConfirmModal
        isOpen={showNewSimConfirm}
        onClose={() => setShowNewSimConfirm(false)}
        onConfirm={handleConfirmNewStart}
        onDownload={handleDownloadReport}
        isDownloading={isGeneratingPDF}
        theme={theme}
        profile={profile}
      />"""

new_modal = """      <NewSimConfirmModal
        isOpen={showNewSimConfirm}
        onClose={() => setShowNewSimConfirm(false)}
        onConfirm={handleConfirmNewStart}
        onDownload={handleDownloadReport}
        isDownloading={isGeneratingPDF}
        theme={theme}
        profile={profile}
        topic={selectedTopic}
        currentStage={currentStage}
      />"""

content = content.replace(old_modal, new_modal)

with open('src/App.tsx', 'w') as f:
    f.write(content)
