import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { ImageSourcePropType } from "react-native";
const getProfilePicture = async (user: any)=> {
 if (user.photoURL) {
    return { uri: user.photoURL };
 } else {
    return require('../assets/user.jpeg');
 }
}

export { getProfilePicture };