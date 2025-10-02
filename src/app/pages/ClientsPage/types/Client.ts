export interface Client {
  id: number;
  public_id: string;
  person: {
    id: number;
    name: string;
    lastname: string;
    birthdate: string | null;
    created_at: string;
    updated_at: string;
  };
  onboard_date: string;
  created_at: string;
  updated_at: string;
}