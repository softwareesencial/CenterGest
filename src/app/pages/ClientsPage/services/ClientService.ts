import { supabase } from '../../../../lib/supabase';
import type { Client } from '../types/Client';

interface GetClientsParams {
  page: number;
  limit: number;
  search?: string;
}

interface GetClientsResponse {
  data: Client[];
  count: number;
}

// Define the database response type to match Supabase's return type
interface ClientDBResponse {
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

export class ClientService {
  static async getClients({ page, limit, search }: GetClientsParams): Promise<GetClientsResponse> {
    let query = supabase
      .from('client')
      .select(`
        id,
        public_id,
        person!person_id (
          id,
          name,
          lastname,
          birthdate,
          created_at,
          updated_at
        ),
        onboard_date,
        created_at,
        updated_at
      `, { count: 'exact' });

    if (search) {
      query = query.or(`person.name.ilike.%${search}%,person.lastname.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false })
      .returns<ClientDBResponse[]>();

    if (error) throw new Error(`Error fetching clients: ${error.message}`);
    if (!data) throw new Error('No data returned from query');

    return {
      data: data,
      count: count || 0
    };
  }
}