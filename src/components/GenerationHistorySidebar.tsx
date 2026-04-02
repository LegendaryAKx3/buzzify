'use client'

import { ChevronLeft, ChevronRight, History, Sparkles } from 'lucide-react'

import { type GenerationHistoryEntry } from '@/lib/generation-history'

interface GenerationHistorySidebarProps {
  entries: GenerationHistoryEntry[]
  isOpen: boolean
  selectedEntryId: string | null
  onSelect: (entry: GenerationHistoryEntry) => void
  onToggle: () => void
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

export default function GenerationHistorySidebar({
  entries,
  isOpen,
  selectedEntryId,
  onSelect,
  onToggle,
}: GenerationHistorySidebarProps) {
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-40 flex h-screen items-start">
      <div
        className={`pointer-events-none mt-20 mr-4 flex h-[calc(100vh-6rem)] max-h-[760px] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'
        }`}
      >
        <button
          onClick={onToggle}
          className="pointer-events-auto mt-4 flex h-12 w-12 items-center justify-center rounded-l-xl border border-r-0 border-gray-700 bg-gray-900 text-gray-300 shadow-lg transition-colors hover:bg-gray-800 hover:text-white"
          aria-label={isOpen ? 'Collapse history sidebar' : 'Expand history sidebar'}
        >
          {isOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        <aside className="pointer-events-auto flex h-full w-[22rem] flex-col rounded-l-2xl border border-gray-800 bg-gray-950/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center gap-2 border-b border-gray-800 pb-4">
            <History className="h-5 w-5 text-green-500" />
            <div>
              <h2 className="font-semibold text-white">Past Generations</h2>
              <p className="text-xs text-gray-400">This browser only</p>
            </div>
          </div>

          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900/50 p-6 text-center">
              <Sparkles className="mb-3 h-6 w-6 text-green-500" />
              <p className="text-sm text-white">No local history yet</p>
              <p className="mt-2 text-xs text-gray-400">
                Generate something and it will appear here on this device.
              </p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto pr-1">
              {entries.map((entry) => {
                const isSelected = entry.id === selectedEntryId

                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelect(entry)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-green-500/60 bg-gray-800'
                        : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.16em] text-green-400">
                        {entry.length}
                      </span>
                      <span className="text-xs text-gray-500">{formatTimestamp(entry.createdAt)}</span>
                    </div>
                    <p className="truncate text-sm font-medium text-white">{entry.inputText}</p>
                    <p className="mt-2 truncate text-sm text-gray-400">{entry.outputText}</p>
                  </button>
                )
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
