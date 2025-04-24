import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/config/firebase";
import firestore from '@react-native-firebase/firestore';
import { doc, setDoc } from "firebase/firestore";

  

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  register: (email: string, password: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  register: async () => {
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

  const register = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        username: 'test',
        fullName: 'test',
        createdAt: new Date()
      })
      return res.user;
    } catch (error) {
      alert(JSON.stringify(error))
      throw error;
    }
  }
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext
export const useAuth = () => useContext(AuthContext)