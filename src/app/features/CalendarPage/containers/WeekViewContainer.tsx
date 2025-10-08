import React, { useState, useEffect } from 'react';
import WeekView from '../components/WeekView';
import { type Appointment } from '../types/appointment.types';
import NewAppointmentModal from '../components/NewAppointmentModal'; // Importa el componente del modal

const WeekViewContainer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const getWeekDates = (date: Date): Date[] => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      
      const data: any = [];
      setAppointments(data);
    };

    fetchAppointments();
  }, [currentDate]);

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const handleNewAppointment = () => {
    // Lógica para manejar la nueva cita
  };

  const handleSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <>
      <WeekView
        weekDates={getWeekDates(currentDate)}
        currentDate={currentDate}
        appointments={appointments}
        onWeekChange={handleWeekChange}
        onTodayClick={() => setCurrentDate(new Date())}
        onNewAppointment={handleNewAppointment}
        onSlotClick={handleSlotClick}
      />
      
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleNewAppointment}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </>
  );
};

export default WeekViewContainer;