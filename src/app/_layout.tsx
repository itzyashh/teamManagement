import '../../global.css';

import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/redux';
import { AuthProvider } from '@/providers/auth';


export default function Layout() {
  return (
    <AuthProvider>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </AuthProvider>
  )
}
