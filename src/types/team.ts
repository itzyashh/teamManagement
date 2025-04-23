export type InvitationStatus = 'invited' | 'accepted' | 'declined';
export type MemberRole = 'captain' | 'player';

export interface TeamMember {
  uid: string;
  name: string;
  contactMethod: {
    type: 'email' | 'phone' | 'userId';
    value: string;
  };
  invitationStatus: InvitationStatus;
  role: MemberRole;
  joinedAt?: Date;
}

export interface Team {
  id?: string;
  name: string;
  logoUrl: string;
  createdBy: string;
  createdAt: Date;
  members: TeamMember[];
  isRegistrationComplete: boolean;
} 