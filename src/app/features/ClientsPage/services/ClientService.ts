import { supabase } from "../../../../lib/supabase";
import type { Client } from "../types/Client";

interface GetClientsParams {
  page: number;
  limit: number;
  search?: string;
}

interface GetClientsResponse {
  data: Client[];
  count: number;
}

interface CreateClientParams {
  name: string;
  lastname: string;
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
  /**
   * Fetches clients with pagination and optional search
   */
  static async getClients({
    page,
    limit,
    search,
  }: GetClientsParams): Promise<GetClientsResponse> {
    let query = supabase.from("client").select(
      `
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
    `,
      { count: "exact" }
    );

    if (search) {
      query = query.or(
        `person.name.ilike.%${search}%,person.lastname.ilike.%${search}%`
      );
    }

    const { data, count, error } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order("created_at", { ascending: false })
      .returns<ClientDBResponse[]>();

    if (error) throw new Error(`Error fetching clients: ${error.message}`);
    if (!data) throw new Error("No data returned from query");

    // Normalización solo de onboard_date y birthdate
    console.log(data);
    const normalizedData = data.map((c) => ({
      ...c,
      onboard_date: c.onboard_date ? c.onboard_date.split("T")[0] : "",
      person: {
        ...c.person,
        birthdate: c.person.birthdate ? c.person.birthdate.split("T")[0] : null,
      },
    }));
    console.log(normalizedData);
    return {
      data: normalizedData,
      count: count || 0,
    };
  }

  /**
   * Creates a new client with basic information (name and lastname)
   */
  static async createClient({
    name,
    lastname,
  }: CreateClientParams): Promise<Client> {
    // Step 1: Create person record
    const { data: personData, error: personError } = await supabase
      .from("person")
      .insert({
        name,
        lastname,
        birthdate: null, // puede ser null
      })
      .select()
      .single();

    if (personError)
      throw new Error(`Error creating person: ${personError.message}`);
    if (!personData) throw new Error("No person data returned after creation");

    // Step 2: Create client record (solo lo básico)
    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .insert({
        person_id: personData.id,
        onboard_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (clientError)
      throw new Error(`Error creating client: ${clientError.message}`);
    if (!clientData) throw new Error("No client data returned after creation");

    // Step 3: Traer el cliente con la relación person expandida
    const { data: fullClient, error: fetchError } = await supabase
      .from("client")
      .select(
        `
      id,
      public_id,
      onboard_date,
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
    `
      )
      .eq("id", clientData.id)
      .single();

    if (fetchError)
      throw new Error(`Error fetching full client: ${fetchError.message}`);
    if (!fullClient)
      throw new Error("No full client data returned after fetch");

    // Step 4: Normalizar datos según tu interfaz Client
    const person = Array.isArray(fullClient.person)
      ? fullClient.person[0]
      : fullClient.person;

    const normalized: Client = {
      id: fullClient.id,
      public_id: fullClient.public_id ?? "",
      onboard_date: fullClient.onboard_date ?? "",
      created_at: fullClient.created_at ?? "",
      updated_at: fullClient.updated_at ?? "",
      person: {
        id: person?.id ?? 0,
        name: person?.name ?? "",
        lastname: person?.lastname ?? "",
        birthdate: person?.birthdate ?? null,
        created_at: person?.created_at ?? "",
        updated_at: person?.updated_at ?? "",
      },
    };

    return normalized;
  }
}
