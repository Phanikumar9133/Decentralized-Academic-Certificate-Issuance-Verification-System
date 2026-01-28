import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ onLogout }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/certificates', {
        withCredentials: true
      });
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.log('Logout API call failed, clearing local state');
    }
    localStorage.removeItem('admin');
    onLogout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{maxWidth: '1100px'}}>
      <h2>Admin Dashboard</h2>
      <p>Blockchain-based Certificate Management</p>

      <div className="stats">
        <div className="stat-card">
          <h4>Total Certificates</h4>
          <div className="value">{certificates.length}</div>
        </div>
        {certificates.length > 0 && (
          <div className="stat-card">
            <h4>Last Issued</h4>
            <div className="value">{certificates[0].issued_at.slice(-8)}</div>
            <div style={{fontSize:'0.85rem', marginTop:'4px', color:'#555'}}>
              {certificates[0].issued_at.slice(0, -9)}
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <Link to="/issue" className="btn">+ Issue New Certificate</Link>
        <Link to="/verify" className="btn">Verify Certificate</Link>
        <Link to="/all-ids" className="btn">View All Certificate IDs</Link>
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {certificates.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Cert ID</th>
              <th>Student Name</th>
              <th>Roll No</th>
              <th>Degree</th>
              <th>Year</th>
              <th>Issued At</th>
              <th>Issuer</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.cert_id}>
                <td>
                  <Link
                    to={`/verify?cert_id=${cert.cert_id}`}
                    style={{color: '#4a6bff', textDecoration: 'none', fontFamily: 'monospace', fontWeight: '600'}}
                  >
                    {cert.cert_id}
                  </Link>
                </td>
                <td>{cert.student_name}</td>
                <td>{cert.roll_no}</td>
                <td>{cert.degree}</td>
                <td>{cert.year}</td>
                <td>{cert.issued_at}</td>
                <td>{cert.issuer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem'}}>
          No certificates have been issued yet.
          <br/><br/>
          Click "Issue New Certificate" to get started.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
