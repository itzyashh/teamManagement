import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getProfilePicture } from 'utils';
import { useSelector } from 'react-redux';
import { teamService } from '@/services/teamService';

const CreateTeam = () => {
  const user = useSelector((state: any) => state.user);
  const [userProfilePicture, setUserProfilePicture] = useState(require('../../../assets/user.jpeg'));
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [createdBy, setCreatedBy] = useState(user.uid);

  const handleCreateTeam = async () => {
    console.log('Create Team');
    try {
      const team = await teamService.createTeam({
        name: teamName || 'Untitled Team',
        members: [{ 
          uid: user.uid, 
          name: user.fullName, 
          contactMethod: { type: 'userId', value: user.uid }, 
          invitationStatus: 'accepted', 
          role: 'captain',
          joinedAt: new Date()
        }],
        logoUrl: teamLogo,
        createdBy: user.uid,
        isRegistrationComplete: false,
      });
    } catch (error) {
      console.log('Team creation error:', error);
    }
  }
  return (
    <SafeAreaView className='flex-1'>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

   

      <ScrollView className='pt-10 px-4 gap-4' contentContainerClassName='gap-4'>

      <View className='justify-center items-center'>
        <View className='w-24 h-24 border border-gray-300 rounded-2xl border-dashed justify-center items-center'>
            <View style={{ backgroundColor: colors.primary }} className={`w-12 h-12 justify-center items-center rounded-full`}>
            <MaterialCommunityIcons name="camera-plus-outline" size={24} color="white" />
            </View>
        </View>
        <Text className={`mt-2 text-primary text-lg font-semibold`}>Team Logo</Text>
      </View>

        <View>
        <Text className={`text-primary text-lg font-semibold`}>Team Name</Text>
        <TextInput
          placeholder='Enter Team Name'
          className='border border-gray-300 rounded-lg p-4 mt-3'
        />
        </View>
          <View className="mb-4">
            <View className='flex-row justify-between items-center'>
            <Text className={`text-primary text-lg font-semibold`}>Player 1</Text>
            <Text style={{ color: colors.primary }} className={`text-primary text-base`}>Captain</Text>
            </View>
            <View className='flex-row items-center border border-gray-300 rounded-lg p-4 mt-3'>
              <Image source={userProfilePicture} className='w-12 h-12 rounded-xl' />
              <View className='ml-2'>
                <Text className={`text-primary text-lg font-semibold`}>{user.fullName} (You)</Text>
                <Text className={`text-primary text-base`}>@{user.username}</Text>
              </View>
            </View>
          </View>
          <View className="mb-4">
            <View className='flex-row justify-between items-center'>
            <Text className={`text-primary text-lg font-semibold`}>Player 2</Text>
            <Text className={`text-primary text-base`}>Mark Captain</Text>
            </View>
            <TextInput
              placeholder='Enter @Username/Phone/Email'
              className='border border-gray-300 rounded-lg p-4 mt-3'
            />
          </View>
          <View className="mb-4">
            <View className='flex-row justify-between items-center'>
            <Text className={`text-primary text-lg font-semibold`}>Player 3</Text>
            <Text className={`text-primary text-base`}>Mark Captain</Text>
            </View>
            <TextInput
              placeholder='Enter @Username/Phone/Email'
              className='border border-gray-300 rounded-lg p-4 mt-3'
            />
          </View>
          <View className="mb-4">
            <View className='flex-row justify-between items-center'>
            <Text className={`text-primary text-lg font-semibold`}>Player 4</Text>
            <Text className={`text-primary text-base`}>Mark Captain</Text>
            </View>
            <TextInput
              placeholder='Enter @Username/Phone/Email'
              className='border border-gray-300 rounded-lg p-4 mt-3 mb-10'
            />
          </View>
      </ScrollView>
      <TouchableOpacity
       className='bg-primary p-4 rounded-full w-[90%] items-center justify-center mx-auto'
       onPress={handleCreateTeam}
      >
        <Text className={`text-white text-lg font-semibold`}>Create Team</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default CreateTeam;
