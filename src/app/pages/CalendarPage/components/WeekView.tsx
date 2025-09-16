import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
} from "lucide-react";

interface Appointment {
  id: string;
  clientName: string;
  therapistName: string;
  startTime: string;
  endTime: string;
  service: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  room?: string;
  phone?: string;
}

interface WeekViewProps {
  className?: string;
}

const WeekView: React.FC<WeekViewProps> = ({ className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock appointment data
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      clientName: "María González",
      therapistName: "Dr. Ana Rodríguez",
      startTime: "09:00",
      endTime: "10:00",
      service: "Fisioterapia",
      status: "confirmed",
      room: "Sala 1",
      phone: "+591-123-4567",
    },
    {
      id: "2",
      clientName: "Carlos Mendoza",
      therapistName: "Dr. Luis Pérez",
      startTime: "10:30",
      endTime: "11:30",
      service: "Neurorehabilitación",
      status: "confirmed",
      room: "Sala 2",
      phone: "+591-987-6543",
    },
    {
      id: "3",
      clientName: "Ana Herrera",
      therapistName: "Dr. Ana Rodríguez",
      startTime: "14:00",
      endTime: "15:00",
      service: "Terapia Ocupacional",
      status: "pending",
      room: "Sala 1",
      phone: "+591-456-7890",
    },
    {
      id: "4",
      clientName: "Roberto Silva",
      therapistName: "Dr. Carmen López",
      startTime: "11:00",
      endTime: "12:00",
      service: "Psicoterapia",
      status: "completed",
      room: "Sala 3",
      phone: "+591-321-0987",
    },
    {
      id: "5",
      clientName: "Sofía Vargas",
      therapistName: "Dr. Luis Pérez",
      startTime: "16:00",
      endTime: "17:00",
      service: "Fisioterapia",
      status: "confirmed",
      room: "Sala 2",
      phone: "+591-654-3210",
    },
  ];

  // Get current week dates
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8; // Start from 8 AM
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 border-green-300 text-green-800";
      case "pending":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "completed":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "cancelled":
        return "bg-red-100 border-red-300 text-red-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    // For demo purposes, randomly assign appointments to different days
    const dayIndex = date.getDay();
    return mockAppointments.filter((_, index) => (index + dayIndex) % 7 < 2);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Calendario Semanal
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {weekDates[0].toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek("prev")}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
          >
            Hoy
          </button>

          <button
            onClick={() => navigateWeek("next")}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Cita</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200">
            <div className="p-4 bg-gray-50">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </span>
            </div>
            {weekDates.map((date, index) => (
              <div key={index} className="p-4 bg-gray-50 text-center">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {date.toLocaleDateString("es-ES", { weekday: "short" })}
                </div>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  {date.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="divide-y divide-gray-100">
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 min-h-[100px]">
                {/* Time Column */}
                <div className="p-4 bg-gray-50 border-r border-gray-200 flex items-start">
                  <span className="text-sm text-gray-500 font-medium">
                    {time}
                  </span>
                </div>

                {/* Day Columns */}
                {weekDates.map((date, dayIndex) => {
                  const dayAppointments = getAppointmentsForDay(date);
                  const timeAppointments = dayAppointments.filter(
                    (apt) => apt.startTime === time
                  );

                  return (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className="p-2 border-r border-gray-100 relative"
                    >
                      {timeAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`rounded-lg border-l-4 p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow duration-200 ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {appointment.clientName}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {appointment.therapistName}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {appointment.service}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {appointment.startTime} - {appointment.endTime}
                              </span>
                            </div>
                            {appointment.room && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{appointment.room}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Empty slot - clickable for new appointment */}
                      {timeAppointments.length === 0 && (
                        <div className="h-full min-h-[80px] rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap items-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Confirmada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Completada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Cancelada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;
