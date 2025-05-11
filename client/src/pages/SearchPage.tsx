// src/pages/SearchPage.tsx
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { filterRooms, RoomAvailabilityResponse } from '../api/rooms'
import room1 from '../assets/room1.png'
import room2 from '../assets/room2.png'
import room3 from '../assets/room3.png'
import cartIcon from '../assets/cart.png'
import userIcon from '../assets/user.png'
import personIcon from '../assets/person.png'

const images: Record<string, string> = {
  classic: room1,
  deluxe:  room2,
  executive: room3,
}

// how many characters before we truncate
const MAX_DESC = 130

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // read initial values from the URL
  const initGuests   = Number(searchParams.get('guests')  || '1')
  const initCheckin  = searchParams.get('checkin')  || ''
  const initCheckout = searchParams.get('checkout') || ''

  const [guests,   setGuests]   = useState(initGuests)
  const [checkin,  setCheckin]  = useState(initCheckin)
  const [checkout, setCheckout] = useState(initCheckout)

  const [rooms,   setRooms]    = useState<RoomAvailabilityResponse[]>([])
  const [loading, setLoading]  = useState(false)
  const [error,   setError]    = useState<string|null>(null)

  // whenever filters change, refetch and update URL
  useEffect(() => {
    if (!checkin || !checkout) return
    setLoading(true)
    setError(null)

    filterRooms({ guests, checkin, checkout })
      .then(r => setRooms(r.data))
      .catch(err => setError(err.response?.data?.detail || 'Failed to load rooms'))
      .finally(() => setLoading(false))

    setSearchParams({ guests: String(guests), checkin, checkout })
  }, [guests, checkin, checkout, setSearchParams])

  // only format dates for date inputs
  const today   = new Date().toISOString().split('T')[0]
  const minOut  = checkin
    ? new Date(new Date(checkin).getTime() + 86400000).toISOString().split('T')[0]
    : today

  // when user clicks “Search” button
  const onSearch = () => {
    if (!checkin || !checkout) {
      alert('Please select both check-in and check-out.')
    }
    // effect will run
  }

  return (
    <div style={styles.page}>
      {/* — Sticky filter bar — */}
      <div style={styles.fixedTop}>
        <div style={styles.topbar}>
        <span style={styles.arrow} onClick={() => navigate("/home")}>ᐸ</span>
        <div style={styles.icons}>
        <img
            src={cartIcon}
            alt="cart"
            style={styles.icon28}
            onClick={() => navigate("/cart")}
          />
            <img
      src={userIcon}
      alt="user"
      style={styles.icon}
      onClick={() => navigate('/user')}
    />
          </div>
        </div>

        <div style={styles.searchBox}>
          <div style={styles.guestInput}>
            <img src={personIcon} alt="guests" style={styles.personIcon}/>
            <select
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              style={styles.dropdown}
            >
              {[1,2,3,4,5].map(n =>
                <option key={n} value={n}>
                  {n} guest{n>1?'s':''}
                </option>
              )}
            </select>
          </div>

          <div style={styles.dateRow}>
            <div style={styles.dateGroup}>
              <label style={styles.label}>Check in</label>
              <input
                type="date"
                value={checkin}
                min={today}
                onChange={e => {
                  setCheckin(e.target.value)
                  if (checkout && e.target.value >= checkout) {
                    setCheckout('')
                  }
                }}
                style={styles.dateInput}
              />
            </div>
            <div style={styles.dateGroup}>
              <label style={styles.label}>Check out</label>
              <input
                type="date"
                value={checkout}
                min={minOut}
                disabled={!checkin}
                onChange={e => setCheckout(e.target.value)}
                style={styles.dateInput}
              />
            </div>
          </div>

          <button style={styles.searchButton} onClick={onSearch}>
            Search
          </button>
        </div>
      </div>

      {/* — Results list — */}
      <div style={styles.scrollSection}>
        {loading
          ? <p style={styles.message}>Loading availability…</p>
          : error
            ? <p style={{...styles.message, color:'#FF3E3E'}}>{error}</p>
            : rooms.length === 0
              ? <p style={styles.message}>No rooms available for selected dates.</p>
              : rooms.map(r => {
                  // truncate to one paragraph
                  let txt = r.description.replace(/\n/g,' ')
                  if (txt.length > MAX_DESC) {
                    txt = txt.slice(0, MAX_DESC).trimEnd() + '…'
                  }

                  const key = r.type_id
                  const imgKey = r.type.toLowerCase().split(' ')[0]

                  const goBook = () =>
                    navigate(
                      `/room?type=${key}`
                      + `&checkin=${checkin}`
                      + `&checkout=${checkout}`
                      + `&guests=${guests}`
                    )

                  return (
                    <div key={key} style={styles.card} onClick={goBook}>
                      <div style={styles.titleRow}>
                        <h3 style={styles.title}>{r.type}</h3>
                        <span style={styles.arrow} onClick={e => {
                          e.stopPropagation()
                          goBook()
                        }}>ᐳ</span>
                      </div>
                      <div style={styles.contentRow}>
                        <img
                          src={images[imgKey]}
                          alt={r.type}
                          style={styles.image}
                        />
                        <p style={styles.summary}>{txt}</p>
                      </div>
                      <p style={styles.remaining}>Remaining: {r.remaining}</p>
                    </div>
                  )
                })
        }
      </div>
    </div>
  )
}

export default SearchPage

const styles: { [k:string]: React.CSSProperties } = {
  page: {
    background: 'linear-gradient(to bottom, #FFFFFF 30%, #B1EAF0 90%)',
    minHeight: '100vh'
  },
  fixedTop: {
    position: 'sticky',
    top: 10,
    zIndex: 10,
    padding: '20px 25px',
    background: '#FFFFFF'
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    background: '#FFFFFF'
  },
  back: {
    width: 24,
    cursor: 'pointer'
  },
  icons: {
    display: 'flex',
    gap: 12
  },
  icon28: {
    width:   28,
    height:  28,
    cursor:  "pointer",
  },
  icon: {
    width: 28,
    height: 28
  },

  searchBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center'
  },
  guestInput: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    padding: '10px 16px',
    borderRadius: 20,
    border: '1px solid #231F1F',
    background: '#fff',
    marginTop: 10
  },
  personIcon: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  dropdown: {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    flex: 1,
    background: 'transparent'
  },
  dateRow: {
    display: 'flex',
    gap: 10,
    width: '100%',
    maxWidth: 350,
    justifyContent: 'center'
  },
  dateGroup: {
    flex: 1
  },
  label: {
    display: 'block',
    fontSize: 14,
    color: '#231F1F',
    marginBottom: 4
  },
  dateInput: {
    width: '100%',
    padding: '10px 16px',
    fontSize: 16,
    borderRadius: 20,
    border: '1px solid #231F1F',
    background: '#fff',
    boxSizing: 'border-box'
  },
  searchButton: {
    width: '100%',
    maxWidth: 350,
    padding: '12px 24px',
    borderRadius: 20,
    border: '1px solid #231F1F',
    backgroundColor: '#6DD3D4',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 15,
  },

  scrollSection: {
    padding: '20px 16px 60px'
  },
  message: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#231F1F'
  },

  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '8px 14px 0px',
    marginBottom: 20,
    border: '1px solid #231F1F',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 20,
    fontWeight: 300,
    color: '#231F1F',
    margin: 0
  },
  arrow: {
    fontSize: 17,
    cursor: 'pointer',
  },

  contentRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start'
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 10,
    objectFit: 'cover'
  },
  summary: {
    flex: 1,
    fontSize: 14,
    color: '#231F1F',
    margin: 0,
    lineHeight: '1.4em',
    maxHeight: '5.6em',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  remaining: {
    marginTop: 8,
    fontSize: 14,
    color: '#6DD3D4'
  }
}