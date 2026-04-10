import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.LAB_POSTGRES_URL)

export default sql
