import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "@/config/firebase";
import firestore from '@react-native-firebase/firestore';
import { doc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  register: (formData: any) => Promise<User>;
  login: (formData: any) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  register: async () => {
    throw new Error("Not implemented");
  },
  login: async () => {
    throw new Error("Not implemented");
  }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = async (formData: any) => {
    try {
      const auth = getAuth();
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert(JSON.stringify(res))
      await setDoc(doc(db, 'users', res.user.uid), {
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        createdAt: new Date()
      })
      return res.user;
    } catch (error) {
      alert(JSON.stringify(error))
      throw error;
    }
  }

  const login = async (formData: any) => {
    try {
      const auth = getAuth();
      const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      return res.user;
    } catch (error) {
      alert(JSON.stringify(error))
      throw error;
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext
export const useAuth = () => useContext(AuthContext)