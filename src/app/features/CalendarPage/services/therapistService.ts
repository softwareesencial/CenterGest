import { supabase } from '../../../../lib/supabase';
import type { Therapist } from '../types/appointment.types';

interface TherapistResponse {
  therapist: {
    id: string;
    public_id: string;
    user: {
      person: {
        name: string;
        lastname: string;
      };
    };
  };
}

export class TherapistService {
  /**
   * Searches therapists by service and name
   */
  static async searchByService(
    serviceId: string,
    query: string
  ): Promise<Therapist[]> {
    const { data, error } = await supabase
      .from('therapist_therapy_plan')
      .select(`
        therapist:therapist_id(
          id,
          public_id,
          user:user_id(
            person:person_id(
              name,
              lastname
            )
          )
        )
      `)
      .eq('therapy_id', serviceId)
      .eq('status', 'active')
      .ilike('user.person.name', `%${query}%`)
      .limit(10);

    if (error) throw new Error(`Error searching therapists: ${error.message}`);
    if (!data) throw new Error('No data returned from query');

    return (data as unknown as TherapistResponse[]).map(d => ({
      id: d.therapist.id,
      name: d.therapist.user.person.name,
      lastname: d.therapist.user.person.lastname,
      public_id: d.therapist.public_id,
      services: [serviceId]
    }));
  }
}