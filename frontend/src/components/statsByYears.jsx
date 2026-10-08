import React, { useEffect, useState } from 'react';
// import CopyFirmNamesButton from './CopyFirmNamesButton';
import FetchWrapper from './fetchWrapper';
import DataTable from './DataTable';
import Notification from './notification';
import SelectSchoolYear from './selectSchoolYear';
import { useUrl } from './UrlProvider';
import convertDateToCzech from '../utils/czechdates';

const StatsByYears = () => {
  const { apiUrl } = useUrl();
  const y = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(y);
  const [msg, setMsg] = useState(null);
  const renderTable = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Praxe</h2>}
      data={data}
      getRowKey={(row, i) => row.firm_id ?? i}
      columns={[
        {
          key: 'firm_name',
          label: 'Firma',
          renderCell: (item) => item.firm_name,
        },
        {
          key: 'annual',
          label: 'Ročník',
          renderCell: (item) => item.annual,
        },
        {
          key: 'count',
          label: 'Počet',
          renderCell: (item) => item.count,
        },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(
              data.map((item) => item.firm_name).filter(Boolean).join('; '),
            );
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderTable2 = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Pozvánky</h2>}
      data={data}
      getRowKey={(row, i) => row.firm_id ?? i}
      columns={[
        {
          key: 'firm_name',
          label: 'Firma',
          renderCell: (item) => item.firm_name,
        },
        { key: 'A_adres', label: 'A adres', renderCell: (item) => item.A_adres },
        { key: 'E_adres', label: 'E adres', renderCell: (item) => item.E_adres },
        { key: 'I_adres', label: 'I adres', renderCell: (item) => item.I_adres },
        { key: 'A_neadres', label: 'A neadres', renderCell: (item) => item.A_neadres },
        { key: 'E_neadres', label: 'E neadres', renderCell: (item) => item.E_neadres },
        { key: 'I_neadres', label: 'I neadres', renderCell: (item) => item.I_neadres },
        { key: 'vsem', label: 'Všem', renderCell: (item) => item.vsem },
        { key: 'count', label: 'Celkem', renderCell: (item) => item.count },
        { key: 'note', label: 'Poznámka', renderCell: (item) => item.note },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            const firmNames = data
              .map((item) => item.firm_name)
              .filter(Boolean)
              .join('; ');

            navigator.clipboard.writeText(firmNames);
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderTable3 = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Přednášky, Worskshop, Exkurze atd.</h2>}
      data={data}
      getRowKey={(row, i) => row.firm_id ?? i}
      columns={[
        {
          key: 'firm_name',
          label: 'Firma',
          renderCell: (item) => item.firm_name,
        },
        { key: 'typ', label: 'Typ', renderCell: (item) => item.typ },
        {
          key: 'datum',
          label: 'Datum',
          cellClassName: () => 'no-wrap',
          renderCell: (item) => convertDateToCzech(item.datum),
        },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            const firmNames = data
              .map((item) => item.firm_name)
              .filter(Boolean)
              .join('; ');

            navigator.clipboard.writeText(firmNames);
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderTable4 = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Dary</h2>}
      data={data}
      getRowKey={(row, i) => row.firm_id ?? i}
      columns={[
        {
          key: 'firm_name',
          label: 'Firma',
          renderCell: (item) => item.firm_name,
        },
        { key: 'count', label: 'Počet', renderCell: (item) => item.count },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            const firmNames = data
              .map((item) => item.firm_name)
              .filter(Boolean)
              .join('; ');

            navigator.clipboard.writeText(firmNames);
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderTable5 = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Schůzky</h2>}
      data={data}
      getRowKey={(row, i) => row.firm_id ?? i}
      columns={[
        {
          key: 'firm_name',
          label: 'Firma',
          renderCell: (item) => item.firm_name,
        },
        {
          key: 'datum',
          label: 'Datum',
          cellClassName: () => 'no-wrap',
          renderCell: (item) => convertDateToCzech(item.datum),
        },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            const firmNames = data
              .map((item) => item.firm_name)
              .filter(Boolean)
              .join('; ');

            navigator.clipboard.writeText(firmNames);
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderTable6 = (data) => (
    <DataTable
      responsive={false}
      caption={<h2>Neaktivní firmy</h2>}
      data={data}
      getRowKey={(row, i) => row.id ?? i}
      columns={[
        {
          key: 'name',
          label: 'Firma',
          renderCell: (item) => item.name,
        },
      ]}
      footer={
        <button
          type="button"
          onClick={() => {
            const firmNames = data
              .map((item) => (item.firm_name || item.name))
              .filter(Boolean)
              .join('; ');

            navigator.clipboard.writeText(firmNames);
            setMsg('Názvy firem byly zkopírovány.');
          }}
        >
          Kopírovat názvy firem
        </button>
      }
    />
  );
  const renderComponet = () => (
    <div>
      {msg && (<Notification message={msg} type="edit-firm-success" />)}
      <h1>Statistika dle školních let</h1>
      <SelectSchoolYear selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      <div className="stats-by-years-tables">
        <FetchWrapper
          url={`${apiUrl}stats/getAllWSs/${selectedYear}`}
          render={renderTable3}
        />
        <FetchWrapper
          url={`${apiUrl}stats/getAllMeets/${selectedYear}`}
          render={renderTable5}
        />
        <FetchWrapper
          url={`${apiUrl}stats/getAllGifts/${selectedYear}`}
          render={renderTable4}
        />
        <FetchWrapper
          url={`${apiUrl}stats/practices/${selectedYear}`}
          render={renderTable}
        />
        <FetchWrapper
          url={`${apiUrl}stats/invitations/${selectedYear}`}
          render={renderTable2}
        />
        <FetchWrapper
          url={`${apiUrl}stats/getAllNotActivity/${selectedYear}`}
          render={renderTable6}
        />
      </div>
    </div>
  );

  useEffect(() => {
    renderComponet();
  }, [selectedYear, msg]);

  return (
    <div>
      {renderComponet()}
    </div>
  );
};

export default StatsByYears;
