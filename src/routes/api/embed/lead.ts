import { createServerFileRoute } from '@tanstack/react-start/server'
import { db } from '~/lib/pg/connect'
import { nanoid } from 'nanoid'

export const ServerRoute = createServerFileRoute('/api/embed/lead').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      return await createLead(body)
    } catch (error) {
      console.error('Lead API error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
})

// Create lead entry
async function createLead(body: { companyId: string; visitorId: string; status: string }) {
  const { companyId, visitorId, status } = body

  if (!companyId || !visitorId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const leadId = nanoid()

    await db
      .insertInto('leads')
      .values({
        id: leadId,
        companyId,
        visitorId,
        status: status || 'open',
        claimedBy: null,
        claimAt: null,
        slackId: null,
        callId: null,
        callStatus: 'not_started',
        notes: null
      })
      .execute()

    return new Response(JSON.stringify({ 
      success: true,
      leadId,
      message: 'Lead created successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Lead creation error:', error)
    return new Response(JSON.stringify({ error: 'Failed to create lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
