import { createServerFileRoute } from '@tanstack/react-start/server'
import { db } from '~/lib/pg/connect'
import { nanoid } from 'nanoid'

export const ServerRoute = createServerFileRoute('/api/embed/visitor').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      return await createVisitor(body, request)
    } catch (error) {
      console.error('Embed API error:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
})

// Create visitor entry
async function createVisitor(body: any, request: Request) {
  const {
    companyId,
    sessionId,
    ipAddress,
    userAgent,
    referrer,
    utmParams,
    currentPage,
    online,
    startedAt,
    lastActivity
  } = body

  if (!companyId || !sessionId) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Get real IP address from request headers
    const realIpAddress = request.headers.get('x-forwarded-for') || 
                         request.headers.get('x-real-ip') || 
                         '127.0.0.1'

    const visitorId = nanoid()

    await db
      .insertInto('visitors')
      .values({
        id: visitorId,
        companyId,
        sessionId,
        ipAddress: realIpAddress,
        userAgent,
        referrer,
        utmParams,
        enriched: false,
        enrichmentData: null,
        currentPage,
        online,
        startedAt: new Date(startedAt),
        lastActivity: new Date(lastActivity)
      })
      .execute()

    return new Response(JSON.stringify({ 
      success: true,
      visitorId,
      message: 'Visitor tracked successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Visitor creation error:', error)
    return new Response(JSON.stringify({ error: 'Failed to create visitor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
