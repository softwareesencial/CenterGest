
import { supabase } from '../../../../lib/supabase';
import type { Service } from '../types/appointment.types';

export class TherapyService {
  /**
   * Fetches all active services
   */
  static async getActiveServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('therapy')
      .select('*')
      .eq('is_active', true);

    if (error) throw new Error(`Error fetching services: ${error.message}`);
    if (!data) throw new Error('No data returned from query');

    return data;
  }
}