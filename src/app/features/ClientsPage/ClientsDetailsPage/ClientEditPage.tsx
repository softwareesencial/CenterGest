import { useState, useEffect } from "react";
import { User, MapPin, Calendar, Mail, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ClientService, type ClientDetails } from "../services/ClientService";
import { ClientTab } from "./components/ClientTab";
import { AddressTab } from "./components/AddressTab";
import { UserTab } from "./components/UserTab";
import { PersonalTab } from "./components/PersonalTab";

export const ClientEditPage = () => {
  const navigate = useNavigate();
  const { id: publicId } = useParams(); // renamed to publicId for clarity
  const [activeTab, setActiveTab] = useState<"personal" | "client" | "address" | "user">("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [originalAddresses, setOriginalAddresses] = useState<any[]>([]);

  useEffect(() => {
    fetchClientDetails();
  }, [publicId]);

  /**
   * Fetches client details using ClientService
   */
  const fetchClientDetails = async () => {
    if (!publicId) return;
    
    try {
      setIsLoading(true);
      const details = await ClientService.getClientDetails(publicId);
      setClient(details);
      setOriginalAddresses([...details.addresses]);
    } catch (error) {
      console.error("Error fetching client:", error);
      alert("Error al cargar el cliente");
      navigate("/clients");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles form submission using ClientService
   */
  const handleSubmit = async () => {
    if (!client) return;

    try {
      setIsSubmitting(true);
      await ClientService.updateClientDetails(client, originalAddresses);
      navigate("/clients");
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error al guardar los cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!client) return null;

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "client", label: "Cliente", icon: Calendar },
    { id: "address", label: "Direcciones", icon: MapPin },
    ...(client.user ? [{ id: "user", label: "Usuario", icon: Mail }] : []),
  ];

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold">
            {client.person.name} {client.person.lastname}
          </h2>
          <button
            onClick={() => navigate("/clients")}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "personal" && (
            <PersonalTab 
              client={client} 
              onChange={setClient} 
            />
          )}

          {activeTab === "client" && (
            <ClientTab 
              client={client} 
              onChange={setClient} 
            />
          )}

          {activeTab === "address" && (
            <AddressTab 
              client={client} 
              onChange={setClient} 
            />
          )}

          {activeTab === "user" && client.user && (
            <UserTab 
              client={client} 
              onChange={setClient} 
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};