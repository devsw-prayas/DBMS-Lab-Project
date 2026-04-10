import bcrypt from 'bcryptjs'
import sql from '../_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    const rows = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ${email.toLowerCase().trim()}
      LIMIT 1
    `

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const user = rows[0]
    const valid = await bcrypt.compare(password, user.password_hash)

    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    return res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
