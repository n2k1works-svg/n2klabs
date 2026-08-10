// One-off script: applies the Prisma-generated schema SQL to Turso.
// Run with: DATABASE_URL=libsql://... bun run scripts/apply-schema-to-turso.ts
import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const sql = readFileSync('/tmp/schema.sql', 'utf8')

// Split on semicolons that are at the end of a line.
// Then strip out SQL comment lines (-- ...) from each statement.
const statements = sql
  .split(/;\n/)
  .map((s) =>
    s
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n')
      .trim(),
  )
  .filter((s) => s.length > 0)

console.log(`[apply-schema] Connecting to Turso...`)
console.log(`[apply-schema] URL: ${url.replace(/\?authToken=.*/, '')}`)
console.log(`[apply-schema] ${statements.length} statements to execute`)
console.log()

const client = createClient({ url })

let ok = 0
let skipped = 0
let failed = 0
for (const stmt of statements) {
  const preview = stmt.replace(/\s+/g, ' ').slice(0, 80)
  try {
    await client.execute(stmt)
    ok++
    console.log(`  ✅ ${preview}`)
  } catch (e: any) {
    if (e.message && /already exists/i.test(e.message)) {
      skipped++
      console.log(`  ⏭️  ${preview} (already exists)`)
    } else {
      failed++
      console.error(`  ❌ ${preview}`)
      console.error(`     ${e.message}`)
    }
  }
}

console.log()
console.log(`[apply-schema] Done. ${ok} created, ${skipped} already existed, ${failed} failed.`)
process.exit(failed > 0 ? 1 : 0)
