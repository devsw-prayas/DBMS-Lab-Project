import { neon } from '@neondatabase/serverless'

// POSTGRES_URL is automatically injected by Vercel when you add a Neon database
const sql = neon(process.env.POSTGRES_URL)

export default sql
