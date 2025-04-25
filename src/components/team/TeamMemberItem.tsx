import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useSelector } from 'react-redux';
interface TeamMemberItemProps {
  member: any;
  userProfilePicture: any;
  onRemovePlayer?: (playerId: string) => void;
  isCaptain?: boolean;
}

const TeamMemberItem = ({ member, userProfilePicture, onRemovePlayer, isCaptain }: TeamMemberItemProps) => {
  console.log(member);
  const user = useSelector((state: any) => state.user);
  const isCurrentUser = member.id === user.id;
  return (
    <View className='flex-row items-center justify-between border border-gray-300 rounded-lg p-4 mt-3'>
      <View className='flex-row items-center'>
      <Image 
        source={member.photoURL ? { uri: member.photoURL } : userProfilePicture} 
        className='w-12 h-12 rounded-xl' 
      />
      <View className='ml-2'>
        <Text className={`text-primary text-lg font-semibold`}>{member.fullName || member.displayName || member.name} {isCurrentUser ? '(You)' : ''}</Text>
        <Text className={`text-primary text-base`}>@{member.username}</Text>
      </View>
      </View>
      {isCaptain && !isCurrentUser && (
        <TouchableOpacity onPress={() => onRemovePlayer(member.id)}>
          <AntDesign name="delete" size={20} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TeamMemberItem; 