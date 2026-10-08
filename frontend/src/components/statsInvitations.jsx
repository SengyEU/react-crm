/* eslint-disable jsx-a11y/control-has-associated-label */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from './DataTable';
import { useUrl } from './UrlProvider';

const StatsInvitations = () => {
  const [data, setData] = useState([]);
  const [prevData, setprevData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { url, apiUrl } = useUrl();
  const [filterText, setFilterText] = useState('');

  const csvURL = `${apiUrl}stats/invitations/?csvexport`;
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}stats/invitations`);
      setData(response.data);
      setprevData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = (event) => {
    const { value } = event.target;
    setFilterText(value);
    // console.log(event.code);
    if (event.code === 'Backspace') {
      setData(prevData);
    }
    if (value.length === 0 || event.code === 'Backspace') {
      setData(prevData);
    } else {
      const normalizedValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const newFilteredData = data.filter((item) => {
        const itemName = item.name ? item.name.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        return itemName.includes(normalizedValue);
      });
      setData(newFilteredData);
    }
  };
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortByKey = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sortedData = [...prevData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <p>Načítání...</p>;
  }

  if (error) {
    return (
      <p>
        Chyba:&nbsp;
        {error}
        <a href={`${url}`}>Přihlásit</a>
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <p>
          Žádné data.
        </p>
        <input
          type="text"
          name="name"
          className="search"
          placeholder="vyhledávání"
          value={filterText}
          onChange={(e) => handleFilter(e)}
          onKeyDown={handleFilter}
        />
      </>
    );
  }

  const columns = Object.keys(prevData[0]);
  const mappedData = data.map((item) => {
    const mappedItem = {};
    columns.forEach((key) => {
      mappedItem[key] = item[key];
    });
    return mappedItem;
  });

  const tableColumns = [
    ...columns.map((column) => ({
      key: column,
      label: column === 'name' ? `Firma (${mappedData.length})` : column.replace(/_/g, ' '),
      colClass: false,
    })),
    {
      key: 'csv_export',
      label: <a href={csvURL} id="csv_export">CSV export</a>,
      sortable: false,
      colClass: false,
    },
  ];

  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          name="name"
          className="search"
          placeholder="vyhledávání"
          value={filterText}
          onChange={(e) => handleFilter(e)}
          onKeyDown={handleFilter}
        />
      </div>
      <DataTable
        responsive={false}
        className="firmlist statlist"
        data={mappedData}
        sortConfig={sortConfig}
        onSort={sortByKey}
        columns={tableColumns}
      />
    </>
  );
};

export default StatsInvitations;
