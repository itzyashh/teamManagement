import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';

interface UserSearchResultsProps {
  results: any[];
  onSelect: (player: any, position: string) => void;
  playerPosition: string;
}

const UserSearchResults = ({ 
  results, 
  onSelect, 
  playerPosition 
}: UserSearchResultsProps) => {
  if (results.length === 0) return null;
  
  return (
    <View className='border border-gray-300 rounded-lg mt-1 max-h-40'>
      <ScrollView nestedScrollEnabled={true}>
        {results.map((result, index) => (
          <TouchableOpacity 
            key={index} 
            className='p-3 border-b border-gray-200 flex-row items-center'
            onPress={() => onSelect(result, playerPosition)}
          >
            <Image 
              source={result.photoURL ? {uri: result.photoURL} : require('../../../assets/user.jpeg')} 
              className='w-10 h-10 rounded-full' 
            />
            <View className='ml-2'>
              <Text className='font-semibold'>{result.fullName || result.displayName}</Text>
             { result.searchMethod === 'email' ? (
              <Text className='text-gray-600'>{result.email}</Text>
             ) : (
              <Text className='text-gray-600'>@{result.username}</Text>
             )}
            </View>
            <View className='ml-auto'>
              <View className={`px-2 py-1 rounded-full ${getBackgroundColorByScore(result.matchScore)}`}>
                <Text className={`text-xs text-gray-700`}>
                  {result.searchMethod}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Helper function to get background color based on match score
const getBackgroundColorByScore = (score: number): string => {
  if (score >= 90) return 'bg-green-200';
  if (score >= 70) return 'bg-green-100';
  if (score >= 50) return 'bg-yellow-100';
  return 'bg-gray-100';
};

export default UserSearchResults; 