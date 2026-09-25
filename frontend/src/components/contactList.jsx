/* eslint-disable jsx-a11y/control-has-associated-label */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EditContactForm from './editContactForm';
import Notification from './notification';
import { useUrl } from './UrlProvider';

const ContactList = ({
  firmId: propFirmId,
  firmName: propFirmName,
  onClose,
  onSave,
}) => {
  const { apiUrl } = useUrl();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const firmId = propFirmId || params.firmId;
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
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

  const fetchContacts = async () => {
    if (!firmId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}contacts/${firmId}`);
      if (Array.isArray(response.data) && response.data.length === 0) {
        setError('Žádné kontakty.');
      } else {
        setError(null);
        setContacts(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [firmId, selectedContact]);

  const deleteContact = async (contactId) => {
    try {
      const response = await axios.delete(`${apiUrl}contacts/${contactId}`);
      if (response.status === 200) {
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== contactId),
        );
      } else {
        setError('Smazání kontaktu selhalo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedContact(null);
  };

  const handledelClick = (contact) => {
    const confirmed = window.confirm('Chceš to fakt vymazat?');
    if (confirmed) {
      deleteContact(contact.id);
    }
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
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

  const handleSave = (updatedContact) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact,
      ),
    );
    setSelectedContact(null);
    if (onSave) {
      onSave();
    } else {
      fetchContacts();
    }
  };

  const handleCopy = (inputValue) => {
    navigator.clipboard
      .writeText(inputValue)
      .then(() => {
        setMsg('Zkopírováno!');
      })
      .catch((err) => {
        setError('Chyba při kopírování: ', err);
      });
  };

  const Clipboard = (formData) => {
    const formattedString = formData.filter((item) => item).join(', ');
    handleCopy(formattedString);
  };

  const displayFirmTitle =
    resolvedFirmName || (firmId ? `Firma #${firmId}` : 'Neznámá firma');

  if (loading) {
    return <p className="no-data">Načítám kontakty...</p>;
  }

  return (
    <div className="routed-view contacts-view" style={{ padding: '20px' }}>
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

      {msg && <Notification message={msg} type="edit-firm-success" />}
      {error && <Notification message={error} type="edit-firm-error" />}

      {selectedContact ? (
        <EditContactForm
          contact={selectedContact}
          onSave={handleSave}
          onClose={handleClose}
          firmName={displayFirmTitle}
        />
      ) : (
        <table className="responsive-table">
          <caption>
            <h3>{`${displayFirmTitle.split('/(kont)')[0]} - kontakty`}</h3>
          </caption>
          <thead>
            <tr>
              <th>Hlavní</th>
              <th>Aktivní</th>
              <th>Foto</th>
              <th>Jméno</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>LinkedIN</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td data-label="Hlavní">
                  {contact.main === '1' ? '✅' : '☐'}
                </td>
                <td data-label="Aktivní">
                  {contact.active_c === '1' ? '✅' : '☐'}
                </td>
                <td data-label="Foto">
                  {contact.img ? (
                    <img src={contact.img} alt="" className="kontakt-img" />
                  ) : null}
                </td>
                <td data-label="Jméno">{contact.surname}</td>
                <td data-label="E-mail">
                  {contact.email ? (
                    <a href={contact.mailto ? contact.mailto.replace(/\+/g, ' ') : `mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  ) : null}
                </td>
                <td data-label="Telefon">
                  {contact.phone ? (
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  ) : null}
                </td>
                <td data-label="LinkedIN">
                  {contact.linkedin ? (
                    <a href={contact.linkedin} target="_blank" rel="noreferrer">
                      LinkedIN
                    </a>
                  ) : (
                    '\u00A0'
                  )}
                </td>
                <td>
                  <button type="button" onClick={() => handleEditClick(contact)}>
                    Upravit
                  </button>
                  <button
                    type="button"
                    onClick={() => handledelClick(contact)}
                    className="del-btn"
                  >
                    Smazat
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      Clipboard([
                        contact.surname,
                        contact.email,
                        contact.phone,
                        contact.linkedin,
                      ])
                    }
                    className="fn-btn"
                  >
                    Kontakt do schránky
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
              <td />
              <td />
              <td>
                <button
                  type="button"
                  onClick={() =>
                    handleEditClick({
                      id: null,
                      firm_id: firmId,
                      main: !contacts.filter((c) => c.main === '1').length,
                    })
                  }
                >
                  Přidat kontakt
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

ContactList.propTypes = {
  firmId: PropTypes.string,
  onClose: PropTypes.func,
  firmName: PropTypes.string,
  onSave: PropTypes.func,
};

export default ContactList;
