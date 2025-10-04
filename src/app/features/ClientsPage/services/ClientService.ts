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

export interface Address {
  id?: number;
  person_id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: string;
}

interface AppUser {
  id: number;
  person_id: number;
  email: string;
  username: string;
  status: string;
}

export interface ClientDetails {
  id: number;
  public_id: string;
  person_id: number;
  person: {
    id: number;
    name: string;
    lastname: string;
    birthdate: string | null;
  };
  onboard_date: string;
  addresses: Address[];
  user?: AppUser;
}

interface CreateClientParams {
  name: string;
  lastname: string;
}

export class ClientService {
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

    return {
      data: data,
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

  /**
   * Gets complete client details including person, addresses, and user information
   */
  static async getClientDetails(publicId: string): Promise<ClientDetails> {
    // Get client with person info
    const { data: clientData, error: clientError } = await supabase
      .from("client")
      .select(
        `
        id,
        public_id,
        person_id,
        person:person_id (
          id,
          name,
          lastname,
          birthdate
        ),
        onboard_date
      `
      )
      .eq("public_id", publicId)
      .single();

    if (clientError)
      throw new Error(`Error fetching client: ${clientError.message}`);
    if (!clientData) throw new Error("Client not found");

    // Get addresses
    const { data: addresses, error: addressError } = await supabase
      .from("address")
      .select("*")
      .eq("person_id", clientData.person_id);

    if (addressError)
      throw new Error(`Error fetching addresses: ${addressError.message}`);

    // Get user if exists
    const { data: userData, error: userError } = await supabase
      .from("app_user")
      .select("id, person_id, email, username, status")
      .eq("person_id", clientData.person_id)
      .maybeSingle();

    if (userError) throw new Error(`Error fetching user: ${userError.message}`);

    return {
      id: clientData.id,
      public_id: clientData.public_id, // Add this line
      person_id: clientData.person_id,
      person: clientData.person as unknown as ClientDetails["person"],
      onboard_date: clientData.onboard_date,
      addresses: addresses || [],
      user: userData || undefined,
    };
  }

  /**
   * Updates person information
   */
  static async updatePerson(
    personId: number,
    data: { name: string; lastname: string; birthdate: string | null }
  ) {
    const { error } = await supabase
      .from("person")
      .update({
        name: data.name,
        lastname: data.lastname,
        birthdate: data.birthdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", personId);

    if (error) throw new Error(`Error updating person: ${error.message}`);
  }

  /**
   * Updates client information
   */
  static async updateClient(publicId: string, data: { onboard_date: string }) {
    const { error } = await supabase
      .from("client")
      .update({
        onboard_date: data.onboard_date,
        updated_at: new Date().toISOString(),
      })
      .eq("public_id", publicId);

    if (error) throw new Error(`Error updating client: ${error.message}`);
  }

  /**
   * Updates an existing address
   */
  static async updateAddress(addressId: number, data: Partial<Address>) {
    const { error } = await supabase
      .from("address")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", addressId);

    if (error) throw new Error(`Error updating address: ${error.message}`);
  }

  /**
   * Creates a new address
   */
  static async createAddress(
    personId: number,
    data: Omit<Address, "id" | "person_id">
  ) {
    const { error } = await supabase.from("address").insert({
      person_id: personId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) throw new Error(`Error creating address: ${error.message}`);
  }

  /**
   * Deletes an address
   */
  static async deleteAddress(addressId: number) {
    const { error } = await supabase
      .from("address")
      .delete()
      .eq("id", addressId);

    if (error) throw new Error(`Error deleting address: ${error.message}`);
  }

  /**
   * Updates user information
   */
  static async updateUser(
    userId: number,
    data: { email: string; username: string; status: string }
  ) {
    const { error } = await supabase
      .from("app_user")
      .update({
        email: data.email,
        username: data.username,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw new Error(`Error updating user: ${error.message}`);
  }

  /**
   * Updates complete client details including person, client, addresses, and user
   */
  static async updateClientDetails(
    clientDetails: ClientDetails,
    originalAddresses: Address[]
  ) {
    try {
      // Update person
      await this.updatePerson(clientDetails.person.id, {
        name: clientDetails.person.name,
        lastname: clientDetails.person.lastname,
        birthdate: clientDetails.person.birthdate,
      });

      // Update client using public_id
      await this.updateClient(clientDetails.public_id, {
        onboard_date: clientDetails.onboard_date,
      });

      // Handle addresses
      const originalAddressIds = originalAddresses
        .map((a) => a.id)
        .filter(Boolean) as number[];
      const currentAddressIds = clientDetails.addresses
        .map((a) => a.id)
        .filter(Boolean) as number[];

      // Delete removed addresses
      const addressesToDelete = originalAddressIds.filter(
        (id) => !currentAddressIds.includes(id)
      );
      for (const addressId of addressesToDelete) {
        await this.deleteAddress(addressId);
      }

      // Update existing and create new addresses
      for (const address of clientDetails.addresses) {
        if (address.id) {
          // Update existing
          await this.updateAddress(address.id, address);
        } else {
          // Create new
          await this.createAddress(clientDetails.person_id, address);
        }
      }

      // Update user if exists
      if (clientDetails.user) {
        await this.updateUser(clientDetails.user.id, {
          email: clientDetails.user.email,
          username: clientDetails.user.username,
          status: clientDetails.user.status,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error in updateClientDetails:", error);
      throw error;
    }
  }
}
