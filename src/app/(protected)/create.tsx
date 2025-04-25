import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { getProfilePicture } from 'utils';
import { useSelector } from 'react-redux';
import { teamService } from '@/services/teamService';
import { searchUser } from '@/services/userService';
import { TeamMember, InvitationStatus, MemberRole } from '@/types/team';
import PlayerPosition from '@/components/team/PlayerPosition';
import * as ImagePicker from 'expo-image-picker';
const CreateTeam = () => {
  const user = useSelector((state: any) => state.user);
  console.log(user,'user at create');
  const [userProfilePicture, setUserProfilePicture] = useState(require('../../../assets/user.jpeg'));
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([
    {
      id: user.id,
      contactMethod: { type: 'userId' as const, value: user.id },
      invitationStatus: 'accepted' as InvitationStatus,
      role: 'captain' as MemberRole,
      playerPosition: 'player1',
      username: user.username,
      fullName: user.fullName
    }
  ]);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [createdBy, setCreatedBy] = useState(user.id);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTextInput, setActiveTextInput] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{[key: string]: string}>({
    player2: '',
    player3: '',
    player4: ''
  });

  const handleSearch = async (query: string, player: string) => {
    setSearchQuery({...searchQuery, [player]: query});
    if (query.length > 0) {
      const results = await searchUser(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  const pickImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setTeamLogo(result.assets[0].uri);
    }
  }
  console.log(teamMembers,'teamMembers');
  const handleAddPlayer = (player: any, playerPosition: string) => {
    const newPlayer = {
      playerPosition: playerPosition,
      searchMethod: player.searchMethod,
      contactMethod: player.searchMethod === 'email' ? { type: 'email' as const, value: player.email } : { type: 'username' as const, value: player.username },
      role: 'player',
      ...player
    }
    setTeamMembers([...teamMembers, newPlayer]);
    setSearchResults([]);
    setSearchQuery({...searchQuery, [playerPosition]: player.username || player.fullName});
    setActiveTextInput(null);
  }

  const handleCreateTeam = async () => {
    console.log('Create Team');
    try {

      // upload team logo to storage


      const teamId = await teamService.createTeam({
        name: teamName || 'Untitled Team',
        members: teamMembers.map(member => ({
          uid: member.id,
          name: member.fullName,
          contactMethod: member.contactMethod,
          invitationStatus: member.role === 'captain' ? 'accepted' as InvitationStatus : 'invited' as InvitationStatus,
          role: member.role as MemberRole,
          joinedAt: new Date(),
          ...member
        })),
        logoUrl: null,
        createdBy: user.id,
        isRegistrationComplete: false,
      });

      // upload team logo to storage
      await teamService.uploadTeamLogo(teamId, teamLogo);
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
         {teamLogo ? (
          <Image source={{ uri: teamLogo }} className='w-24 h-24 rounded-2xl' />
         ) : (
          <TouchableOpacity
           onPress={pickImage}
           className='w-24 h-24 border border-gray-300 rounded-2xl border-dashed justify-center items-center'>
              <View style={{ backgroundColor: colors.primary }} className={`w-12 h-12 justify-center items-center rounded-full`}>
              <MaterialCommunityIcons name="camera-plus-outline" size={24} color="white" />
              </View>
          </TouchableOpacity>
         )}
          <Text className={`mt-2 text-primary text-lg font-semibold`}>Team Logo</Text>
        </View>

        <View>
          <Text className={`text-primary text-lg font-semibold`}>Team Name</Text>
          <TextInput
            placeholder='Enter Team Name'
            className='border border-gray-300 rounded-lg p-4 mt-3'
            value={teamName}
            onChangeText={setTeamName}
          />
        </View>
        
        {/* Player 1 (Captain) */}
        <PlayerPosition
          positionNumber="Player 1"
          playerPosition="player1"
          teamMembers={teamMembers}
          searchQuery={searchQuery}
          activeTextInput={activeTextInput}
          searchResults={searchResults}
          userProfilePicture={userProfilePicture}
          onSearch={handleSearch}
          onFocus={setActiveTextInput}
          onAddPlayer={handleAddPlayer}
          isCaptain={true}
        />
        
        {/* Player 2 */}
        <PlayerPosition
          positionNumber="Player 2"
          playerPosition="player2"
          teamMembers={teamMembers}
          searchQuery={searchQuery}
          activeTextInput={activeTextInput}
          searchResults={searchResults}
          userProfilePicture={userProfilePicture}
          onSearch={handleSearch}
          onFocus={setActiveTextInput}
          onAddPlayer={handleAddPlayer}
        />
        
        {/* Player 3 */}
        <PlayerPosition
          positionNumber="Player 3"
          playerPosition="player3"
          teamMembers={teamMembers}
          searchQuery={searchQuery}
          activeTextInput={activeTextInput}
          searchResults={searchResults}
          userProfilePicture={userProfilePicture}
          onSearch={handleSearch}
          onFocus={setActiveTextInput}
          onAddPlayer={handleAddPlayer}
        />
        
        {/* Player 4 */}
        <PlayerPosition
          positionNumber="Player 4"
          playerPosition="player4"
          teamMembers={teamMembers}
          searchQuery={searchQuery}
          activeTextInput={activeTextInput}
          searchResults={searchResults}
          userProfilePicture={userProfilePicture}
          onSearch={handleSearch}
          onFocus={setActiveTextInput}
          onAddPlayer={handleAddPlayer}
        />
      </ScrollView>
      
      <TouchableOpacity
        className='bg-primary p-4 rounded-full w-[90%] items-center justify-center mx-auto mb-4'
        onPress={handleCreateTeam}
      >
        <Text className={`text-white text-lg font-semibold`}>Create Team</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateTeam;
