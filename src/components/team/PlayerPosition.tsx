import { View, Text, TextInput } from 'react-native';
import React from 'react';
import { colors } from '@/constants/colors';
import TeamMemberItem from './TeamMemberItem';
import UserSearchResults from './UserSearchResults';

interface PlayerPositionProps {
  positionNumber: string;
  playerPosition: string;
  teamMembers: any[];
  searchQuery: {[key: string]: string};
  activeTextInput: string | null;
  searchResults: any[];
  userProfilePicture: any;
  onSearch: (text: string, position: string) => void;
  onFocus: (position: string) => void;
  onAddPlayer: (player: any, position: string) => void;
  isCaptain?: boolean;
}

const PlayerPosition = ({
  positionNumber,
  playerPosition,
  teamMembers,
  searchQuery,
  activeTextInput,
  searchResults,
  userProfilePicture,
  onSearch,
  onFocus,
  onAddPlayer,
  isCaptain = false
}: PlayerPositionProps) => {
  const playerExists = teamMembers.find(member => member.playerPosition === playerPosition);
  console.log(searchResults,'searchResults');
  return (
    <View className="mb-4">
      <View className='flex-row justify-between items-center'>
        <View className='flex-row items-center gap-2'>
          <Text className={`text-primary text-lg font-semibold`}>{positionNumber}</Text>
          {playerExists && playerExists.invitationStatus === 'invited' && (
            <View className='px-2 bg-gray-400 rounded-full'>
              <Text className={`text-white text-sm font-semibold capitalize`}>
                {playerExists.searchMethod} - {playerExists.invitationStatus}
              </Text>
            </View>
          )}
        </View>
        {isCaptain ? (
          <Text style={{ color: colors.primary }} className={`text-primary text-base`}>Captain</Text>
        ) : (
          <Text className={`text-primary text-base`}>Mark Captain</Text>
        )}
      </View>
      
      {playerExists ? (
        <TeamMemberItem member={playerExists} userProfilePicture={userProfilePicture} />
      ) : (
        <TextInput
          value={searchQuery[playerPosition]}
          onChangeText={(text) => onSearch(text, playerPosition)}
          onFocus={() => onFocus(playerPosition)}
          placeholder='Enter @Username/Phone/Email'
          className='border border-gray-300 rounded-lg p-4 mt-3'
          autoCapitalize='none'
        />
      )}
      
      {activeTextInput === playerPosition && (
        <UserSearchResults 
          results={searchResults} 
          onSelect={onAddPlayer} 
          playerPosition={playerPosition} 
        />
      )}
      
      {activeTextInput === playerPosition && searchResults.length > 0 && (
        <Text className="text-xs text-gray-500 mt-1 ml-1">
          Showing best matches first based on relevance
        </Text>
      )}
    </View>
  );
};

export default PlayerPosition; 