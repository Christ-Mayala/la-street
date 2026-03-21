export interface Lead {
  _id?: string;
  serviceType: string;
  description: string;
  location?: string;
  status: 'open' | 'assigned' | 'closed';
  userId: any; // populated object avec name/telephone
  assignedTo?: string;
  createdByRole: 'client' | 'professional';
  createdAt: string;
  isLocked?: boolean;
  isOwner?: boolean;
  isPremiumCreator?: boolean;
  estimatedPrice?: number;
  unlockedBy?: string[];
  responses?: any[];
}
