import { ToastAndroid, Platform, Alert } from "react-native";

export function notify(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert("", message);
  }
}