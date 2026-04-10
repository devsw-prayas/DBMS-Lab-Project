// Vercel serverless function — GET/POST /api/tables
// Stub: returns empty tables list. Wire to DB when ready.

export default function handler(req, res) {
  if (req.method === 'GET') {
    // TODO: fetch tables for authenticated user from DB
    return res.status(200).json({ tables: [] })
  }

  if (req.method === 'POST') {
    const { name, columns } = req.body || {}
    if (!name) return res.status(400).json({ message: 'Table name is required' })
    // TODO: insert table into DB
    const table = { id: Date.now().toString(), name, columns: columns || [], rows: [] }
    return res.status(201).json({ table })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
