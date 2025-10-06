import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';

const localizer = momentLocalizer(moment);

const CalendarContainer = styled.div`
  height: calc(100vh - 150px); /* Adjust based on header/footer height */
  @media (max-width: 768px) {
    height: calc(100vh - 120px); /* Slightly smaller on mobile */
  }
`;

interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any; // Can be used to store additional data
}

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const fetchScheduleData = async () => {
    try {
      const [appointmentsRes, sessionsRes, clientsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/sessions'),
        axios.get('http://localhost:5000/api/clients'),
      ]);

      setClients(clientsRes.data);

      const appointments = appointmentsRes.data.map((app: any) => ({
        id: app.id,
        title: `Appointment with ${getClientName(app.client_id, clientsRes.data)}`,
        start: new Date(app.start_date_time || new Date()),
        end: new Date(app.end_date_time || new Date()),
        resource: { type: 'appointment', ...app },
      }));

      const sessions = sessionsRes.data.map((sess: any) => ({
        id: sess.id,
        title: `Session with ${getClientName(sess.client_id, clientsRes.data)}`,
        start: new Date(sess.scheduled_date_time || sess.actual_start_time || new Date()),
        end: new Date(sess.actual_end_time || sess.scheduled_date_time || sess.actual_start_time || new Date()), // Fallback for end time
        resource: { type: 'session', ...sess },
      }));

      setEvents([...appointments, ...sessions]);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const getClientName = (clientId: string, clientList: any[]) => {
    const client = clientList.find(c => c.id === clientId);
    return client ? `${client.personal_info?.firstName} ${client.personal_info?.lastName}` : 'Unknown Client';
  };

  const BigCalendar = Calendar as any;

  return (
    <div>
      <h1>Schedule</h1>
      <CalendarContainer>
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
        />
      </CalendarContainer>
    </div>
  );
};

export default Schedule;
