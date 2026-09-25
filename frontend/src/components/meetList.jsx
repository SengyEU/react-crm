/* eslint-disable jsx-a11y/control-has-associated-label */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditMeetForm from './editMeetForm';
import { useUrl } from './UrlProvider';
import { convertDateTimeToCzech } from '../utils/czechdates';

const MeetList = ({
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
  const [meets, setMeets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeet, setSelectedMeet] = useState(null);
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

  const fetchMeets = async () => {
    if (!firmId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}meets/${firmId}`);
      if (Array.isArray(response.data) && response.data.length === 0) {
        setError('Žádné schůzky.');
      } else {
        setError(null);
        setMeets(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeets();
  }, [firmId]);

  const deleteMeet = async (meetId) => {
    try {
      const response = await axios.delete(`${apiUrl}meets/${meetId}`);
      if (response.status === 200) {
        setMeets((prevMeets) => prevMeets.filter((meet) => meet.id !== meetId));
      } else {
        setError('Smazání schůzky selhalo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handledelClick = (meet) => {
    const confirmed = window.confirm('Chceš to fakt vymazat?');
    if (confirmed) {
      deleteMeet(meet.id);
    }
  };

  const handleEditClick = (meet) => {
    setSelectedMeet(meet);
  };

  const handleClose = () => {
    setSelectedMeet(null);
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSave = (meetupdatedMeet) => {
    const existingMeet = meets.find((meet) => meet.id === meetupdatedMeet.id);
    const updatedMeet = {
      ...meetupdatedMeet,
      date_time: convertDateTimeToCzech(meetupdatedMeet.date_time),
    };
    if (!existingMeet) {
      setMeets([...meets, updatedMeet]);
    } else {
      setMeets(
        meets.map((meet) =>
          meet.id === updatedMeet.id ? updatedMeet : meet,
        ),
      );
    }
    setSelectedMeet(null);
    if (onSave) {
      onSave();
    } else {
      fetchMeets();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (!selectedMeet) {
        handleGoBack();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMeet]);

  const displayFirmTitle =
    resolvedFirmName || (firmId ? `Firma #${firmId}` : 'Neznámá firma');

  if (loading) {
    return <p className="no-data">Načítám schůzky...</p>;
  }

  return (
    <div className="routed-view meets-view" style={{ padding: '20px' }}>
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

      {error && <p className="no-data">Chyba: {error}</p>}

      {selectedMeet ? (
        <EditMeetForm
          meet={selectedMeet}
          onSave={handleSave}
          onClose={handleClose}
          firmName={displayFirmTitle.split('/(kont)')[0]}
        />
      ) : (
        <table className="responsive-table">
          <caption>
            <h3>{`${displayFirmTitle.split('/(kont)')[0]} - schůzky`}</h3>
          </caption>
          <thead>
            <tr>
              <th>Datum a čas</th>
              <th>Poznámka</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {meets.map((meet) => (
              <tr key={meet.id}>
                <td data-label="Datum a čas">
                  {convertDateTimeToCzech(meet.date_time)}
                </td>
                <td data-label="Poznámka">{meet.notes}</td>
                <td>
                  <button type="button" onClick={() => handleEditClick(meet)}>
                    Upravit
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handledelClick(meet)}
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
              <td>
                <button
                  type="button"
                  onClick={() =>
                    handleEditClick({
                      id: null,
                      firm_id: firmId,
                      date_time: '',
                      notes: '',
                    })
                  }
                >
                  Přidat schůzku
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

MeetList.propTypes = {
  firmId: PropTypes.string,
  onSave: PropTypes.func,
  firmName: PropTypes.string,
  onClose: PropTypes.func,
};

export default MeetList;
