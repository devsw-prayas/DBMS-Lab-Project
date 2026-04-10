import bcrypt from 'bcryptjs'
import sql from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password } = req.body || {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `

    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with that email already exists' })
    }

    const password_hash = await bcrypt.hash(password, 10)

    const rows = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${password_hash})
      RETURNING id, name, email
    `

    return res.status(201).json({ user: rows[0] })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
