import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect";
import { ClientService } from "../services/clientService";
import { TherapyService } from "../services/therapyService";
import { TherapistService } from "../services/therapistService";
import type {
  Appointment,
  AppointmentFormData,
  Service,
} from "../types/appointment.types";
import type { Option } from "./SearchableSelect";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, "id">) => void;
  selectedDate?: Date;
  selectedTime?: string;
}


const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  selectedTime,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientId: "",
    clientName: "",
    serviceId: "",
    therapistId: "",
    therapistName: "",
    date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    startTime: selectedTime || "",
    endTime: "",
    status: "pending",
    room: "",
    phone: "",
    createdAt: "",
    updatedAt: "",
  });

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (isOpen) {
      TherapyService.getActiveServices().then(setServices);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    onSave({
      ...formData,
      createdAt: formData.createdAt || now,
      updatedAt: formData.updatedAt || now,
      date: formData.date,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update search functions to use service classes
  const handleClientSearch = async (query: string) => {
    const clients = await ClientService.searchClients(query);
    return clients.map((c) => ({
      id: c.id,
      label: `${c.name} ${c.lastname}`,
    }));
  };

  const handleTherapistSearch = async (query: string) => {
    if (!formData.serviceId) return [];
    const therapists = await TherapistService.searchByService(
      formData.serviceId,
      query
    );
    return therapists.map((t) => ({
      id: t.id,
      label: `${t.name} ${t.lastname}`,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nueva Cita</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Paciente
            </label>
            <SearchableSelect
              value={
                formData.clientId
                  ? { id: formData.clientId, label: formData.clientName }
                  : null
              }
              onChange={(option: Option | null) => {
                setFormData({
                  ...formData,
                  clientId: option?.id || "",
                  clientName: option?.label || "",
                });
              }}
              onSearch={handleClientSearch}
              placeholder="Buscar paciente..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terapeuta
            </label>
            <SearchableSelect
              value={
                formData.therapistId
                  ? { id: formData.therapistId, label: formData.therapistName }
                  : null
              }
              onChange={(option: Option | null) => {
                setFormData({
                  ...formData,
                  therapistId: option?.id || "",
                  therapistName: option?.label || "",
                });
              }}
              onSearch={handleTherapistSearch}
              placeholder="Buscar terapeuta..."
              disabled={!formData.serviceId}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Seleccionar sala</option>
                <option value="Sala 1">Sala 1</option>
                <option value="Sala 2">Sala 2</option>
                <option value="Sala 3">Sala 3</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora inicio
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora fin
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servicio
            </label>
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
