import React from 'react'
import styles from './AuthForm.module.css'

export default function AuthForm({
  title,
  fields,
  onSubmit,
  submitLabel,
  footer,
  error,
  loading,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={onSubmit} className={styles.form}>
          {fields.map(({ name, label, type = 'text', value, onChange }) => (
            <div key={name} className={styles.field}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required
                autoComplete={name}
              />
            </div>
          ))}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </form>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}
