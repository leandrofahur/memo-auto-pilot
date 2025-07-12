'use client'

import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputMode, setInputMode] = useState<'audio' | 'text'>('audio')
  const [textInput, setTextInput] = useState('')

  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let transcribedText = ''

      if (inputMode === 'audio') {
        if (!file) return
        
        const formData = new FormData()
        formData.append('file', file)

        console.log('Uploading file:', file.name)
        
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        console.log('Transcription response:', data)
        
        transcribedText = data.transcript?.text || data.transcript || 'No transcript available'
      } else {
        // Text input mode
        if (!textInput.trim()) return
        
        transcribedText = textInput.trim()
        console.log('Using text input:', transcribedText.substring(0, 100) + '...')
      }

      setTranscript(transcribedText)

      console.log('Getting summary for:', transcribedText.substring(0, 100) + '...')
      
      const summaryRes = await fetch('/api/summarize', {
        method: 'POST',
        body: JSON.stringify({ transcript: transcribedText }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!summaryRes.ok) {
        const errorData = await summaryRes.json()
        throw new Error(errorData.error || `HTTP error! status: ${summaryRes.status}`)
      }

      const summaryData = await summaryRes.json()
      console.log('Summary response:', summaryData)
      console.log('Summary data type:', typeof summaryData.summary)
      console.log('Summary data structure:', JSON.stringify(summaryData.summary, null, 2))
      
      // Handle structured summary response
      if (summaryData.summary && typeof summaryData.summary === 'object') {
        const structuredSummary = summaryData.summary
        const summaryText = [
          structuredSummary.summary || 'No summary available',
          structuredSummary.keyPoints?.length ? '\n\nKey Points:\n' + structuredSummary.keyPoints.map((point: string) => `• ${point}`).join('\n') : '',
          structuredSummary.actionItems?.length ? '\n\nAction Items:\n' + structuredSummary.actionItems.map((item: string) => `• ${item}`).join('\n') : '',
          structuredSummary.decisions?.length ? '\n\nDecisions:\n' + structuredSummary.decisions.map((decision: string) => `• ${decision}`).join('\n') : '',
          structuredSummary.followUps?.length ? '\n\nFollow-ups:\n' + structuredSummary.followUps.map((followUp: string) => `• ${followUp}`).join('\n') : '',
          structuredSummary.takeaways?.length ? '\n\nTakeaways:\n' + structuredSummary.takeaways.map((takeaway: string) => `• ${takeaway}`).join('\n') : ''
        ].filter(Boolean).join('\n')
        
        console.log('Setting structured summary:', summaryText)
        setSummary(summaryText)
      } else {
        // Fallback for simple text response
        const summaryText = summaryData.summary || 'No summary available'
        console.log('Setting fallback summary:', summaryText)
        setSummary(summaryText)
      }
      
    } catch (error) {
      console.error('Error during processing:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎙️ MemoAutoPilot - AI Meeting Assistant</h1>
      
      {/* Input Mode Toggle */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setInputMode('audio')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              inputMode === 'audio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🎙️ Audio File
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 Text Input
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputMode === 'audio' ? (
          <label
            htmlFor="audio-upload"
            className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-white text-blue-600 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mb-2 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4M3 16h18M3 20h18"
              />
            </svg>
            <span className="text-sm font-medium">Click to upload or drag & drop your meeting audio here</span>
            <input
              id="audio-upload"
              type="file"
              accept=".mp3,.wav,.m4a,.mp4,.mpeg,.mpga,.webm"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-2">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
              📝 Paste or type your meeting transcript here
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Paste your meeting transcript here to get an AI summary..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        )}

        {file && inputMode === 'audio' && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={loading || (inputMode === 'audio' && !file) || (inputMode === 'text' && !textInput.trim())}
          className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm
            ${loading || (inputMode === 'audio' && !file) || (inputMode === 'text' && !textInput.trim())
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {loading ? 'Processing...' : inputMode === 'audio' ? '🎯 Transcribe & Summarize' : '🧠 Generate Summary'}
        </button>
      </form>

      {transcript && inputMode === 'audio' && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">📝 Transcript</h2>
            <button
              onClick={() => downloadText(transcript, 'transcript.txt')}
              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              📥 Download
            </button>
          </div>
          <p className="whitespace-pre-wrap mt-2">{transcript}</p>
        </div>
      )}

      {summary && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">🧠 Summary</h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadText(summary, 'summary.txt')}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                📥 Download Summary
              </button>
              <button
                onClick={() => downloadText(`${transcript}\n\n--- SUMMARY ---\n\n${summary}`, 'meeting-notes.txt')}
                className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                📥 Download All
              </button>
            </div>
          </div>
          <p className="whitespace-pre-wrap mt-2">{summary}</p>
        </div>
      )}
    </main>
  )
}
