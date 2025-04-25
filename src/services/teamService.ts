import { Team, TeamMember } from '@/types/team'
import { db, storage, auth } from '@/config/firebase'
import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  DocumentData,
  deleteDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const teamService = {
  // Create a new team
  async createTeam(team: Omit<Team, 'id' | 'createdAt'>): Promise<string> {
    console.log('Creating team:', team);
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to create a team');
      }
      
      const teamRef = await addDoc(collection(db, 'teams'), {
        ...team,
        createdAt: new Date(),
      });
      return teamRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  },

  // Upload team logo
  async uploadTeamLogo(teamId: string, logoFile: any): Promise<string> {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to upload team logo');
      }
      
      const logoRef = ref(storage, `team-logos/${teamId}`);
      await uploadBytes(logoRef, logoFile);
      return await getDownloadURL(logoRef);
    } catch (error) {
      console.error('Error uploading team logo:', error);
      throw error;
    }
  },

  // Get teams for a user (either created or joined)
  async getUserTeams(userId: string) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to get teams');
      }
      console.log('userId',userId, typeof userId);
      
      // Get all teams that this user might be part of
      const teamsRef = collection(db, 'teams');
      const teamsSnapshot = await getDocs(teamsRef);
      
      console.log('All teams count:', teamsSnapshot.docs.length);
      
      // Filter teams where the user is a member
      const userTeams = teamsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          console.log('Team data:', JSON.stringify(data.members));
          // Check if the user is in the members array
          return data.members && 
                 Array.isArray(data.members) && 
                 data.members.some(member => member.uid === userId);
        })
        .map(doc => ({
          id: doc.id,
          ...doc.data() as Team
        }));
      
      console.log('Filtered teams count:', userTeams.length);
      return userTeams;
    } catch (error) {
      console.error('Error getting user teams:', error, userId);
      throw error;
    }
  },

  // Update team member status
  async updateMemberStatus(
    teamId: string,
    memberId: string,
    status: 'accepted' | 'declined'
  ) {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update member status');
    }
    
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    
    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data() as Team;
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

    await updateDoc(teamRef, { members: updatedMembers });
  },

  // Update team captain
  async updateTeamCaptain(teamId: string, newCaptainId: string) {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update team captain');
    }
    
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    
    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const teamData = teamDoc.data() as Team;
    const updatedMembers = teamData.members.map(member => ({
      ...member,
      role: member.uid === newCaptainId ? 'captain' : 'player'
    }));

    await updateDoc(teamRef, { members: updatedMembers });
  },

  // Add member to team
  async addMemberToTeam(teamId: string, member: TeamMember) {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to add a member to a team');
    }
    
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    
    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }
    
    const teamData = teamDoc.data() as Team;
    const updatedMembers = [...teamData.members, member];
    await updateDoc(teamRef, { members: updatedMembers });
  },
  

  // Update team
  async updateTeam(teamId: string, updates: Partial<Omit<Team, 'id' | 'createdAt' | 'createdBy'>>): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update a team');
    }
    
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, updates);
  },

  // Delete team
  async deleteTeam(teamId: string) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to delete team');
      }

      const teamRef = doc(db, 'teams', teamId);
      // Check if the user is the captain of the team
      const teamDoc = await getDoc(teamRef);
      const teamData = teamDoc.data() as Team;
      const isCaptain = teamData.members.some(member => member.uid === auth.currentUser?.uid && member.role === 'captain');
      if (!isCaptain) {
        throw new Error('User must be the captain of the team to delete it');
      }
      await deleteDoc(teamRef);
      return true;
    } catch (error) {
      console.error('Error deleting team:', error);
      throw error;
    }
  },

  // Subscribe to team updates
  subscribeToTeamUpdates(teamId: string, callback: (team: Team) => void) {
    const teamRef = doc(db, 'teams', teamId);
    return onSnapshot(teamRef, 
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() as Team });
        }
      }, 
      (error) => {
        console.error('Error subscribing to team updates:', error);
      }
    );
  },

  // Subscribe to user's teams
  subscribeToUserTeams(userId: string, callback: (teams: Team[]) => void) {
    // Subscribe to all teams and filter client-side
    const teamsRef = collection(db, 'teams');
    
    return onSnapshot(
      teamsRef,
      (snapshot) => {
        // Filter teams where the user is a member
        const userTeams = snapshot.docs
          .filter(doc => {
            const data = doc.data();
            // Check if the user is in the members array
            return data.members && 
                   Array.isArray(data.members) && 
                   data.members.some(member => member.uid === userId);
          })
          .map(doc => ({
            id: doc.id,
            ...doc.data() as Team
          }));
        
        callback(userTeams);
      },
      (error) => {
        console.error('Error subscribing to user teams:', error);
      }
    );
  },

  // Get a single team by ID
  async getTeam(teamId: string): Promise<Team | null> {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        return null;
      }
      
      const teamData = teamDoc.data() as Omit<Team, 'id'>;
      return {
        ...teamData,
        id: teamId
      };
    } catch (error) {
      console.error('Error getting team:', error);
      throw error;
    }
  }
}; 

