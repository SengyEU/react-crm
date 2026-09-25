/* eslint-disable jsx-a11y/control-has-associated-label */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditWSForm from './editWSForm';
import { useUrl } from './UrlProvider';
import convertDateToCzech from '../utils/czechdates';

const WorkshopList = ({
  firmId: propFirmId,
  onSave,
  firmName: propFirmName,
  onClose,
}) => {
  const { apiUrl } = useUrl();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const firmId = propFirmId || params.firmId;
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [resolvedFirmName, setResolvedFirmName] = useState(
    propFirmName || location.state?.firmName || '',
  );

  // If firm name was not passed via state or prop, fetch it
  useEffect(() => {
    if (!resolvedFirmName && firmId) {
      axios
        .get(`${apiUrl}firms/list`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            const found = res.data.find((f) => String(f.id) === String(firmId));
            if (found) {
              setResolvedFirmName(found.name.split('/(kont)')[0]);
            }
          }
        })
        .catch(() => {});
    }
  }, [firmId, resolvedFirmName, apiUrl]);

  const fetchWorkshops = async () => {
    if (!firmId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}workshops/${firmId}`);
      if (Array.isArray(response.data) && response.data.length === 0) {
        setError('Žádné akce.');
        setWorkshops([]);
      } else {
        setError(null);
        setWorkshops(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [firmId, selectedContact]);

  const deleteWorkshop = async (contactId) => {
    try {
      const response = await axios.delete(`${apiUrl}workshops/${contactId}`);
      if (response.status === 200) {
        setWorkshops((prevworkshops) =>
          prevworkshops.filter((ws) => ws.id !== contactId),
        );
      } else {
        setError('Smazání akce selhalo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handledelClick = (workshop) => {
    const confirmed = window.confirm('Chceš to fakt vymazat?');
    if (confirmed) {
      deleteWorkshop(workshop.id);
    }
  };

  const handleEditClick = (ws) => {
    setSelectedContact(ws);
  };

  const handleClose = () => {
    setSelectedContact(null);
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSave = (updatedWorkshop) => {
    setWorkshops(
      workshops.map((workshop) =>
        workshop.id === updatedWorkshop.id ? updatedWorkshop : workshop,
      ),
    );
    setSelectedContact(null);
    if (onSave) {
      onSave();
    } else {
      fetchWorkshops();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (!selectedContact) {
        handleGoBack();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedContact]);

  const displayFirmTitle =
    resolvedFirmName || (firmId ? `Firma #${firmId}` : 'Neznámá firma');

  if (loading) {
    return <p className="no-data">Načítání akcí...</p>;
  }

  return (
    <div className="routed-view workshops-view" style={{ padding: '20px' }}>
      <div
        className="top-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          className="fn-btn"
          onClick={handleGoBack}
          style={{ cursor: 'pointer', padding: '8px 16px' }}
        >
          ← Zpět na seznam firem
        </button>
      </div>

      {error ? (
        <p className="edit-firm-success edit-firm-error">
          Chyba:&nbsp;
          {error}
        </p>
      ) : (
        ''
      )}

      {selectedContact ? (
        <EditWSForm
          contact={selectedContact}
          onSave={handleSave}
          onClose={handleClose}
          firmName={displayFirmTitle.split('/(kont)')[0]}
        />
      ) : (
        <table className="responsive-table">
          <caption>
            <h3>{`Akce s firmou ${displayFirmTitle.split('/(kont)')[0]}`}</h3>
          </caption>
          <thead>
            <tr>
              <th className="hidden">ID</th>
              <th>Datum</th>
              <th>Typ</th>
              <th>Poznámka</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop) => (
              <tr key={workshop.id}>
                <td data-label="ID" className="hidden">
                  {workshop.id}
                </td>
                <td data-label="Datum">{convertDateToCzech(workshop.date)}</td>
                <td data-label="Typ">{workshop.type}</td>
                <td data-label="Poznámka">{workshop.notes}</td>
                <td>
                  <button type="button" onClick={() => handleEditClick(workshop)}>
                    Upravit
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handledelClick(workshop)}
                    className="del-btn"
                  >
                    Smazat
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td>
                <button
                  type="button"
                  onClick={() =>
                    handleEditClick({
                      id: null,
                      firm_id: firmId,
                      date: new Date().toISOString().slice(0, 10),
                      type: 'Workshop',
                      notes: '',
                    })
                  }
                >
                  Přidat akci
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

WorkshopList.propTypes = {
  firmId: PropTypes.string,
  onSave: PropTypes.func,
  firmName: PropTypes.string,
  onClose: PropTypes.func,
};

export default WorkshopList;
