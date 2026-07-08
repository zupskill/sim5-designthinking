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
    content = content.replace(
        '<div className="min-h-screen text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">',
        '<div className="min-h-screen text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-black">\n' + modal_render
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)
