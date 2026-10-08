/* eslint-disable jsx-a11y/control-has-associated-label */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import EditGiftForm from './editGiftForm';
import DataTable from './DataTable';
import { useUrl } from './UrlProvider';
import convertDateToCzech from '../utils/czechdates';

const GiftList = ({
  firmId,
  onSave,
  firmName,
  onClose,
}) => {
  const { apiUrl } = useUrl();
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGift, setSelectedGift] = useState(null);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get(`${apiUrl}gifts/${firmId}`);
        if (Array.isArray(response.data) && response.data.length === 0
        && response.data.msg !== undefined) {
          setError('Žádné dárky.');
        } else {
          console.log(response.data);
          setGifts(response.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, [firmId, selectedGift]);

  const deleteGift = async (giftId) => {
    try {
      const response = await axios.delete(`${apiUrl}gifts/${giftId}`);
      if (response.status === 200) {
        setGifts((prevGifts) => prevGifts.filter((gift) => gift.id !== giftId));
      } else {
        setError('Smazání dárku selhalo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handledelClick = (gift) => {
    console.log(gift);
    const confirmed = window.confirm('Chceš to fakt vymazat?');
    if (confirmed) {
      deleteGift(gift);
    }
  };
  const handleEditClick = (gift) => {
    console.log(gift);
    setSelectedGift(gift);
  };
  const handleClose = () => {
    setSelectedGift(null);
  };
  const handleSave = (giftupdatedGift) => {
    console.log(giftupdatedGift);
    setGifts(gifts.map(
      (gift) => (gift.id === giftupdatedGift.id ? giftupdatedGift : gift),
    ));
    setSelectedGift(null); // Close the form after saving
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (!selectedGift) {
        onClose(null);
      }
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return <p>Načítám...</p>;
  }
  if (error) {
    return (
      <p>
        Chyba:
        {error}
      </p>
    );
  }
  return (
    <div className={`floating-layer ${!firmId ? 'hidden' : ''}`}>
      <button className="close-button" type="button" onClick={onSave}>X</button>
      {selectedGift ? (
        <EditGiftForm gift={selectedGift} onSave={handleSave} onClose={handleClose} />
      ) : (
        <DataTable
          caption={<h3>{`${firmName.split('/(kont)')[0]} - dary`}</h3>}
          data={gifts}
          columns={[
            {
              key: 'date',
              label: 'Datum',
              renderCell: (gift) => convertDateToCzech(gift.date),
            },
            { key: 'price', label: 'Hodnota' },
            { key: 'notes', label: 'Poznámka' },
            {
              key: 'edit',
              label: '',
              sortable: false,
              renderCell: (gift) => (
                <button type="button" onClick={() => handleEditClick(gift)}>upravit</button>
              ),
            },
            {
              key: 'delete',
              label: '',
              sortable: false,
              renderCell: (gift) => (
                <button
                  type="button"
                  onClick={() => handledelClick(gift.id)}
                  className="del-btn"
                >
                  smazat
                </button>
              ),
            },
          ]}
          extraRow={(
            <>
              <td />
              <td />
              <td />
              <td>
                <button
                  type="button"
                  onClick={() => handleEditClick({ id: null, firm_id: firmId })}
                >
                  Přidat
                </button>
              </td>
            </>
          )}
        />
      )}
    </div>
  );
};

export default GiftList;

GiftList.propTypes = {
  firmId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  firmName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
