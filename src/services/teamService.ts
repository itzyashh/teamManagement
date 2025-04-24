
import { Team, TeamMember } from '@/types/team'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const teamService = {
  // Create a new team
  async createTeam(team: Omit<Team, 'id' | 'createdAt'>): Promise<string> {
    const teamRef = await firestore().collection('teams').add({
      ...team,
      createdAt: new Date(),
    });
    return teamRef.id;
  },

  // Upload team logo
  async uploadTeamLogo(teamId: string, logoFile: any): Promise<string> {
    const logoRef = storage().ref(`team-logos/${teamId}`);
    await logoRef.put(logoFile);
    return await logoRef.getDownloadURL();
  },

  // Get teams for a user (either created or joined)
  async getUserTeams(userId: string) {
    const teamsSnapshot = await firestore().collection('teams')
      .where('members', 'array-contains', { uid: userId })
      .get();
    
    return teamsSnapshot.docs.map((doc: any): Team => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Update team member status
  async updateMemberStatus(
    teamId: string,
    memberId: string,
    status: 'accepted' | 'declined'
  ) {
    const teamRef = firestore().collection('teams').doc(teamId);
    const team = await teamRef.get();
    
    if (!team.exists) {
      throw new Error('Team not found');
    }

    const teamData = team.data() as Team;
    const memberIndex = teamData.members.findIndex(m => m.uid === memberId);
    
    if (memberIndex === -1) {
      throw new Error('Member not found');
    }

    const updatedMembers = [...teamData.members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      invitationStatus: status,
      ...(status === 'accepted' ? { joinedAt: new Date() } : {})
    };

    await teamRef.update({ members: updatedMembers });
  },

  // Update team captain
  async updateTeamCaptain(teamId: string, newCaptainId: string) {
    const teamRef = firestore().collection('teams').doc(teamId);
    const team = await teamRef.get();
    
    if (!team.exists) {
      throw new Error('Team not found');
    }

    const teamData = team.data() as Team;
    const updatedMembers = teamData.members.map(member => ({
      ...member,
      role: member.uid === newCaptainId ? 'captain' : 'player'
    }));

    await teamRef.update({ members: updatedMembers });
  },

  // Update team details
  async updateTeam(teamId: string, updates: Partial<Team>) {
    await firestore().collection('teams').doc(teamId).update(updates);
  },

  // Subscribe to team updates
  subscribeToTeamUpdates(teamId: string, callback: (team: Team) => void) {
    return firestore().collection('teams')
      .doc(teamId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback({ id: doc.id, ...doc.data() as Team });
        }
      }, (error) => {
        console.error('Error subscribing to team updates:', error);
      });
  },

  // Subscribe to user's teams
  subscribeToUserTeams(userId: string, callback: (teams: Team[]) => void) {
    return firestore().collection('teams')
      .where('members', 'array-contains', { uid: userId })
      .onSnapshot((snapshot) => {
        const teams = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Team));
        callback(teams);
      }, (error) => {
        console.error('Error subscribing to user teams:', error);
      });
  }
}; 

