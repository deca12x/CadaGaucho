export interface Petition {
  id: number;
  creator: string;
  name: string;
  description: string;
  extendeddescription: string;
  enddate: string;
  goal: number;
  votes?: number; // Updated property name
}

export interface Vote {
  id: number;
  signer: string;
  permit: boolean;
  petition: number;
}

interface UserVerification {
  wallet_address: string;
  is_verified: boolean;
  did?: string; // Store their DID if we need it later
  verified_at: string; // Timestamp
}
