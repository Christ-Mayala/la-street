export interface Message {
  _id?: string;
  conversationId: string;
  from: string; // user id
  to: string; // user id
  content: string;
  createdAt?: string;
  read?: boolean;
}
