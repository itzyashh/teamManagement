import { doc } from "firebase/firestore";

import { db } from "@/config/firebase";
import { getDoc } from "firebase/firestore";

export const getUser = async (uid: string) => {
    const user = await getDoc(doc(db, 'users', uid));
    return user.data();
}