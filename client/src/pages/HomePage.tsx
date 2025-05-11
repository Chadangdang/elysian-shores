import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import room1 from '../assets/room1.png';
import room2 from '../assets/room2.png';
import room3 from '../assets/room3.png';
import cart from '../assets/cart.png';
import user from '../assets/user.png';
import person from '../assets/person.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  // Calculate today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

   // Calculate minimum checkout date (day after selected check-in)
   const nextDay = checkin
    ? new Date(new Date(checkin).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
    : today;

  const rooms = [
    {
      type: 'Classic Room',
      description: [
        '30 sq.m of cozy space with earthy tones and natural textures',
        'Perfect for solo travelers or couples seeking a peaceful stay',
      ],
      image: room1,
    },
    {
      type: 'Deluxe Suite',
      description: [
        '65 sq.m of spacious comfort for families or groups',
        'Two separate bedrooms with flexible bed options',
        'Dedicated living area for relaxing or entertaining',
        'Fully equipped kitchen, microwave, refrigerator, and washing machine',
      ],
      image: room2,
    },
    {
      type: 'Executive Suite',
      description: [
        '90 sq.m for elevated comfort',
        'Separate living and dining areas',
        'Two luxurious bedrooms with deluxe bedding',
        'Full kitchen, upscale amenities, and workspace',
        'Tailored for extended stays, executives, or families',
      ],
      image: room3,
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.fixedTop}>
        <div style={styles.topbar}>
          <div style={styles.welcomeText}>
            <span style={styles.welcome}>Welcome to</span>
            <br />
            <span style={styles.brand}>ELYSIAN SHORES,</span>
          </div>
          <div style={styles.icons}>
          <img
            src={cart}
            alt="cart"
            style={styles.icon28}
            onClick={() => navigate("/cart")}
          />
            <img
      src={user}
      alt="user"
      style={styles.icon}
      onClick={() => navigate('/user')}
    />
          </div>
        </div>

        <div style={styles.searchBox}>
          <div style={styles.guestInput}>
            <img src={person} alt="person" style={styles.personIcon} />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              style={styles.dropdown}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div style={styles.dateRow}>
            <div style={styles.dateGroup}>
              <label style={styles.label}>Check in</label>
              <input
                type="date"
                value={checkin}
                min={today}
                onChange={(e) => {
                  setCheckin(e.target.value);
                  if (checkout && e.target.value >= checkout) {
                    setCheckout('');
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
                onChange={(e) => setCheckout(e.target.value)}
                style={styles.dateInput}
                disabled={!checkin}
                min={nextDay}
              />
            </div>
          </div>

          <button
            style={styles.searchButton}
            onClick={() => {
              if (!checkin || !checkout) {
                alert('Please select both check-in and check-out dates.');
                return;
              }
              navigate(`/search?guests=${guests}&checkin=${checkin}&checkout=${checkout}`);
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div style={styles.scrollSection}>
        {rooms.map((room) => (
          <div key={room.type} style={styles.card}>
            <h3 style={styles.roomTitle}>{room.type}</h3>
            <img src={room.image} alt={room.type} style={styles.roomImage} />
            <ul style={styles.roomDesc}>
              {room.description.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;


const styles: { [key: string]: React.CSSProperties } = {
    page: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, #FFFFFF 30%, #B1EAF0 90%)',
        fontFamily: 'Arial, sans-serif',
      },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginRight: 9,
  },
  welcomeText: {
    lineHeight: 1.2,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 200,
    color: '#231F1F',
  },
  brand: {
    fontSize: 28,
    fontWeight: 400,
    color: '#6DD3D4',
    letterSpacing: 1,
  },
  icons: {
    display: 'flex',
    gap: 12,
  },
  icon: {
    width: 28,
    height: 28,
  },
  icon28: {
    width:   28,
    height:  28,
    cursor:  "pointer",
  },
  personIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  guestInput: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    borderRadius: 20,
    border: '1px solid #231F1F',
    padding: '10px 16px',
    background: '#fff',
  },
  dropdown: {
    border: 'none',
    fontSize: 16,
    flex: 1,
    outline: 'none',
    background: 'transparent',
  },
  dateRow: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
  },
  dateGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#231F1F',
    marginBottom: 4,
    display: 'block',
  },
  dateInput: {
    width: '100%',
    padding: '10px 16px',
    fontSize: 16,
    borderRadius: 20,
    border: '1px solid #231F1F',
    background: '#fff',
    boxSizing: 'border-box',
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: '#6DD3D4',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 20,
    border: '1px solid #231F1F',
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
    maxWidth: 350,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding:'0px 14px 14px',
    marginBottom: 20,
    border: '1px solid #231F1F',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 300,
    marginBottom: 5,
    color: '#231F1F',
  },
  roomImage: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 5,
  },
  roomDesc: {
    fontSize: 14,
    paddingLeft: 18,
    color: '#231F1F',
  },
  fixedTop: {
    padding: '30px 16px 0',
    backgroundColor: 'transparent',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  scrollSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px 60px',
  },

};