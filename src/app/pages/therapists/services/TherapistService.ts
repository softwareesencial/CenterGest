import { supabase } from '../../../../lib/supabase';
import type { Therapist } from '../TherapistsPage';

// 1. Actualizar la interfaz para hacer birthdate nullable
interface PersonResponse {
  id: number;
  name: string;
  lastname: string;
  birthdate: string | null;  // Hacer nullable
  created_at: string;
  updated_at: string;
}

interface AppUserResponse {
  id: number;
  person_id: number;
  email: string;
  username: string;
  password: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface TherapistResponse {
  id: number;
  user_id: number;
  resume: string | null;
  onboard_date: string;
  created_at: string;
  updated_at: string;
}

export class TherapistService {
  static async getTherapists(): Promise<Therapist[]> {
    const { data, error } = await supabase
      .from('therapist')
      .select(`
        id,
        resume,
        onboard_date,
        created_at,
        updated_at,
        app_user:user_id (
          id,
          email,
          username,
          status,
          created_at,
          updated_at,
          person:person_id (
            id,
            name,
            lastname,
            birthdate,
            created_at,
            updated_at
          )
        )
      `)
      .returns<Therapist[]>();

    if (error) throw new Error(`Error fetching therapists: ${error.message}`);
    return data || [];
  }

  static async createTherapist(data: {
    person: {
      name: string;
      lastname: string;
      birthdate: string | null;  // Hacer nullable aquí también
    };
    user: {
      email: string;
      username: string;
      password: string;
    };
    resume?: string;
  }): Promise<Therapist> {
    // Create person
    const { data: person, error: personError } = await supabase
      .from('person')
      .insert({
        name: data.person.name,
        lastname: data.person.lastname,
        birthdate: data.person.birthdate === "" ? null : data.person.birthdate  // Convertir string vacío a null
      })
      .select()
      .single<PersonResponse>();

    if (personError || !person) {
      throw new Error(`Error creating person: ${personError?.message || 'No data returned'}`);
    }

    // Create app_user (not user)
    const { data: user, error: userError } = await supabase
      .from('app_user') // Changed from 'user' to 'app_user'
      .insert({
        person_id: person.id,
        email: data.user.email,
        username: data.user.username,
        password: data.user.password,
        status: 'active'
      })
      .select()
      .single<AppUserResponse>();

    if (userError || !user) {
      throw new Error(`Error creating user: ${userError?.message || 'No data returned'}`);
    }

    // Create therapist with updated select query
    const { data: therapist, error: therapistError } = await supabase
      .from('therapist')
      .insert({
        user_id: user.id,
        resume: data.resume,
        onboard_date: new Date().toISOString().split('T')[0]
      })
      .select(`
        id,
        resume,
        onboard_date,
        created_at,
        updated_at,
        app_user:user_id (
          id,
          email,
          username,
          status,
          created_at,
          updated_at,
          person:person_id (
            id,
            name,
            lastname,
            birthdate,
            created_at,
            updated_at
          )
        )
      `)
      .single<Therapist>();

    if (therapistError || !therapist) {
      throw new Error(`Error creating therapist: ${therapistError?.message || 'No data returned'}`);
    }

    return therapist;
  }
}