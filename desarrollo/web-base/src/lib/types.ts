// ─── Core domain types ───────────────────────────────────────────────────────

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  /** UTM / referral attribution */
  source?: string
  medium?: string
  campaign?: string
  referrer?: string
  /** ISO-8601 */
  timestamp: string
  /** ISO-8601 — optional appointment requested */
  appointment?: string
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  ok: true
  data: T
}

export interface ApiError {
  ok: false
  error: string
  details?: unknown
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// ─── CRM ─────────────────────────────────────────────────────────────────────

export type CrmProvider = 'pipedrive' | 'hubspot' | 'generic'

export interface CrmConfig {
  provider: CrmProvider
  webhookUrl: string
  apiKey?: string
}

export interface CrmResult {
  ok: boolean
  provider: CrmProvider
  statusCode?: number
  error?: string
}
