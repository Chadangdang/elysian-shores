// src/pages/UserPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, User } from '../api/auth'

const UserPage: React.FC = () => {
  const navigate = useNavigate()
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    getProfile()
      .then(res => setUser(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) return <p style={styles.message}>Loading profile…</p>
  if (error)   return <p style={{ ...styles.message, color:'#FF3E3E' }}>{error}</p>

  return (
    <div style={styles.page}>
      {/* ——— Header ——— */}
      <div style={styles.header} onClick={() => navigate(-1)}>
        <span style={styles.arrow}>ᐸ</span>
      </div>

      <h2 style={styles.title}>Profile</h2>

      <div style={styles.form}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={user!.username}
          readOnly
          style={styles.input}
        />

        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={user!.fullName}
          readOnly
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={user!.email}
          readOnly
          style={styles.input}
        />
      </div>

      <button
          style={styles.myBookingBtn}
          onClick={e => {
            e.stopPropagation()
            navigate('/my-bookings')
          }}
        >
          My Booking
        </button>

      <button style={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  )
}

export default UserPage

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    position: 'relative',
    padding: '60px 20px 20px',
    maxWidth: 400,
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
  },
  header: {
    position: 'absolute',
    top: 30,
    left: 18,
    right: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    zIndex: 10,
  },
  arrow: {
    fontSize: 17,
    color: '#231F1F',
  },
  myBookingBtn: {
       marginTop: 30,                  
       padding: '12px 16px',
       fontSize: 16,
       borderRadius: 15,
       backgroundColor: '#6DD3D4',     
       color: '#FFFFFF',
       border: 'none',
       cursor: 'pointer',
       width: '100%',             
       boxSizing: 'border-box',
     },

  title: {
    textAlign: 'center',
    fontSize: 26,
    marginTop: 40,
    marginBottom: 32,
    color: '#231F1F',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: '#231F1F',
    marginBottom: 6,
  },
  input: {
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 15,
    border: '1px solid #231F1F',
    backgroundColor: '#F7F7F7',
    width: '100%',
    boxSizing: 'border-box',
  },
  logoutBtn: {
    marginTop: 20,
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 15,
    backgroundColor: '#FF3E3E',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
  message: {
    textAlign: 'center',
    marginTop: 100,
    color: '#231F1F',
  },
}