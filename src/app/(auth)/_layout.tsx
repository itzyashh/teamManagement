import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { getAuth } from 'firebase/auth'
import { useAuth } from '@/providers/auth'


const AuthLayout = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <ActivityIndicator />
  }

// alert(JSON.stringify(user))
  if (user) {
    return <Redirect href="/(protected)" />
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  )
}

export default AuthLayout