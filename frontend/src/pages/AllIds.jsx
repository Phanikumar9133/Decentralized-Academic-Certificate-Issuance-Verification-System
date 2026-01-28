import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllIds = () => {
  const [certIds, setCertIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCertIds();
  }, []);

  const fetchCertIds = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/all-ids', {
        withCredentials: true  
      });
      setCertIds(response.data);
    } catch (error) {
      console.error('Error fetching cert IDs:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading Certificate IDs...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>All Certificate IDs</h2>
      
      {certIds.length > 0 ? (
        <div className="id-list" style={{
          background: 'rgba(255,255,255,0.9)',
          color: '#222',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {certIds.map((item) => (
            <div key={item.cert_id} className="id-item" style={{
              padding: '8px 0',
              borderBottom: '1px solid #eee'
            }}>
              <strong>{item.cert_id}</strong> 
              <span style={{color:'#666', fontSize:'0.9em'}}>
                ({item.issued_at})
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{textAlign: 'center', marginTop: '30px', opacity: 0.8}}>
          No certificates issued yet.
        </p>
      )}

      <div style={{marginTop: '30px'}}>
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default AllIds;
