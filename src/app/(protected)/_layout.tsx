import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { router, Stack } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { app } from '@/config/firebase';
import { colors } from '@/constants/colors';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useAuth } from '@/providers/auth';
import { useDispatch } from 'react-redux';
import { setUser as setUserRedux } from '@/redux/reducers/User';
import { teamService } from '@/services/teamService';
import { getUser } from '@/services/userService';
const ProtectedLayout = () => {
  const { user } = useAuth()
  const dispatch = useDispatch();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  const setUser = async () => {
    const userData = await getUser(user.uid);
    dispatch(setUserRedux({
      email: user.email,
      uid: user.uid,
      username: userData?.username,
      fullName: userData?.fullName,
      photoURL: userData?.photoURL || ''
    }))
  }

  useEffect(() => {
    setUser();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create"
        options={{
          headerBackTitle: 's',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerShown: true,
          headerTitle: 'Create New Team',
          headerTitleStyle: { color: colors.text },
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
