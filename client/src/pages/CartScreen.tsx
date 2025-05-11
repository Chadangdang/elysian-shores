// src/pages/CartScreen.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { format } from 'date-fns'

import room1 from '../assets/room1.png'
import room2 from '../assets/room2.png'
import room3 from '../assets/room3.png'
import binIcon from '../assets/bin.png'
import userIcon from '../assets/user.png'

interface CartItem {
  type_id:   string
  type:      string
  checkin:   string  // "YYYY-MM-DD"
  checkout:  string  // "YYYY-MM-DD"
  guests:    number
  price:     number  // per-night price
}

const IMAGES: Record<string,string> = {
  room_1: room1,
  room_2: room2,
  room_3: room3,
}

const toUtc17 = (d: string) => `${d}T17:00:00.000Z`

export default function CartScreen() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token') || ''

  // Cart from localStorage
  const [cart, setCart] = useState<CartItem[]>([])
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]')
    setCart(stored)
  }, [])

  // Remove item
  const removeItem = (idx: number) => {
    const next = [...cart]
    next.splice(idx, 1)
    setCart(next)
    localStorage.setItem('cart', JSON.stringify(next))
  }

  // Attach nights+lineTotal
  const itemsWithTotals = cart.map(item => {
    const nights =
      Math.round(
        (new Date(item.checkout).getTime() - new Date(item.checkin).getTime()) /
        (1000*60*60*24)
      )
    const lineTotal = item.price * nights
    return { ...item, nights, lineTotal }
  })

  // Grand total
  const grandTotal = itemsWithTotals.reduce((sum, i) => sum + i.lineTotal, 0)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string|null>(null)

  // Confirm booking
  const onConfirm = async () => {
    setLoading(true)
    setError(null)
    const payload = {
      items: itemsWithTotals.map(i => ({
        type_id:  i.type_id,
        checkin:  toUtc17(i.checkin),
        checkout: toUtc17(i.checkout),
        guests:   i.guests,
      }))
    }
    console.log('booking payload:', payload)
    try {
      await axios.post(
        'https://elysian-shores-api.onrender.com/bookings/confirm',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // clear cart & close
      localStorage.removeItem('cart')
      setCart([])
      setShowModal(false)
      alert('Booking successful!')
      navigate('/my-bookings')
    } catch (e:any) {
      setError(e.response?.data?.detail || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  // date formatter
  const fmt = (s: string) =>
    format(new Date(s), 'EEE, MMM d')

  return (
    <div style={styles.page}>

      {/* — Top bar — */}
      <div style={styles.topbar}>
        <div style={styles.backBtn} onClick={() => navigate(-1)}>
          <span style={styles.arrow}>ᐸ</span>
        </div>
        <img
          src={userIcon}
          alt="user"
          style={styles.icon24}
          onClick={() => navigate('/user')}
        />
      </div>

      {/* — Cart list — */}
      <div style={styles.scroll}>
        {itemsWithTotals.length === 0
          ? <p style={styles.empty}>Your cart is empty.</p>
          : itemsWithTotals.map((item, i) => (
            <div key={i} style={styles.card}>
              <img
                src={IMAGES[item.type_id] || room1}
                alt={item.type}
                style={styles.image}
              />
              <div style={styles.info}>
                <h3 style={styles.title}>{item.type}</h3>
                <p style={styles.meta}>
                  Check in {fmt(item.checkin)}<br/>
                  Check out {fmt(item.checkout)}<br/>
                  {item.nights} Night{item.nights>1?'s':''}, {item.guests} Person{item.guests > 1 ? 's' : ''}
                </p>
                <p style={styles.price}>
                  {item.price.toLocaleString()} Baht × {item.nights} ={' '}
                  <strong>{item.lineTotal.toLocaleString()} Baht</strong>
                </p>
              </div>
              <img
                src={binIcon}
                alt="remove"
                style={styles.bin}
                onClick={() => removeItem(i)}
              />
            </div>
          ))
        }
      </div>

      {/* — Footer w/ Booking button — */}
      {itemsWithTotals.length > 0 && (
        <div style={styles.footer}>
          <span style={styles.total}>
            Total: <strong>{grandTotal.toLocaleString()} Baht</strong>
          </span>
          <button
            style={styles.bookBtn}
            onClick={() => setShowModal(true)}
          >
            Booking
          </button>
        </div>
      )}

      {/* — Modal Overlay — */}
      {showModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Checkout</h2>

            {itemsWithTotals.map((item,i) => (
              <div key={i} style={styles.modalItem}>
                <span style={styles.modalRoom}>{item.type}</span>
                <span style={styles.modalLineTotal}>
                  {item.price.toLocaleString()} Baht × {item.nights} ={' '}
                  {item.lineTotal.toLocaleString()} Baht
                </span>
                <p style={styles.modalMeta}>
                  Check in {fmt(item.checkin)}<br/>
                  Check out {fmt(item.checkout)}<br/>
                  {item.nights} Night{item.nights>1?'s':''}, {item.guests} Person{item.guests > 1 ? 's' : ''}
                </p>
                {i < itemsWithTotals.length-1 && <hr style={styles.modalDivider}/>}
              </div>
            ))}

            <p style={styles.modalTotal}>
              Total: {grandTotal.toLocaleString()} Baht
            </p>

            {error && <p style={styles.modalError}>{error}</p>}

            <button
              style={styles.modalConfirm}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>

            <span
              style={styles.modalClose}
              onClick={() => setShowModal(false)}
            >✕</span>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: {[k:string]:React.CSSProperties} = {
  page: {
    padding: '21px 16px', background:'#FFF', minHeight:'100vh',
    display:'flex', flexDirection:'column',marginTop:9
  },

  topbar: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    marginBottom:12,position:       'sticky',
    top: 20
  },
  arrow: { fontSize:17, color:'#231F1F',marginLeft:9},
  icon24:{ width:28, height:28, cursor:'pointer',marginRight:9},

  scroll: { flex:1, overflowY:'auto' },
  empty: { textAlign:'center', marginTop:50, color:'#888' },

  card: {
    display:'flex', alignItems:'center',
    background:'#fff', borderRadius:16,
    border:'1px solid #231F1F',
    boxShadow:'0 2px 6px rgba(0,0,0,0.1)',
    padding:12, marginBottom:16, marginTop:12
  },
  image: { width:120, height:80, borderRadius:10, objectFit:'cover' },
  info: { flex:1, marginLeft:12 },
  title: { margin:0, fontSize:18, color:'#231F1F' },
  meta: { margin:'6px 0', fontSize:14, color:'#231F1F', lineHeight:1.4 },
  price:{ margin:0, fontSize:14, color:'#231F1F' },
  bin:{ width:20, height:20, cursor:'pointer', marginLeft:8 },

  footer: {
    borderTop:'1px solid #ddd',
    paddingTop:12, justifyContent:'space-between', alignItems:'center',
    marginBottom:12,position:       'sticky',
    bottom:0, background:'#fff'

  },
  total: {
    display:'block', textAlign:'center',
    fontSize:18, marginBottom:12
  },
  bookBtn: {
    width:'100%', padding:'14px',
    backgroundColor:'#6DD3D4', color:'#fff',
    border:'none', borderRadius:20,
    fontSize:16, cursor:'pointer'
  },

  // ─────── Modal Styles ───────
  modalBackdrop: {
    position:'fixed', top:0, left:0, right:0, bottom:0,
    background:'rgba(0,0,0,0.3)',
    display:'flex', justifyContent:'center', alignItems:'center',
    zIndex:999
  },
  modal: {
    position: 'relative',
    width: '90%',
    maxWidth: 360,
    /* cap at 70% of viewport height */
    maxHeight: '70vh',
    background: '#fff',
    borderRadius: 16,
    padding: '20px 18px 10px',
    boxSizing: 'border-box',
    /* enable scrolling if content overflows */
    overflowY: 'auto',
  },
  modalTitle: {
    textAlign:'center', margin:0, fontSize:20, marginBottom:16
  },
  modalItem: { marginBottom:16 },
  modalRoom: {
    fontSize:18, fontWeight:500, color:'#231F1F',
    display:'inline-block'
  },
  modalLineTotal: {
    float:'right', fontSize:16, color:'#231F1F'
  },
  modalMeta: {
    fontSize:14, color:'#231F1F', lineHeight:1.4, margin:'8px 0'
  },
  modalDivider: {
    border:'none', borderTop:'1px solid #ddd', margin:'8px 0'
  },
  modalTotal: {
    textAlign:'center', fontSize:18, marginBottom:16
  },
  modalError: {
    textAlign:'center', color:'#FF3E3E', marginBottom:8
  },
  modalConfirm: {
    width:'100%', padding:'12px',
    backgroundColor:'#6DD3D4', color:'#fff',
    border:'none', borderRadius:20,
    fontSize:16, cursor:'pointer'
  },
  modalClose: {
    position:'absolute', top:12, right:12,
    fontSize:18, cursor:'pointer', color:'#888'
  }
}
