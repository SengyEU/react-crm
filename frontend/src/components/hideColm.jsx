/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import DataTable from './DataTable';
import Notification from './notification';
import { useUrl } from './UrlProvider';

const HideColm = () => {
  const { apiUrl } = useUrl();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  useEffect(() => {
    // Načtení dat z URL
    axios.get(`${apiUrl}columns`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setIsErrorVisible(error);
        console.error('Chyba čtení dat:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post(`${apiUrl}columns`, formData)
      .then((response) => {
        // console.log('Data submitted successfully:', response.data);
        setIsSuccessVisible(true);
        setMsg(response);
      })
      .catch((error) => {
        setIsErrorVisible(true);
        setMsg(error);
      });
  };

  if (loading) {
    return <div>Načítám data...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {isSuccessVisible && (<Notification message="Uloženo" type="edit-firm-success" />)}
      {isErrorVisible && (<Notification message={`Chyba při ukládání! ${msg}`} type="edit-firm-error" />)}
      <DataTable
        responsive={false}
        data={Object.entries(formData)}
        getRowKey={(entry) => entry[0]}
        columns={[
          {
            key: 'name',
            label: 'Sloupec',
            renderCell: (entry) => <label htmlFor={entry[0]}>{entry[0]}</label>,
          },
          {
            key: 'visible',
            label: 'Viditelnost',
            sortable: false,
            renderCell: (entry) => (
              <input
                type="checkbox"
                name={entry[0]}
                id={entry[0]}
                checked={entry[1] === true}
                onChange={handleChange}
              />
            ),
          },
        ]}
      />
      <button type="submit">Uložit</button>
    </form>
  );
};

export default HideColm;
