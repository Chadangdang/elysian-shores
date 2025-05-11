import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { format, differenceInCalendarDays } from 'date-fns'
import room1 from '../assets/room1.png'
import room2 from '../assets/room2.png'
import room3 from '../assets/room3.png'

interface Booking {
  id: number
  roomTypeId: string
  checkinDate: string  // ISO Z string
  checkoutDate: string // ISO Z string
  guests: number
  createdAt: string
}

const IMAGES: Record<string, string> = {
  room_1: room1,
  room_2: room2,
  room_3: room3,
}

const NAMES: Record<string, string> = {
  room_1: 'Classic Room',
  room_2: 'Deluxe Suite',
  room_3: 'Executive Suite',
}

// Helper to convert an ISO Z string to a local Date at midnight
const toLocalDate = (isoZ: string) => {
  const [ymd] = isoZ.split('T')
  // new Date("YYYY-MM-DD") creates local midnight
  return new Date(ymd)
}

export default function MyBookingPage() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') || ''
  const headers = { Authorization: `Bearer ${token}` }

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<Booking | null>(null)
  const [canceling, setCanceling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  // Fetch bookings on mount
  useEffect(() => {
    axios
      .get<Booking[]>('https://elysian-shores-api.onrender.com/bookings', { headers })
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  // Cancel a booking
  const handleCancel = (id: number) => {
    setCanceling(true)
    setCancelError(null)
    axios
      .delete(`https://elysian-shores-api.onrender.com/bookings/${id}`, { headers })
      .then(() => {
        setBookings(bs => bs.filter(b => b.id !== id))
        setSelected(null)
      })
      .catch(() => setCancelError('Cancel failed'))
      .finally(() => setCanceling(false))
  }

  if (loading) return <p style={styles.message}>Loading bookings…</p>
  if (error)   return <p style={{ ...styles.message, color: '#FF3E3E' }}>{error}</p>

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.back} onClick={() => navigate(-1)}>ᐸ</span>
        <span style={styles.completed} onClick={() => navigate('/home')}>Completed</span>
      </div>

      <h2 style={styles.title}>Your Booking</h2>

      {/* Booking Cards or Empty State */}
      {bookings.length === 0 ? (
        <p style={styles.message}>You don't have any bookings yet.</p>
      ) : (
        bookings.map(b => {
          const ciLocal = toLocalDate(b.checkinDate)
          const coLocal = toLocalDate(b.checkoutDate)
          const nights = differenceInCalendarDays(coLocal, ciLocal)

          return (
            <div key={b.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span>ID: {b.id.toString().padStart(4, '0')}</span>
                <span>Booked: {format(new Date(b.createdAt), 'PPP')}</span>
              </div>
              <h3 style={styles.roomName}>{NAMES[b.roomTypeId] || b.roomTypeId}</h3>
              <img src={IMAGES[b.roomTypeId] || room1} alt="room" style={styles.image} />
              <div style={styles.info}>
                <p>Check in {format(ciLocal, 'EEE, MMM d')}</p>
                <p>Check out {format(coLocal, 'EEE, MMM d')}</p>
                <p>
                  {nights} Night{nights > 1 ? 's' : ''}, {b.guests} Person{b.guests > 1 ? 's' : ''}
                </p>
              </div>
              <button style={styles.manageBtn} onClick={() => setSelected(b)}>
                Manage Booking
              </button>
            </div>
          )
        })
      )}

      {/* Manage Modal */}
      {selected && (
        <div style={styles.modalBackdrop} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span>ID: {selected.id.toString().padStart(4, '0')}</span>
              <span style={styles.close} onClick={() => setSelected(null)}>✕</span>
            </div>
            <h3 style={styles.modalTitle}>{NAMES[selected.roomTypeId]}</h3>
            <p>Booked: {format(new Date(selected.createdAt), 'PPP')}</p>
            <img src={IMAGES[selected.roomTypeId] || room1} alt="room" style={styles.modalImage} />
            <div style={styles.modalInfo}>
              <p>Check in {format(toLocalDate(selected.checkinDate), 'EEE, MMM d')}</p>
              <p>Check out {format(toLocalDate(selected.checkoutDate), 'EEE, MMM d')}</p>
              <p>
                {differenceInCalendarDays(
                  toLocalDate(selected.checkoutDate),
                  toLocalDate(selected.checkinDate)
                )} Night{differenceInCalendarDays(
                  toLocalDate(selected.checkoutDate),
                  toLocalDate(selected.checkinDate)
                ) > 1 ? 's' : ''}, {selected.guests} Person{selected.guests > 1 ? 's' : ''}
              </p>
            </div>
            {cancelError && <p style={styles.cancelError}>{cancelError}</p>}
            <button
              style={styles.cancelBtn}
              onClick={() => handleCancel(selected.id)}
              disabled={canceling}
            >
              {canceling ? 'Cancelling…' : 'Cancel Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [k: string]: React.CSSProperties } = {
  page: { position: 'relative', padding: '31.5px 18px 20px', maxWidth: 400, margin: '0 auto', background: '#fff', minHeight: '100vh', boxSizing: 'border-box' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center',
    marginBottom:12,position: 'sticky',
    top: 10},
  back: { fontSize: 17, color: '#231F1F', cursor: 'pointer' },
  completed: { fontSize: 16, color: '#231F1F', cursor: 'pointer', textDecoration: 'underline' },
  title: { textAlign: 'center', fontSize: 26, marginTop: 20, marginBottom: 24, color: '#231F1F' },
  card: { border: '1px solid #231F1F', borderRadius: 16, padding: 12, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: '#888' },
  roomName: { margin: 0, fontSize: 18, color: '#231F1F' },
  image: { width: '100%', height: 120, borderRadius: 10, objectFit: 'cover', margin: '12px 0' },
  info: { fontSize: 14, color: '#231F1F', lineHeight: 1.4 },
  manageBtn: { marginTop: 12, width: '100%', padding: '12px 16px', fontSize: 16, borderRadius: 20, backgroundColor: '#6DD3D4', color: '#fff', border: 'none', cursor: 'pointer' },
  modalBackdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modal: { background: '#fff', borderRadius: 16, padding: 20, width: '90%', maxWidth: 360, boxSizing: 'border-box', position: 'relative' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: '#888' },
  close: { cursor: 'pointer', fontSize: 18 },
  modalTitle: { margin: '8px 0', fontSize: 20, color: '#231F1F' },
  modalImage: { width: '100%', height: 120, borderRadius: 10, objectFit: 'cover', margin: '12px 0' },
  modalInfo: { fontSize: 14, color: '#231F1F', lineHeight: 1.4, marginBottom: 12 },
  cancelBtn: { width: '100%', padding: '12px 16px', fontSize: 16, borderRadius: 20, backgroundColor: '#FF3E3E', color: '#fff', border: 'none', cursor: 'pointer' },
  cancelError: { color: '#FF3E3E', fontSize: 14, textAlign: 'center', marginBottom: 8 },
  message: { textAlign: 'center', marginTop: 100, color: '#231F1F' },
}