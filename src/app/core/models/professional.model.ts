export interface RefDoc {
  _id?: string;
  name?: string;
}

export interface CloudinaryAsset {
  url: string;
  public_id?: string;
}

export interface Professional {
  createdAt: number;
  _id?: string;

  name: string;
  telephone: string;
  whatsapp?: boolean;

  pays?: string;
  ville: string;
  quartier?: string;

  categoryId?: RefDoc | string;
  tradeId?: RefDoc | string;

  experienceRange?: '0-1' | '2-5' | '5+';
  description?: string;

  daysAvailable?: string[];
  hoursAvailable?: string;
  preferredContact?: 'call' | 'whatsapp' | 'both';

  profileImage?: CloudinaryAsset;
  images?: CloudinaryAsset[];

  approvalStatus?: 'pending' | 'approved' | 'rejected';
  availabilityStatus?: 'available' | 'busy' | 'temporarily_unavailable';
  rating?: number;
  ratingCount?: number;
}
