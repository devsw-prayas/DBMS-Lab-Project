import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/Auth/AuthForm'

export default function Register() {
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      login(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Create account"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Create account"
      fields={[
        { name: 'name', label: 'Name', type: 'text', value: form.name, onChange: handleChange },
        { name: 'email', label: 'Email', type: 'email', value: form.email, onChange: handleChange },
        { name: 'password', label: 'Password', type: 'password', value: form.password, onChange: handleChange },
      ]}
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    />
  )
}
