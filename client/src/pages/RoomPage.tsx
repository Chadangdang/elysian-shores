// src/pages/RoomPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { filterRooms, RoomAvailabilityResponse } from "../api/rooms";

import room1     from "../assets/room1.png";
import room2     from "../assets/room2.png";
import room3     from "../assets/room3.png";
import cartIcon  from "../assets/cart.png";
import userIcon  from "../assets/user.png";

const IMAGES: Record<string,string> = {
  room_1: room1,
  room_2: room2,
  room_3: room3,
};

const PRICES: Record<string, number> = {
  room_1: 3500,
  room_2: 5500,
  room_3: 7500,
};

function formatDate(input: string) {
  const d  = new Date(input);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

const RoomPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const type     = searchParams.get("type")     || "";
  const checkin  = searchParams.get("checkin")  || "";
  const checkout = searchParams.get("checkout") || "";
  const guests   = Number(searchParams.get("guests") || "1");

  const [room,    setRoom]    = useState<RoomAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!type || !checkin || !checkout) return;
    setLoading(true);
    filterRooms({ checkin, checkout, guests })
      .then(res => {
        const found = res.data.find(r => r.type_id === type);
        if (!found) setError("This room is not available.");
        else       setRoom(found);
      })
      .catch(() => setError("Failed to load room."))
      .finally(() => setLoading(false));
  }, [type, checkin, checkout, guests]);

  if (loading) return <p style={styles.message}>Loading room…</p>;
  if (error || !room) return <p style={{ ...styles.message, color: "#FF3E3E" }}>{error}</p>;

  const imageSrc = IMAGES[type] || room1;
  const price    = PRICES[type] || 0;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push({
      type_id:   type,
      type:      room.type,
      checkin,
      checkout,
      guests,
      price,
      remaining: room.remaining,
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart! You can review it any time via the 🛒 icon.')
  };

  return (
    <div style={styles.page}>
      {/* ——— Top bar ——— */}
      <div style={styles.topbar}>
      <div style={styles.header} onClick={() => navigate(-1)}>
        <span style={styles.arrow}>ᐸ</span>
      </div>
        <div style={styles.topIcons}>
          <img
            src={cartIcon}
            alt="cart"
            style={styles.icon28}
            onClick={() => navigate("/cart")}
          />
          <img
            src={userIcon}
            alt="user"
            style={styles.icon28}
            onClick={() => navigate("/user")}
          />
        </div>
      </div>

      {/* ——— Hero ——— */}
      <img src={imageSrc} alt={room.type} style={styles.heroImage} />

      {/* ——— Title ——— */}
      <h2 style={styles.title}>{room.type}</h2>

      {/* ——— Description ——— */}
      <p style={styles.body}>{room.description.split("\n")[0]}</p>
      <ul style={styles.bullets}>
        {room.description
          .split("\n")
          .slice(1)
          .map((line, i) => (
            <li key={i}>{line.replace(/^•\s*/, "")}</li>
          ))}
      </ul>

      {/* ——— Price ——— */}
      <p style={styles.price}>{price.toLocaleString()} Baht/Night</p>

      {/* ——— Guest pill ——— */}
      <div style={styles.fullWidthPill}>
        Guests: {guests} Person{guests > 1 ? 's' : ''}
      </div>

      {/* ——— Dates ——— */}
      <div style={styles.dateRow}>
        <div style={styles.datePill}>
          <div style={styles.dateLabel}>Check in</div>
          {formatDate(checkin)}
        </div>
        <div style={styles.datePill}>
          <div style={styles.dateLabel}>Check out</div>
          {formatDate(checkout)}
        </div>
      </div>
      <div style={styles.footer}>
      {/* ——— Remaining & button ——— */}
      <p style={styles.remaining}>Remaining: {room.remaining}</p>
      <button style={styles.addBtn} onClick={handleAddToCart}>
        Add to Cart
      </button>
      </div>
    </div>
  );
};

export default RoomPage;

const styles: { [k: string]: React.CSSProperties } = {
  page: {
    padding: '11px 16px', background:'#FFF', minHeight:'100vh',
    display:'flex', flexDirection:'column',marginTop:9
  },
  topbar: {
    position:       'sticky',
    top:            20,
    display:       "flex",
    justifyContent:"space-between",
    alignItems:    "center",
    marginTop:   10,
    marginLeft:  9,
    marginRight: 9,
    marginBottom: 20
  },
  footer: {
    borderTop:'1px solid #ddd',
    paddingTop:12, justifyContent:'space-between', alignItems:'center',
    marginBottom:12,position:       'sticky',
    bottom:0, background:'#fff'

  },
  backWrapper: {
    padding: "8px",
    cursor:  "pointer",
  },
  arrow: {
    fontSize: 17,
    cursor: 'pointer',
  },
  topIcons: {
    display: "flex",
    gap:     12,
  },
  icon28: {
    width:   28,
    height:  28,
    cursor:  "pointer",
  },
  heroImage: {
    width:        "95%",
    borderRadius: 10,
    margin:       "12px 10px 10px",
  },
  title: {
    textAlign:   "center",
    color:       "#6DD3D4",
    fontSize:    24,
    marginBottom:12,
  },
  body: {
    fontSize:   15,
    color:      "#231F1F",
    lineHeight: 1.5,
    margin:       "12px 10px 10px",
    marginBottom:8,
  },
  bullets: {
    paddingLeft: 18,
    margin:      "8px 0 16px",
    color:      "#231F1F",
  },
  price: {
    fontWeight: 600,
    marginBottom:16,
    marginLeft: 10,
  },
  fullWidthPill: {
    display:      "flex",
    alignItems:   "center",
    justifyContent:"center",
    width:        "100%",
    background:   "#F0F0F0",
    borderRadius: 20,
    padding:      "12px 0",
    marginBottom: 12,
    fontSize:     14,
  },
  dateRow: {
    display:       "flex",
    gap:           10,
    marginBottom: 12,
  },
  datePill: {
    flex:         1,
    background:   "#F0F0F0",
    borderRadius: 20,
    padding:      "8px 12px",
    textAlign:    "center",
  },
  dateLabel: {
    fontSize:   12,
    color:      "#231F1F",
    marginBottom:4,
  },
  remaining: {
    display:      "block",
    fontSize:    14,
    marginBottom:16,
  },
  addBtn: {
    width:           "100%",
    padding:         "14px",
    fontSize:        16,
    backgroundColor: "#6DD3D4",
    border:          "none",
    borderRadius:    20,
    color:           "#FFF",
    cursor:          "pointer",
  
  },
  message: {
    textAlign:  "center",
    marginTop:  50,
    fontSize:   16,
    color:      "#231F1F",
  },
};
