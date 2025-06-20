import axios from "axios";
import { getAccessToken } from "./GoogleAuth";
import { parseGmailTransaction, Transaction } from "./TransactionParser";

// Helper: Recursively extract plain text from Gmail message parts
function getPlainTextFromPayload(payload: any): string {
  if (!payload) return "";
  if (payload.mimeType === "text/plain" && payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf8");
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      const text = getPlainTextFromPayload(part);
      if (text) return text;
    }
  }
  return "";
}

export async function fetchAndParseGmailTransactions(): Promise<Transaction[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error("Google access token not available");

  // Only look for "transaction" emails from last 2 days (customize query as needed)
  const q = 'newer_than:2d (subject:debit OR subject:credit OR "transaction" OR "alert" OR "purchase")';
  const messagesRes = await axios.get(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q, maxResults: 10 },
    }
  );

  if (!messagesRes.data.messages) return [];

  const transactions: Transaction[] = [];
  for (const { id } of messagesRes.data.messages) {
    const msgRes = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const text = getPlainTextFromPayload(msgRes.data.payload);
    const txn = parseGmailTransaction(text);
    if (txn) transactions.push(txn);
  }
  return transactions;
}