import { supabase } from '../../../../lib/supabase';

interface Client {
  id: string;
  name: string;
  lastname: string;
  public_id: string;
}

// This is what Supabase actually returns for nested queries
interface SupabasePersonData {
  id: number;
  name: string;
  lastname: string;
}

interface SupabaseClientResponse {
  id: number;
  public_id: string;
  person: SupabasePersonData;
}

export class ClientService {
  /**
   * Searches clients by name or lastname
   */
  static async searchClients(query: string): Promise<Client[]> {
    if (query.length < 3) return [];

    const { data, error } = await supabase
      .from('client')
      .select('id, public_id, person:person_id(id, name, lastname)')
      .or(`person.name.ilike.%${query}%,person.lastname.ilike.%${query}%`)
      .limit(10);

    if (error) throw new Error(`Error searching clients: ${error.message}`);
    if (!data) throw new Error('No data returned from query');

    // First cast to unknown, then to our expected type
    const typedData = data as unknown as SupabaseClientResponse[];
    
    return typedData.map(d => ({
      id: d.id.toString(),
      name: d.person.name,
      lastname: d.person.lastname,
      public_id: d.public_id
    }));
  }
}