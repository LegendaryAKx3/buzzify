export type GenerationLength = 'short' | 'medium' | 'long'

export interface GenerationHistoryEntry {
  id: string
  inputText: string
  outputText: string
  length: GenerationLength
  createdAt: string
}

export const GENERATION_HISTORY_STORAGE_KEY = 'buzzify:generation-history'
const MAX_HISTORY_ENTRIES = 50

function isGenerationLength(value: unknown): value is GenerationLength {
  return value === 'short' || value === 'medium' || value === 'long'
}

function isGenerationHistoryEntry(value: unknown): value is GenerationHistoryEntry {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.inputText === 'string' &&
    typeof candidate.outputText === 'string' &&
    typeof candidate.createdAt === 'string' &&
    isGenerationLength(candidate.length)
  )
}

function sortByNewest(entries: GenerationHistoryEntry[]) {
  return [...entries].sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function loadGenerationHistory(rawValue: string | null | undefined): GenerationHistoryEntry[] {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    const validEntries = parsed.filter(isGenerationHistoryEntry)

    return sortByNewest(validEntries)
  } catch {
    return []
  }
}

export function appendGenerationHistoryEntry(
  rawValue: string | null | undefined,
  entry: GenerationHistoryEntry
): string {
  const nextEntries = [entry, ...loadGenerationHistory(rawValue).filter((item) => item.id !== entry.id)]

  return JSON.stringify(sortByNewest(nextEntries).slice(0, MAX_HISTORY_ENTRIES))
}

export function createGenerationHistoryEntry(input: {
  inputText: string
  outputText: string
  length: GenerationLength
}): GenerationHistoryEntry {
  return {
    id: crypto.randomUUID(),
    inputText: input.inputText,
    outputText: input.outputText,
    length: input.length,
    createdAt: new Date().toISOString(),
  }
}

export function readGenerationHistory(storage: Pick<Storage, 'getItem'> = window.localStorage) {
  return loadGenerationHistory(storage.getItem(GENERATION_HISTORY_STORAGE_KEY))
}

export function saveGenerationHistoryEntry(
  entry: GenerationHistoryEntry,
  storage: Pick<Storage, 'getItem' | 'setItem'> = window.localStorage
) {
  const serialized = appendGenerationHistoryEntry(
    storage.getItem(GENERATION_HISTORY_STORAGE_KEY),
    entry
  )

  storage.setItem(GENERATION_HISTORY_STORAGE_KEY, serialized)

  return loadGenerationHistory(serialized)
}
