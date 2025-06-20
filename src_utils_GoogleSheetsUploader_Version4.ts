import axios from "axios";
import { getAccessToken } from "./GoogleAuth";
import { Transaction } from "./TransactionParser";

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";
const SHEET_NAME = "Sheet1";
const RANGE = `${SHEET_NAME}!A:D`;

export async function uploadToGoogleSheets(transaction: Transaction) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) throw new Error("Google access token not available");

    const values = [
      [transaction.date, transaction.sender, transaction.amount, transaction.desc || ""]
    ];

    await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append`,
      { values, majorDimension: "ROWS" },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        params: { valueInputOption: "RAW" }
      }
    );
  } catch (err: any) {
    console.warn("Failed to upload to Google Sheets:", err?.message || err);
    throw err;
  }
}