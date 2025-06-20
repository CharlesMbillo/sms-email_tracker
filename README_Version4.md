# TransactionSync (React Native)

Reads transaction SMSes and emails, parses transaction info, and uploads to Google Sheets.

## Features
- Listens for incoming SMS (Android)
- Parses transaction amount, sender, and date
- Authenticates via Google Sign-In (Sheets + Gmail scope)
- Imports and parses Gmail for transaction emails
- Uploads to Google Sheets
- User feedback via Toasts/Alerts

## Setup

1. Clone this repo.
2. Run `npm install` or `yarn`.
3. Fill in your Google Cloud credentials:
   - Set your `webClientId` in `src/utils/GoogleAuth.ts`.
   - Set your `SPREADSHEET_ID` in `src/utils/GoogleSheetsUploader.ts`.
4. For Android: Grant SMS permissions.
5. Run `npx react-native run-android`.

## Gmail Parsing Examples

The app parses emails like:
- `"Your A/C XX1234 is debited by INR 1,000.00 on ..."`
- `"You spent $25.67 at SUPERMARKET on ..."`
- `"Amount credited by USD 250.00 from ACME Corp ..."`

You can add more regexes in `parseGmailTransaction()` in `src/utils/TransactionParser.ts`.

## CI/CD

See `.github/workflows/react-native.yml` for a sample GitHub Actions workflow.

## License

MIT