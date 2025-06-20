# Product Requirements Document (PRD)

## Product Name
**TransactionSync**

## Authors & Stakeholders
- Product Owner: Charles Mbillo
- Users: Android/React Native users needing to track financial transactions from SMS and/or email, and sync to Google Sheets

---

## 1. Purpose

TransactionSync aims to automate the personal finance tracking process by reading transaction notifications from SMS and email, parsing relevant data (amount, date, merchant, etc.), and uploading them in real-time to a user’s Google Sheet for analysis, budgeting, or record-keeping.

---

## 2. Problem Statement

Manual entry of transaction data from SMS/email notifications into spreadsheets is tedious, error-prone, and time-consuming. There’s a need for an automated solution that:
- Reads bank/payment SMSes and transaction-related emails,
- Parses the transaction data,
- Uploads/organizes the data into Google Sheets for further use.

---

## 3. Goals & Objectives

- **Automate** the extraction and logging of financial transactions from SMS and emails.
- **Seamless Integration** with Google Sheets for data storage and easy access.
- **Cross-Platform Availability** (Android native and React Native for iOS/Android).
- **User Privacy & Security** through transparent permissions and OAuth2 authentication.
- **Robust Error Handling** and user feedback.

---

## 4. Features

### 4.1. Core Features

#### 4.1.1. SMS Reading (Android)
- Listen to incoming SMS messages.
- Filter/identify transaction-related SMSes.
- Parse transaction details (amount, sender/merchant, date, description).

#### 4.1.2. Email Reading (Gmail API)
- Authenticate with Gmail using OAuth2.
- Fetch recent transaction-related emails (configurable date range/filters).
- Parse transaction details from email content (amount, sender, date, etc.).

#### 4.1.3. Transaction Parsing
- Support common bank/payment SMS/email formats (regex/NLP-based).
- Extract: amount, sender/merchant, date, description, balance (if present).

#### 4.1.4. Google Sheets Integration
- Authenticate via Google Sign-In (OAuth2).
- Allow user to select or specify a Google Sheet and worksheet.
- Append parsed transaction data as rows in real time.

#### 4.1.5. UI/UX
- Show recent transactions in app UI.
- Show sync status, errors, and success notifications.
- Manual triggers: sync now, import from Gmail, retry failed.
- Settings: configure filters, choose Google account, select sheet.

#### 4.1.6. Error Handling & Reporting
- User-friendly error messages for permissions, connectivity, and sync errors.
- Logging for debugging (optional: export logs).
- Toasts/alerts for key actions.

#### 4.1.7. Security & Privacy
- Clearly explain all permissions (SMS, email, Google account).