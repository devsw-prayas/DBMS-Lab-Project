// Vercel serverless function — POST /api/auth/register
// Stub: accepts any details and returns a mock user.
// Replace with real DB insert once database is set up.

export default function handler(req, res) {
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

  // TODO: check if email exists, hash password, insert into database
  const user = { id: Date.now().toString(), email, name }
  return res.status(201).json({ user })
}
