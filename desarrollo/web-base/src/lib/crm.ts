/**
 * CRM integration — sends leads to a configured webhook.
 * Supports Pipedrive, HubSpot, or any generic webhook.
 *
 * Env vars required:
 *   CRM_WEBHOOK_URL  — destination webhook URL
 *   CRM_PROVIDER     — 'pipedrive' | 'hubspot' | 'generic'  (default: 'generic')
 *   CRM_API_KEY      — bearer token / API key (optional, sent as Authorization header)
 */
import { $fetch, FetchError } from 'ofetch'
import type { Lead, CrmConfig, CrmResult, CrmProvider } from './types'

// ─── Payload adapters ─────────────────────────────────────────────────────────

function toPipedrivePayload(lead: Lead): Record<string, unknown> {
  return {
    title: `Lead: ${lead.name}`,
    person: {
      name: lead.name,
      email: [{ value: lead.email, primary: true }],
      phone: lead.phone ? [{ value: lead.phone, primary: true }] : [],
    },
    organization: lead.company ? { name: lead.company } : undefined,
    note: lead.message,
    source: lead.source ?? 'web',
    add_time: lead.timestamp,
  }
}

function toHubSpotPayload(lead: Lead): Record<string, unknown> {
  return {
    fields: [
      { name: 'firstname', value: lead.name.split(' ')[0] },
      { name: 'lastname', value: lead.name.split(' ').slice(1).join(' ') || '-' },
      { name: 'email', value: lead.email },
      { name: 'phone', value: lead.phone ?? '' },
      { name: 'company', value: lead.company ?? '' },
      { name: 'message', value: lead.message },
    ],
    context: {
      hutk: undefined,
      pageUri: lead.referrer ?? '',
    },
  }
}

function toGenericPayload(lead: Lead): Record<string, unknown> {
  return { ...lead }
}

function buildPayload(lead: Lead, provider: CrmProvider): Record<string, unknown> {
  if (provider === 'pipedrive') return toPipedrivePayload(lead)
  if (provider === 'hubspot') return toHubSpotPayload(lead)
  return toGenericPayload(lead)
}

// ─── Client ───────────────────────────────────────────────────────────────────

export function getCrmConfig(): CrmConfig | null {
  const webhookUrl = import.meta.env.CRM_WEBHOOK_URL
  if (!webhookUrl) return null

  return {
    webhookUrl,
    provider: (import.meta.env.CRM_PROVIDER as CrmProvider) ?? 'generic',
    apiKey: import.meta.env.CRM_API_KEY,
  }
}

export async function sendLeadToCrm(lead: Lead, config: CrmConfig): Promise<CrmResult> {
  const payload = buildPayload(lead, config.provider)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`
  }

  try {
    await $fetch(config.webhookUrl, {
      method: 'POST',
      headers,
      body: payload,
    })
    return { ok: true, provider: config.provider }
  } catch (err) {
    const fe = err instanceof FetchError ? err : null
    return {
      ok: false,
      provider: config.provider,
      statusCode: fe?.response?.status,
      error: fe?.message ?? String(err),
    }
  }
}
