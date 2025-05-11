import React from 'react';
import { useNavigate } from 'react-router-dom';
import pool from '../assets/pool.png';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <img src={pool} alt="pool" style={styles.heroImage} />
      <div style={styles.logoText}>ELYSIAN<br/>SHORES</div>
      <button style={styles.button} onClick={() => navigate('/signup')}>
        Sign up with email
      </button>
      <p style={styles.subtext}>
        Already have an account?
        <span style={styles.link} onClick={() => navigate('/login')}>
          Log In
        </span>
      </p>
    </div>
  );
};

export default IndexPage;

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        padding: 0,
        width: '100%',
        minHeight: '100vh',  
        backgroundColor: '#FFFFFF',
      },
      heroImage: {
        width: '100%',
        aspectRatio: '7.25/9',   // modern browsers
        objectFit: 'cover',
        display: 'block',
      },
      
  logoText: {
    fontFamily: 'Funnel Sans, sans-serif',
    fontSize: 30,
    letterSpacing: 4,
    color: '#6DD3D4',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '90%',
    maxWidth: 320,
    padding: '12px 0',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#6DD3D4',
    color: '#FFFFFF',
    cursor: 'pointer',
    marginBottom: 16,
  },
  subtext: {
    fontSize: 14,
    color: '#231F1F',
    textAlign: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#6DD3D4',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: 4,
  },
};