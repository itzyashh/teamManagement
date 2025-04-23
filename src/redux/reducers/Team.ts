import { teamService } from "@/services/teamService";
import { Team } from "@/types/team";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
type TeamState = {
  teams: Team[];
  currentTeam: Team | null;
  loading: boolean;
  error: string | null;
};

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  loading: false,
  error: null,
};

export const getUserTeams = createAsyncThunk('teams/getUserTeams', async (userId: string) => {
    return await teamService.getUserTeams(userId);
});

export const createTeam = createAsyncThunk('teams/createTeam', async (team: Omit<Team, 'id' | 'createdAt'>) => {
    const teamId = await teamService.createTeam(team);
    return {
        ...team,
        id: teamId,
    }
});

export const updateTeamMemberStatus = createAsyncThunk('teams/updateTeamMemberStatus', async ({teamId, memberId, status}: {teamId: string, memberId: string, status: 'accepted' | 'declined'}) => {
    await teamService.updateMemberStatus(teamId, memberId, status);
    return {
        teamId,
        memberId,
        status,
    }
});

const TeamSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        setCurrentTeam: (state, action) => {
            state.currentTeam = action.payload;
        },
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(getUserTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch teams';
            })
            .addCase(createTeam.fulfilled, (state, action) => {
                state.teams.push(action.payload)
                state.currentTeam = action.payload;
            })
            .addCase(updateTeamMemberStatus.fulfilled, (state, action) => {
                const {teamId, memberId, status} = action.payload;
                const team = state.teams.find(team => team.id === teamId);
                if (team) {
                    const member = team.members.find(member => member.uid === memberId);
                    if (member) {
                        member.invitationStatus = status;
                    }
                }
            })
    },
});

export const { setCurrentTeam, resetError } = TeamSlice.actions;
export default TeamSlice.reducer;