// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchSheetData } from '../services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('DATA_DEBITUR_WO');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil data setiap kali pilihan tab berubah
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchSheetData(activeTab);
      setData(result);
      setLoading(false);
    };

    loadData();
  }, [activeTab]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard Analis Pulau Punjung</h2>

      {/* Navigasi Tab */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('DATA_DEBITUR_WO')}
          style={{ fontWeight: activeTab === 'DATA_DEBITUR_WO' ? 'bold' : 'normal' }}
        >
          Data Debitur WO
        </button>
        <button 
          onClick={() => setActiveTab('REKAP_ANALIS_RECOVERY')}
          style={{ fontWeight: activeTab === 'REKAP_ANALIS_RECOVERY' ? 'bold' : 'normal' }}
        >
          Rekap Analis Recovery
        </button>
        <button 
          onClick={() => setActiveTab('MONITORING_KREDIT_AKTIF')}
          style={{ fontWeight: activeTab === 'MONITORING_KREDIT_AKTIF' ? 'bold' : 'normal' }}
        >
          Monitoring Kredit Aktif
        </button>
      </div>

      {/* Tampilan Data */}
      {loading ? (
        <p>Memuat data dari Google Sheets...</p>
      ) : (
        <div>
          <p>Total Data: {data.length}</p>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}