import { GoogleSignin, statusCodes, User } from 'react-native-google-signin';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/gmail.readonly"
    ],
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch {
    return null;
  }
};