export type Role = 'user' | 'professional' | 'admin' | 'client' | 'prestataire';

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: Role;
  /** subtype: 'prestataire' = peut voir et répondre aux leads */
  subtype?: 'prestataire' | null;
  telephone?: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  token?: string;
  refreshToken?: string;
  isPremium?: boolean;
  premiumUntil?: string | Date;
  premiumPlan?: string;
}

