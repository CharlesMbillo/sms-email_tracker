export type Transaction = {
  amount: number;
  sender: string;
  date: string;
  desc?: string;
};

export function parseTransaction(message: string): Transaction | null {
  // Common patterns for amounts: "INR 1,234.56", "USD 123.45", "KES 1000"
  const amountMatch = message.match(/(?:INR|KES|USD|Rs\.?|\$)\s?([\d,]+\.?\d*)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null;

  // Try to extract sender info (for banks, might match "from X", "by X", etc.)
  let senderMatch = message.match(/from\s+([A-Za-z0-9 ]+)/i) ||
                    message.match(/by\s+([A-Za-z0-9 ]+)/i) ||
                    message.match(/at\s+([A-Za-z0-9 ]+)/i);
  const sender = senderMatch ? senderMatch[1].trim() : "Unknown Sender";

  if (!amount) return null;
  const date = new Date().toISOString();

  return { amount, sender, date, desc: message };
}

// Examples for more robust parsing:
export function parseGmailTransaction(message: string): Transaction | null {
  // Example: "Dear Customer, Your A/C XX1234 is debited by INR 1,000.00 on 2025-06-20. Avl Bal: ..."
  // Example: "You spent $25.67 at SUPERMARKET on 2025-06-19. Card: XXXX1234"
  const amountMatch = message.match(/(?:debited by|spent|credited by|received)\s*(INR|USD|KES|\$|Rs\.?)\s?([\d,]+\.?\d*)/i) ||
                      message.match(/(?:INR|USD|KES|Rs\.?|\$)\s?([\d,]+\.?\d*)/i);
  const amount = amountMatch ? parseFloat(amountMatch[2]?.replace(/,/g, "") || amountMatch[1]?.replace(/,/g, "")) : null;

  // Extract merchant or card info
  let senderMatch = message.match(/at\s+([A-Za-z0-9 &]+)/i) ||
                    message.match(/to\s+([A-Za-z0-9 &]+)/i) ||
                    message.match(/Card:\s*([A-Za-z0-9]+)/i);
  const sender = senderMatch ? senderMatch[1].trim() : "Unknown Sender";

  if (!amount) return null;
  const date = new Date().toISOString();

  return { amount, sender, date, desc: message };
}