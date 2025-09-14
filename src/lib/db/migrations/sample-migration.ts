import { db } from '~/lib/pg/connect'
import { nanoid } from 'nanoid'

export async function runSampleMigration(): Promise<void> {
  console.log('Starting sample migration...')

  try {
    // Create a sample company
    const companyId = nanoid()
    console.log(`Creating company with ID: ${companyId}`)

    await db
      .insertInto('companies')
      .values({
        id: companyId,
        name: 'Luke Steinbicker',
        domain: 'lukesteinbicker.com',
        website: 'https://lukesteinbicker.com',
        industry: 'Software Development',
        size: '1-10',
        logo: null,
        address: null,
        city: null,
        state: null,
        country: null,
        zip: null,
        phone: null,
        active: true,
        premium: true,
        premiumExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        settings: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .execute()

    console.log('✅ Company created successfully')

    // Create an embed token for the company
    const embedTokenId = nanoid()
    const embedToken = 'emb_' + nanoid() // Generate a unique embed token
    console.log(`Creating embed token: ${embedToken}`)

    await db
      .insertInto('embedTokens')
      .values({
        id: embedTokenId,
        companyId: companyId,
        token: embedToken,
        name: 'Main Website Token',
        active: true,
        allowedDomains: JSON.stringify(['lukesteinbicker.com', '*.lukesteinbicker.com', 'localhost', 'localhost:4321', 'localhost:3000']), // Allow main domain, subdomains, and localhost
        expiresAt: null, // No expiration
        lastUsedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .execute()
  } catch (error) {
    console.error('Sample migration failed:', error)
    throw error
  } finally {
    await db.destroy()
  }
}

// Run the migration
runSampleMigration()
  .then(() => {
    console.log('Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
