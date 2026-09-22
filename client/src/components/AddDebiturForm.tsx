import React, { useState } from 'react';

// Ganti dengan Web App URL dari Google Apps Script kamu
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNjeTd1q1_Vo46on_RxKwCubyjTOpG7Gi0J-MKkF8AXMdIqF8wle8_hsY8e0pmYdOB/exec";

export function AddDebiturForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sheetName: "DATA_DEBITUR_WO", // Nama sheet tujuan
    ID_Debitur: "",
    Nama_Debitur: "",
    No_Rekening: "",
    Unit_Kerja: "KC Pulau Punjung",
    Nama_Analis_Recovery: "",
    OS_Ekstrakomtabel: 0,
    Target_Recovery_2026: 0,
    Realisasi_Setoran: 0,
    Tanggal_Setoran_Terakhir: "",
    Jumlah_Debitur_Lunas: 0,
    Status_Penyelesaian: "Dalam Proses"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengirim request ke Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Digunakan agar tidak terkena CORS policy dari Google Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      alert("Data berhasil dikirim ke Google Spreadsheet!");
      // Reset form
      setFormData({
        ...formData,
        ID_Debitur: "",
        Nama_Debitur: "",
        No_Rekening: "",
      });
    } catch (error) {
      console.error("Gagal mengirim data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold">Tambah Data Debitur WO</h2>
      
      <div>
        <label className="block text-sm font-medium">ID Debitur</label>
        <input 
          type="text" 
          name="ID_Debitur" 
          value={formData.ID_Debitur} 
          onChange={handleChange} 
          required 
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nama Debitur</label>
        <input 
          type="text" 
          name="Nama_Debitur" 
          value={formData.Nama_Debitur} 
          onChange={handleChange} 
          required 
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">No Rekening</label>
        <input 
          type="text" 
          name="No_Rekening" 
          value={formData.No_Rekening} 
          onChange={handleChange} 
          required 
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Analis Recovery</label>
        <input 
          type="text" 
          name="Nama_Analis_Recovery" 
          value={formData.Nama_Analis_Recovery} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Menyimpan..." : "Simpan ke Sheet"}
      </button>
    </form>
  );
}