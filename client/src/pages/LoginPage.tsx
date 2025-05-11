import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaskedPasswordInput from '../components/MaskedPasswordInput';
import { login } from '../api/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await login({ username, password });
      localStorage.setItem('token', data.access_token);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header} onClick={() => navigate(-1)}>
        <span style={styles.arrow}>ᐸ</span>
      </div>

      <h2 style={styles.title}>Login</h2>

      <form style={styles.form} onSubmit={handleLogin}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
          placeholder="Enter your username"
          required
        />

        <label style={styles.label}>Password</label>
        <MaskedPasswordInput
          value={password}
          onChange={setPassword}
          style={styles.input}
          placeholder="Enter your password"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" className="form-button" style={styles.button}>
          Login
        </button>
      </form>

      <p style={styles.subtext}>
        Don't have an account yet?{' '}
        <span style={styles.link} onClick={() => navigate('/signup')}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 20px 20px',
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    boxSizing: 'border-box',
    justifyContent: 'center',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    cursor: 'pointer',
    zIndex: 10,
  },
  arrow: {
    fontSize: 17,
    fontWeight: 'normal',
    color: '#231F1F',
  },
  title: {
    fontSize: 26,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#231F1F',
  },
  input: {
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 15,
    border: '1px solid #070707',
    marginBottom: 16,
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: 10,
    padding: '12px 16px',
    fontSize: 16,
    borderRadius: 15,
    backgroundColor: '#6DD3D4',
    color: '#FFFFFF',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    color: '#FF3E3E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  link: {
    color: '#6DD3D4',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: 4,
  },
};
