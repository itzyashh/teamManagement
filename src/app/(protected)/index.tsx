import { View, Text, SafeAreaView, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons'
import { colors } from '@/constants/colors'
import { router } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { deleteUser } from 'firebase/auth'
import { useAuth } from '@/providers/auth'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '@/redux/reducers/User'
const Home = () => {
  const { user:FirebaseUser } = useAuth()
  const user = useSelector((state: any) => state.user)
  console.log('home',user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    signOut(auth);
  }

  const handleDeleteAccount = () => {
    deleteUser(FirebaseUser!);
    dispatch(clearUser());
  }
  
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>
      <Button title='Logout' onPress={handleLogout} />
      <Button title='Delete Account' onPress={handleDeleteAccount} />
      <View className='flex-row items-center gap-4'>
        <View className='w-full h-[1px] bg-gray-300' />
        <Text>Or</Text>
        <View className='w-full h-[1px] bg-gray-300' />
      </View>
      <TouchableOpacity 
      onPress={() => router.push('/create')}
      style={{ borderColor: colors.primary }}
      className={`mt-10 px-4 py-2 rounded-full flex-row items-center gap-2 border-2`}>
        <Entypo name='plus' size={24} color={colors.primary} />
        <Text style={{ color: colors.primary }} className={`font-bold text-lg`}>Create New Team</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home