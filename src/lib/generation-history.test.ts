import test from 'node:test'
import assert from 'node:assert/strict'

import {
  type GenerationHistoryEntry,
  appendGenerationHistoryEntry,
  loadGenerationHistory,
} from './generation-history.ts'

const createEntry = (id: string, createdAt: string): GenerationHistoryEntry => ({
  id,
  inputText: `input-${id}`,
  outputText: `output-${id}`,
  length: 'medium',
  createdAt,
})

test('loadGenerationHistory returns newest entries first', () => {
  const entries = loadGenerationHistory(
    JSON.stringify([
      createEntry('older', '2026-04-01T10:00:00.000Z'),
      createEntry('newer', '2026-04-01T11:00:00.000Z'),
    ])
  )

  assert.deepEqual(
    entries.map((entry) => entry.id),
    ['newer', 'older']
  )
})

test('loadGenerationHistory falls back to an empty list for invalid payloads', () => {
  assert.deepEqual(loadGenerationHistory('{"bad":true}'), [])
  assert.deepEqual(loadGenerationHistory('not-json'), [])
})

test('appendGenerationHistoryEntry prepends the new entry and trims the list', () => {
  const initialEntries = Array.from({ length: 50 }, (_, index) =>
    createEntry(`${index}`, `2026-04-01T10:${String(index).padStart(2, '0')}:00.000Z`)
  )

  const serialized = JSON.stringify(initialEntries)
  const result = appendGenerationHistoryEntry(
    serialized,
    createEntry('latest', '2026-04-02T09:00:00.000Z')
  )
  const entries = loadGenerationHistory(result)

  assert.equal(entries.length, 50)
  assert.equal(entries[0]?.id, 'latest')
  assert.equal(entries.at(-1)?.id, '1')
})
