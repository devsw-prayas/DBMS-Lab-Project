import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthForm from '../components/Auth/AuthForm'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      login(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Welcome back"
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
      submitLabel="Sign in"
      fields={[
        { name: 'email', label: 'Email', type: 'email', value: form.email, onChange: handleChange },
        { name: 'password', label: 'Password', type: 'password', value: form.password, onChange: handleChange },
      ]}
      footer={
        <>
          Don't have an account? <Link to="/register">Create one</Link>
        </>
      }
    />
  )
}
