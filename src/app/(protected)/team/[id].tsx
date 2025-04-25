import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useSelector } from 'react-redux';
import { teamService } from '@/services/teamService';
import { searchUser } from '@/services/userService';
import { TeamMember, InvitationStatus, MemberRole, Team } from '@/types/team';
import PlayerPosition from '@/components/team/PlayerPosition';
import UserSearchResults from '@/components/team/UserSearchResults';
import TeamMemberItem from '@/components/team/TeamMemberItem';

const TeamDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const teamId = id as string;
  const user = useSelector((state: any) => state.user);
  const [userProfilePicture, setUserProfilePicture] = useState(require('../../../../assets/user.jpeg'));
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<MemberRole | null>(null);
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus | null>(null);
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTextInput, setActiveTextInput] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{[key: string]: string}>({
    player2: '',
    player3: '',
    player4: ''
  });

  // Handle team data updates
  const handleTeamUpdates = (teamData: Team) => {
    setTeam(teamData);
    setTeamName(teamData.name);
    setTeamLogo(teamData.logoUrl);
    setTeamMembers(teamData.members);
    
    // Find current user's role and invitation status
    const currentUserMember = teamData.members.find((member: TeamMember) => member.uid === user.id);
    if (currentUserMember) {
      setUserRole(currentUserMember.role);
      setInvitationStatus(currentUserMember.invitationStatus);
    }
    
    setLoading(false);
  };
  
  // Set up real-time listener for team data
  useEffect(() => {
    if (!teamId) return;
    
    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = teamService.subscribeToTeamUpdates(teamId, handleTeamUpdates);
    
    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [teamId, user.id]);

  const handleSearch = async (query: string, player: string) => {
    setSearchQuery({...searchQuery, [player]: query});
    if (query.length > 0) {
      const results = await searchUser(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }

  const handleAddPlayer = (player: any, playerPosition: string) => {
    const newPlayer = {
      playerPosition: playerPosition,
      searchMethod: player.searchMethod,
      contactMethod: player.searchMethod === 'email' 
        ? { type: 'email' as const, value: player.email } 
        : { type: 'username' as const, value: player.username },
      role: 'player',
      ...player
    }
    setTeamMembers([...teamMembers, newPlayer]);
    setSearchResults([]);
    setSearchQuery({...searchQuery, [playerPosition]: player.username || player.fullName});
    setActiveTextInput(null);
  }

  const handleRemovePlayer = (playerId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== playerId));
  }

  const handleUpdateCaptain = async (playerId: string) => {
    setTeamMembers(teamMembers.map(member => ({
      ...member,
      role: member.id === playerId ? 'captain' : 'player'
    })));
    await teamService.updateTeamCaptain(teamId, playerId);
  }

  const handleSaveChanges = async () => {
    try {
      await teamService.updateTeam(teamId, {
        name: teamName,
        logoUrl: teamLogo,
        members: teamMembers.map(member => ({
          uid: member.id,
          name: member.fullName,
          contactMethod: member.contactMethod,
          invitationStatus: member.invitationStatus || 'invited',
          role: member.role,
          joinedAt: member.joinedAt || new Date(),
          ...member
        }))
      });
      Alert.alert('Success', 'Team updated successfully');
    } catch (error) {
      console.error('Error updating team:', error);
      Alert.alert('Error', 'Could not update team');
    }
  }

  const handleAcceptInvite = async () => {
    try {
      await teamService.updateMemberStatus(teamId, user.id, 'accepted');
      Alert.alert('Success', 'You have joined the team!');
    } catch (error) {
      console.error('Error accepting invite:', error);
      Alert.alert('Error', 'Could not accept invitation');
    }
  }

  const handleDeclineInvite = async () => {
    try {
      await teamService.updateMemberStatus(teamId, user.id, 'declined');
      Alert.alert('Declined', 'You have declined the team invitation');
      router.back();
    } catch (error) {
      console.error('Error declining invite:', error);
      Alert.alert('Error', 'Could not decline invitation');
    }
  }

  // Custom PlayerPosition component specifically for the team detail view
  const TeamPlayerPosition = ({ member, position }: { member: any, position: string }) => {
    const isCaptain = member.role === 'captain';
    
    return (
      <View className="mb-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text className="text-primary text-lg font-semibold">Player {position}</Text>
            {member.invitationStatus === 'invited' ? (
              <View className="px-2 bg-gray-400 rounded-full">
                <Text className="text-white text-sm font-semibold capitalize">
                  {member.searchMethod || 'User'} - {member.invitationStatus}
                </Text>
              </View>
            ) :
             member.invitationStatus === 'accepted' ? (
              <View className="px-2 bg-gray-400 rounded-full bg-primary">
                <Text className="text-white text-sm font-semibold capitalize">
                  Accepted
                </Text>
              </View>
            ) : (
              <View className="px-2  rounded-full bg-[#B60014]">
                <Text className="text-white text-sm font-semibold capitalize">
                  Declined
                </Text>
              </View>
            )}
          </View>
          
          {userRole === 'captain' && user.id !== member.id ? (
            <View className="flex-row items-center">
              {!isCaptain && (
                <TouchableOpacity 
                  className="mr-4"
                  onPress={() => handleUpdateCaptain(member.id)}
                >
                  <Text className="text-primary text-base">Mark Captain</Text>
                </TouchableOpacity>
              )}
              
              
            </View>
          ) : (
            isCaptain && (
              <Text style={{ color: colors.primary }} className="text-primary text-base">Captain</Text>
            )
          )}
        </View>
        
        <TeamMemberItem member={member} userProfilePicture={userProfilePicture} onRemovePlayer={handleRemovePlayer} isCaptain={userRole === 'captain' && member.id !== user.id} />
      </View>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading team details...</Text>
      </SafeAreaView>
    );
  }


  console.log('teamMembers2', teamMembers);
  // Render team management UI for captains and members
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: team?.name || 'Team Details',
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="pt-4 px-4 gap-4" contentContainerClassName="gap-4">
        <View className="justify-center items-center">
          <View className="w-24 h-24 border border-gray-300 rounded-2xl border-dashed justify-center items-center">
            {teamLogo ? (
              <Image source={{ uri: teamLogo }} className="w-full h-full rounded-2xl" />
            ) : (
              <View style={{ backgroundColor: colors.primary }} className="w-12 h-12 justify-center items-center rounded-full">
                <MaterialCommunityIcons name="camera-plus-outline" size={24} color="white" />
              </View>
            )}
          </View>
          <Text className="mt-2 text-primary text-lg font-semibold">Team Logo</Text>
        </View>

        <View>
          <Text className="text-primary text-lg font-semibold">Team Name</Text>
          <TextInput
            placeholder="Enter Team Name"
            className="border border-gray-300 rounded-lg p-4 mt-3 text-primary"
            value={teamName}
            onChangeText={setTeamName}
            editable={userRole === 'captain'}
          />
        </View>
        
        {/* Team Members */}
       
        
        {teamMembers.map((member, index) => (
          <TeamPlayerPosition 
            key={member.id} 
            member={member} 
            position={(index + 1).toString()} 
          />
        ))}
        
        {/* Add New Player (Captain only) */}
        {userRole === 'captain' && teamMembers.length < 4 && (
          <View className="mb-4">
            <Text className="text-primary text-lg font-semibold">Add New Player</Text>
            <TextInput
              value={searchQuery[`player${teamMembers.length + 1}`]}
              onChangeText={(text) => handleSearch(text, `player${teamMembers.length + 1}`)}
              onFocus={() => setActiveTextInput(`player${teamMembers.length + 1}`)}
              placeholder="Enter @Username/Email"
              className="border border-gray-300 rounded-lg p-4 mt-3"
              autoCapitalize="none"
            />
            
            {activeTextInput && searchResults.length > 0 && (
              <UserSearchResults 
                results={searchResults} 
                onSelect={handleAddPlayer}
                playerPosition={`player${teamMembers.length + 1}`}
              />
            )}
          </View>
        )}
      </ScrollView>
      
      {userRole === 'captain' && (
        <TouchableOpacity
          className="bg-primary p-4 rounded-full w-[90%] items-center justify-center mx-auto mb-4"
          onPress={handleSaveChanges}
        >
          <Text className="text-white text-lg font-semibold">Save Changes</Text>
        </TouchableOpacity>
      )}
      {invitationStatus === 'invited' && (
        <View className='flex-1 justify-center items-center bottom-8'>
          <View className='items-center gap-2 w-[90%]'>
            <TouchableOpacity 
              onPress={handleAcceptInvite}
              className="bg-[#2E7E2E] px-6 py-3 justify-center items-center rounded-full w-full"
            >
              <Text className='text-white text-lg font-semibold'>Accept Invitation</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDeclineInvite}
              className="bg-[#B60014] px-6 py-3 justify-center items-center rounded-full w-full"
            >
              <Text className='text-white text-lg font-semibold'>Decline Invitation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TeamDetailScreen;
