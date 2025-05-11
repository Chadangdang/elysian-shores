import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MaskedPasswordInput from '../components/MaskedPasswordInput';
import { signup } from '../api/auth';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const { data } = await signup({
        username,
        fullName: fullname,
        email,
        password,
      });
      localStorage.setItem('token', data.access_token);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header} onClick={() => navigate(-1)}>
        <span style={styles.arrow}>ᐸ</span>
      </div>

      <h2 style={styles.title}>Create Account</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
          placeholder="Enter username"
          required
        />

        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={e => setFullname(e.target.value)}
          style={styles.input}
          placeholder="Enter your full name"
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
          placeholder="you@example.com"
          required
        />

        <label style={styles.label}>Password</label>
        <MaskedPasswordInput
          value={password}
          onChange={setPassword}
          style={styles.input}
          placeholder="Enter password"
        />

        <label style={styles.label}>Confirm Password</label>
        <MaskedPasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          style={styles.input}
          placeholder="Re-enter your password"
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Sign Up</button>
      </form>

      <p style={styles.subtext}>
        Already have an Account?{' '}
        <span style={styles.link} onClick={() => navigate('/login')}>
          Log In
        </span>
      </p>
    </div>
  );
};

export default SignupPage;

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