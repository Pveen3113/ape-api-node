import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../Firebase-ServiceAccount.json";

export const initializeFirebaseAdmin = async () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: "apedell-6e060.appspot.com",
  });
};

export const firebaseAuth = () => admin.auth();

export const firebaseStorage = () => admin.storage();
