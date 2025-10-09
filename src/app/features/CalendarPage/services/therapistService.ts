import { supabase } from "../../../../lib/supabase";
import type { Therapist } from "../types/appointment.types";

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
      .from("therapist")
      .select(
        `
            id,
            public_id,
            app_user:app_user_id(
            person:person_id(
                name,
                lastname
            )
            ),
            therapist_therapy_plan(*)
        `   
      )
      .ilike("app_user.person.name", `%${query}%`);

    if (error) throw new Error(`Error searching therapists: ${error.message}`);
    if (!data) throw new Error("No data returned from query");

    return (data as unknown as TherapistResponse[]).map((d) => ({
      id: d.therapist.id,
      name: d.therapist.user.person.name,
      lastname: d.therapist.user.person.lastname,
      public_id: d.therapist.public_id,
      services: [serviceId],
    }));
  }
}
