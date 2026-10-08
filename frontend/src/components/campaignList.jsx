/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from './DataTable';
import { useUrl } from './UrlProvider';
import isSmall from '../utils/mobileDetect';

const getFirstPart = (text) => {
  const parts = text?.split(/\/\(kont\)/) || [];
  return parts[0];
};

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const { apiUrl, user } = useUrl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isWrapped, setIsWrapped] = useState(false);

  const toggleWrap = () => {
    setIsWrapped(!isWrapped);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      console.log('fetchContacts');

      try {
        const response = await axios.get(`${apiUrl}/campaigns/`);
        if (Array.isArray(response.data) && response.data.length === 0
          && response.data.msg !== undefined) {
          setError('Žádné kontakty.');
        } else {
          console.log(response.data);
          setCampaigns(response.data);
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [apiUrl]);

  const handleEditClick = (campaign) => {
    navigate(`/campaignAdd/${campaign.id}`);
  };
  const deleteCampaign = async (firmId) => {
    try {
      const response = await axios.delete(`${apiUrl}campaign/${firmId}`);
      if (response.status === 200) {
        // fetchData();
        setCampaigns((prevFirm) => prevFirm.filter((firm) => firm.id !== firmId));
      } else {
        setError('Smazání kontaktu selhalo');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelClick = (id) => {
    const confirmed = window.confirm('Chceš to fakt vymazat?');
    if (confirmed) {
      deleteCampaign(id);
    }
  };
  const handleClick = (id) => {
    navigate(`/getCampaignContacts/${id}`);
  };

  if (loading) {
    return <p className="no-data">Načítám...</p>;
  }
  if (error) {
    return (
      <p className="no-data">
        Error:
        {error}
      </p>
    );
  }

  return (
    <div>
      <h1>Zasílání</h1>
      <DataTable
        className={isWrapped ? 'wrap-cells' : 'nowrap-cells'}
        data={campaigns}
        onToggleWrap={toggleWrap}
        columns={[
          { key: 'id', label: 'ID', colClass: false },
          {
            key: 'name',
            label: 'Název',
            onCellClick: (campaign) => handleClick(campaign.id),
            renderCell: (campaign) => getFirstPart(campaign.name),
          },
          { key: 'created_date', label: 'Datum Vytvoření' },
          { key: 'sent_date_time', label: 'Datum odeslání' },
          { key: 'end_date', label: 'Datum ukončení' },
          { key: 'recipient_count', label: 'Počet adresátů (firem)' },
          { key: 'undelivered_count', label: 'Počet nedoručení' },
          { key: 'confirmed_received_count', label: 'Počet potvrzení o doručení' },
          { key: 'replied_count', label: 'Odpovědělo' },
          { key: 'note', label: 'Poznámka' },
          {
            key: 'actions',
            label: '',
            sortable: false,
            renderCell: (campaign) => (
              <>
                {user.user !== 'reader' ? (
                  <div>
                    <div className={isSmall() ? 'small-resolution' : ''}>
                      <button type="button" onClick={() => handleEditClick(campaign)}>upravit</button>
                      <button type="button" onClick={() => handleDelClick(campaign.id)} className="del-btn">smazat</button>
                      <a href={`${apiUrl}campaignExport/${campaign.id}/?csvexport`} id="csv_export">CSV export</a>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CampaignList;
