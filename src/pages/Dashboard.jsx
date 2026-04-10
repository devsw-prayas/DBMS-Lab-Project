import React from 'react'
import { useAuth } from '../context/AuthContext'
import TableBuilder from '../components/Table/TableBuilder'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>TableApp</div>
        <div className={styles.userArea}>
          <span className={styles.userName}>{user?.name || user?.email}</span>
          <button className={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h2>My Table</h2>
          <p>Click a column name to rename it. Use the buttons to add or remove columns and rows.</p>
        </div>
        <TableBuilder />
      </main>
    </div>
  )
}
