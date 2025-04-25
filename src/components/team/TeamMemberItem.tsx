import { View, Text, Image } from 'react-native';
import React from 'react';

interface TeamMemberItemProps {
  member: any;
  userProfilePicture: any;
}

const TeamMemberItem = ({ member, userProfilePicture }: TeamMemberItemProps) => {
  return (
    <View className='flex-row items-center border border-gray-300 rounded-lg p-4 mt-3'>
      <Image 
        source={member.photoURL ? { uri: member.photoURL } : userProfilePicture} 
        className='w-12 h-12 rounded-xl' 
      />
      <View className='ml-2'>
        <Text className={`text-primary text-lg font-semibold`}>{member.fullName || member.displayName || member.name}</Text>
        <Text className={`text-primary text-base`}>@{member.username}</Text>
      </View>
    </View>
  );
};

export default TeamMemberItem; 