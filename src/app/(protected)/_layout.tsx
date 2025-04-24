import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router, Stack } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { app } from '@/config/firebase';
import { colors } from '@/constants/colors';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useAuth } from '@/providers/auth';
const ProtectedLayout = () => {
  const { user } = useAuth()

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

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
