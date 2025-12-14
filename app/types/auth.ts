export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    [key: string]: any;
  };
  created_at: string;
}
