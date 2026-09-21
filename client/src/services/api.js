// src/services/api.js

// Ganti string ini dengan Web App URL dari Google Apps Script kamu
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

/**
 * Mengambil data dari sheet tertentu
 * @param {string} sheetName - 'DATA_DEBITUR_WO', 'REKAP_ANALIS_RECOVERY', atau 'MONITORING_KREDIT_AKTIF'
 */
export const fetchSheetData = async (sheetName = "DATA_DEBITUR_WO") => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${sheetName}`);
    const result = await response.json();
    
    if (result.status === "success") {
      return result.data;
    } else {
      console.error("Gagal mengambil data:", result.message);
      return [];
    }
  } catch (error) {
    console.error("Error pada network/fetch:", error);
    return [];
  }
};

/**
 * Menambah baris data baru ke sheet tertentu
 * @param {string} sheetName - Nama sheet target
 * @param {object} payload - Objek data (misal: { NAMA_DEBITUR: "John", PLAFOND: 50000000 })
 */
export const postSheetData = async (sheetName, payload) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        sheetName: sheetName,
        ...payload
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    return { status: "error", message: error.toString() };
  }
};