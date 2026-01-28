import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        localStorage.setItem('admin', username);
        onLogin();
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-hero-bg">
        <div className="hero-overlay">
          <div className="hero-branding">
          </div>
        </div>
      </div>

      <main className="login-main">
        <div className="login-card-standalone">
          <div className="card-content">
            <h2 className="login-title">Welcome Admin</h2>
            <p className="login-subtitle">Enter your credentials</p>

            {message && (
              <div className={`message ${messageType}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form-enhanced">
              <div className="input-wrapper">
                <label className="input-label">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  disabled={loading}
                  className="login-input"
                />
              </div>

              <div className="input-wrapper">
                <label className="input-label">Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="login-input"
                  />
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="demo-creds">
              <p>👉 Demo: <strong>admin</strong> / <strong>admin123</strong></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
