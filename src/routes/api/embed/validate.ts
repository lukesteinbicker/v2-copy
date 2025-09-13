import { createFileRoute } from '@tanstack/react-router'
import { db } from '~/lib/pg/connect'

export const Route = createFileRoute('/api/embed/validate')({
  component: () => null,
})

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    return await validateEmbedToken(body)
  } catch (error) {
    console.error('Embed API error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Validate embed token and return company ID
async function validateEmbedToken(body: { embedToken: string; domain: string; referrer: string }) {
  const { embedToken, domain, referrer } = body

  if (!embedToken || !domain) {
    return new Response(JSON.stringify({ error: 'Token and domain required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Validate against embed tokens table
    const embedTokenRecord = await db
      .selectFrom('embedTokens')
      .innerJoin('companies', 'companies.id', 'embedTokens.companyId')
      .select(['embedTokens.companyId', 'embedTokens.allowedDomains', 'embedTokens.expiresAt'])
      .where('embedTokens.token', '=', embedToken)
      .where('embedTokens.active', '=', true)
      .where('companies.active', '=', true)
      .executeTakeFirst()

    if (!embedTokenRecord) {
      return new Response(JSON.stringify({ error: 'Invalid or inactive token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if token has expired
    if (embedTokenRecord.expiresAt && new Date() > embedTokenRecord.expiresAt) {
      return new Response(JSON.stringify({ error: 'Token has expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check domain restrictions if they exist
    if (embedTokenRecord.allowedDomains && Array.isArray(embedTokenRecord.allowedDomains)) {
      const allowedDomains = embedTokenRecord.allowedDomains
      const isDomainAllowed = allowedDomains.some(allowedDomain => {
        // Support both exact matches and wildcard subdomains
        if (allowedDomain.startsWith('*.')) {
          const baseDomain = allowedDomain.substring(2)
          return domain === baseDomain || domain.endsWith('.' + baseDomain)
        }
        return domain === allowedDomain
      })

      if (!isDomainAllowed) {
        return new Response(JSON.stringify({ error: 'Domain not authorized for this token' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Update last used timestamp
    await db
      .updateTable('embedTokens')
      .set({ lastUsedAt: new Date() })
      .where('token', '=', embedToken)
      .execute()

    return new Response(JSON.stringify({ 
      companyId: embedTokenRecord.companyId,
      valid: true 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return new Response(JSON.stringify({ error: 'Validation failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
