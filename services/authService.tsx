import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from "firebase/auth";
  import { FIREBASE_AUTH } from "@/config/firebaseConfig";
  import { Alert } from "react-native";
  import { FirebaseError } from "firebase/app";
  
  
  // Function to listen to auth state changes
  export const authStateListener = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(FIREBASE_AUTH, callback);
  };
  
  // Sign in function
  export const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
  
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.log("Error", `Inicio de sesión fallido: ${firebaseError.message}`);
      throw error;
    }
  };
  
  // Sign up function
  export const signUp = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      Alert.alert("Éxito", "Registro exitoso");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(`Registro fallido: ${firebaseError.message}`);
    }
  };
  
  
  // Logout function
  export const logout = async (): Promise<void> => {
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      throw new Error(`Cierre de sesión fallido: ${firebaseError.message}`);
    }
  };
  