import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";

const useSocialAuth = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);

  const authWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;
      const user: any = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      const accessToken = user.stsTokenManager.accessToken;
      console.log("xxxxxx", { accessToken, additionalInfo });
      return { token: accessToken };
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error({ errorCode, errorMessage, email, credential });
    }
  };

  return authWithGoogle;
};

export default useSocialAuth;

