/**
 * Backup de leads en disco (JSON Lines) para garantizar que
 * ningún lead se pierda si el CRM no está disponible.
 *
 * Escribe en DATA_DIR/leads.jsonl (configurable vía DATA_DIR env var).
 * En Coolify, montar un volumen persistente en DATA_DIR.
 */
import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { Lead } from './types'

function getDataDir(): string {
  return import.meta.env.DATA_DIR ?? join(process.cwd(), 'data')
}

export function backupLead(lead: Lead): void {
  const dir = getDataDir()
  try {
    mkdirSync(dir, { recursive: true })
    appendFileSync(join(dir, 'leads.jsonl'), JSON.stringify(lead) + '\n', 'utf8')
  } catch (err) {
    // Non-fatal: log y continuar. No queremos romper el flujo principal.
    console.error('[backup] Error guardando lead:', err)
  }
}
