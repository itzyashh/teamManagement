import { View, Text, SafeAreaView, TouchableOpacity, Button, ScrollView, FlatList, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons'
import { colors } from '@/constants/colors'
import { router } from 'expo-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { deleteUser } from 'firebase/auth'
import { useAuth } from '@/providers/auth'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '@/redux/reducers/User'
import { teamService } from '@/services/teamService'
import { Team, TeamMember } from '@/types/team'

const Home = () => {
  const { user:FirebaseUser } = useAuth()
  const user = useSelector((state: any) => state.user)
  console.log('home',user);
  const [teams, setTeams] = useState<Team[]>([]);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    signOut(auth);
  }

  const handleDeleteAccount = () => {
    deleteUser(FirebaseUser!);
    dispatch(clearUser());
  }

  const getTeams = async () => {
    if (!user.uid) return;
    try {
      const teamsData = await teamService.getUserTeams(user.uid);
      console.log('teams', teamsData);
      if (teamsData) {
        setTeams(teamsData);
      }
    } catch (err) {
      console.log('error2', err);
    }
  }

  useEffect(() => {
    getTeams();
  }, [user]);
  
  return (
    <SafeAreaView className='flex-1 justify-center items-center'>

      <FlatList
        data={teams}
        className="w-full px-4"
        renderItem={({ item }) => {
          return (
            <View className='w-full  justify-between items-center gap-2 border border-gray-300 rounded-lg p-2 mb-2'>
              <View className='w-full p-2 flex-row justify-between items-center gap-2'>
                <View className='flex-row items-center gap-2'>
                <Image source={item.logoUrl ? { uri: item.logoUrl } : require('../../../assets/user.jpeg')} className='w-11 h-11 rounded-lg' />
                <Text className='text-primary font-bold ml-4'>{item.name}</Text>
              </View>
              <View className='flex-row items-center gap-2'>
                <TouchableOpacity onPress={() => teamService.deleteTeam(item.id!)}>
                  <AntDesign name="delete" size={20} color={colors.text} />
                </TouchableOpacity>
                <Entypo name="circle" size={23} color="gray" />
              </View>
              </View>
              <View className='w-full h-[1px] bg-gray-300' />
              <View className='w-full py-2 flex-row justify-between items-center gap-2'>
                <Text className='text-primary font-bold ml-4'>Team Members: </Text>
                <Text className='text-primary font-bold ml-4'>{item.members.length} members</Text>
              </View>
            </View>
          )
        }}
      />

      <Button title='Logout' onPress={handleLogout} />
      <Button title='Delete Account' onPress={handleDeleteAccount} />
      <View className='flex-row items-center gap-4'>
        <View className='w-full h-[1px] bg-gray-300' />
        <Text className='text-primary font-bold'>Or</Text>
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