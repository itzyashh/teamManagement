import { View, Text, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
const CreateTeam = () => {
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

      <View className='mt-10 justify-center items-center'>
        <View className='w-24 h-24 border border-gray-300 rounded-2xl border-dashed justify-center items-center'>
            <View style={{ backgroundColor: colors.primary }} className={`w-12 h-12 justify-center items-center rounded-full`}>
            <MaterialCommunityIcons name="camera-plus-outline" size={24} color="white" />
            </View>
        </View>
        <Text className={`mt-2 text-primary text-lg font-semibold`}>Team Logo</Text>
      </View>

      <View className='mt-10 px-4 gap-4'>
        <View>
        <Text className={`text-primary text-lg font-semibold`}>Team Name</Text>
        <TextInput
          placeholder='Enter Team Name'
          className='border border-gray-300 rounded-lg p-4 mt-3'
        />
        </View>
        {[1, 2, 3, 4].map((num) => (
          <View key={num} className="mb-4">
            <View className='flex-row justify-between items-center'>
            <Text className={`text-primary text-lg font-semibold`}>Player {num}</Text>
            <Text className={`text-primary text-base`}>Mark Captain</Text>
            </View>
            <TextInput
              placeholder='Enter Player Name'
              className='border border-gray-300 rounded-lg p-4 mt-3'
            />
          </View>
        ))}
      </View>


    </SafeAreaView>
  );
};

export default CreateTeam;
