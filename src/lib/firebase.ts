import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Reemplaza estos valores con la configuración de tu proyecto en Firebase Console
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto y añade una aplicación web
// 3. Copia el objeto firebaseConfig y pégalo aquí
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
