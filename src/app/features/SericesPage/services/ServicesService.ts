import { supabase } from '../../../../lib/supabase';

export interface Service {
  id: number;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceDTO {
  name: string;
  code: string;
  description?: string;
}

export class ServicesService {
  static async getAll(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('therapy')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  static async create(service: CreateServiceDTO): Promise<Service> {
    const { data, error } = await supabase
      .from('therapy')
      .insert([
        {
          name: service.name.trim(),
          code: service.code.trim(),
          description: service.description?.trim() || null,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('therapy')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  static async update(id: number, service: Partial<CreateServiceDTO>): Promise<Service> {
    const { data, error } = await supabase
      .from('therapy')
      .update({
        ...service,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}