// Vercel serverless function — POST /api/auth/login
// Stub: accepts any credentials and returns a mock user.
// Replace with real DB lookup once database is set up.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  // TODO: verify against database
  const user = { id: '1', email, name: email.split('@')[0] }
  return res.status(200).json({ user })
}
