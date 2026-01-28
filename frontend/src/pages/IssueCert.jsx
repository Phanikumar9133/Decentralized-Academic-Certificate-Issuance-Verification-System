import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IssueCert = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    degree: '',
    university: '',
    year: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/issue', formData, {
        withCredentials: true  
      });
      
      if (response.data.success) {
        setMessage(`Certificate ${response.data.cert_id} issued successfully!`);
        setMessageType('success');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error issuing certificate');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h2>Issue New Certificate</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="roll"
          placeholder="Roll Number"
          value={formData.roll}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="degree"
          placeholder="Degree"
          value={formData.degree}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="university"
          placeholder="University"
          value={formData.university}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          name="year"
          placeholder="Year of Passing"
          value={formData.year}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Issuing...' : 'Issue Certificate'}
        </button>
      </form>

      <Link to="/dashboard" className="btn">Back to Dashboard</Link>
    </div>
  );
};

export default IssueCert;
