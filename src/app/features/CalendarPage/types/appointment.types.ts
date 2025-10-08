export interface Person {
  id: string;
  name: string;
  lastname: string;
}

export interface Client extends Person {
  public_id: string;
}

export interface Service {
  id: string;
  name: string;
  code: string;
  description?: string;
}

export interface Therapist extends Person {
  public_id: string;
  services: string[];
}

export interface AppointmentFormData {
  clientId: string;
  clientName: string;
  serviceId: string;
  therapistId: string;
  therapistName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  phone?: string;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface Appointment extends Omit<AppointmentFormData, 'clientName' | 'therapistName'> {
  id: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  clientName?: string;
  therapistName?: string;
  serviceName?: string;
}