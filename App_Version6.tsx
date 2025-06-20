import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Button, FlatList, View, ActivityIndicator, PermissionsAndroid, Platform, Alert } from "react-native";
import SmsReceiver from "react-native-sms-receiver";
import { parseTransaction, Transaction } from "./src/utils/TransactionParser";
import { configureGoogleSignIn, signInWithGoogle } from "./src/utils/GoogleAuth";
import { uploadToGoogleSheets } from "./src/utils/GoogleSheetsUploader";
import { fetchAndParseGmailTransactions } from "./src/utils/GmailParser";
import { notify } from "./src/utils/Notifier";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
    requestSmsPermission();
  }, []);

  // Request SMS permissions (Android only)
  const requestSmsPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.READ_SMS,
        ]);
        if (granted['android.permission.RECEIVE_SMS'] !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'SMS permission is required for transaction parsing.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    const subscription = SmsReceiver.addListener(async (message) => {
      const transaction = parseTransaction(message.body);
      if (transaction) {
        setTransactions((prev) => [transaction, ...prev]);
        if (isSignedIn) {
          try {
            await uploadToGoogleSheets(transaction);
            notify("Transaction uploaded to Google Sheets");
          } catch (err: any) {
            notify("Failed to upload SMS transaction: " + (err?.message || err));
          }
        }
      }
    });
    return () => subscription.remove();
  }, [isSignedIn]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsSignedIn(true);
      notify("Signed in with Google");
    } catch (err: any) {
      notify("Sign in failed: " + (err?.message || err));
    }
  };

  const onImportGmail = async () => {
    setLoading(true);
    try {
      const txns = await fetchAndParseGmailTransactions();
      setTransactions((prev) => [...txns, ...prev]);
      notify(`Imported ${txns.length} transactions from Gmail`);
    } catch (err: any) {
      notify("Gmail import failed: " + (err?.message || err));
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TransactionSync</Text>
      <Button title={isSignedIn ? "Signed In" : "Sign in with Google"} onPress={handleSignIn} />
      <Button title="Import from Gmail" onPress={onImportGmail} />
      {loading && <ActivityIndicator />}
      <FlatList
        data={transactions}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <Text style={styles.amount}>${item.amount}</Text>
            <Text>{item.sender}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <Text numberOfLines={2}>{item.desc}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginVertical: 10 },
  transaction: { marginVertical: 6, padding: 8, borderWidth: 1, borderRadius: 6, borderColor: "#eee" },
  amount: { fontWeight: "bold", fontSize: 18, color: "#0A0" },
  date: { color: "#888", fontSize: 12 }
});