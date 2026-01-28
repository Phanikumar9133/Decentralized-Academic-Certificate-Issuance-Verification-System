import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VerifyCert = () => {
  const [certId, setCertId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('cert_id');
    if (id) {
      setCertId(id);
      verifyCertificate(id);
    }
  }, [location]);

  const verifyCertificate = async (id) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get(`http://localhost:5000/api/verify/${id}`);
      setCertificate(response.data);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Certificate not found');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    verifyCertificate(certId);
  };

  return (
    <div className="container">
      <h2>Verify Certificate</h2>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="cert_id"
          placeholder="Enter Certificate ID"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          required
          autoFocus
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {certificate && (
        <div className="card">
          <h3>Certificate Verified</h3>
          <p><strong>Certificate ID:</strong> {certificate.cert_id}</p>
          <p><strong>Student Name:</strong> {certificate.student_name}</p>
          <p><strong>Roll No:</strong> {certificate.roll_no}</p>
          <p><strong>Degree:</strong> {certificate.degree}</p>
          <p><strong>University:</strong> {certificate.university}</p>
          <p><strong>Year:</strong> {certificate.year}</p>
          <p><strong>Issued:</strong> {certificate.issued_at}</p>
          <p><strong>Issuer:</strong> {certificate.issuer}</p>
          <p><strong>Blockchain Hash:</strong><br/>
            <code>{certificate.block_hash}</code>
          </p>
        </div>
      )}

      <div className="actions">
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default VerifyCert;
