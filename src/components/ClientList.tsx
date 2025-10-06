
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Button = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
    margin-left: 0;
    width: 100%;
  }
`;

const LinkButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  margin-left: 0.5rem;
  display: inline-block;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
    margin-left: 0;
    width: 100%;
    text-align: center;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
`;

const StatusIndicator = styled.span<{ status: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${props => (props.status === 'active' ? '#28a745' : '#dc3545')};
`;

interface Client {
  id: string;
  personal_info: {
    firstName: string;
    lastName: string;
  };
  status: string;
}

interface Appointment {
  id: string;
  client_id: string;
  start_date_time: string;
}

interface Session {
  id: string;
  client_id: string;
  scheduled_date_time: string;
  actual_start_time: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]); // Combined appointments and sessions
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const fetchClients = () => {
    axios.get('http://localhost:5000/api/clients')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });
  };

  const fetchAllEvents = async () => {
    try {
      const [appointmentsRes, sessionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/sessions'),
      ]);

      const appointments = appointmentsRes.data.map((app: any) => ({
        clientId: app.client_id,
        dateTime: app.start_date_time,
      }));

      const sessions = sessionsRes.data.map((sess: any) => ({
        clientId: sess.client_id,
        dateTime: sess.scheduled_date_time || sess.actual_start_time,
      }));

      setAllEvents([...appointments, ...sessions]);
    } catch (error) {
      console.error('Error fetching all events:', error);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchAllEvents();
  }, [location.pathname]);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/clients/${id}`)
      .then(() => {
        fetchClients(); // Refresh the list after deletion
        fetchAllEvents(); // Also refresh events
      })
      .catch(error => {
        console.error('Error deleting client:', error);
      });
  };

  const getNextAppointment = (clientId: string) => {
    const now = new Date();
    const upcomingEvents = allEvents
      .filter(event => event.clientId === clientId && event.dateTime && new Date(event.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    return upcomingEvents.length > 0 ? new Date(upcomingEvents[0].dateTime).toLocaleString() : 'No upcoming appointments';
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      `${client.personal_info.firstName} ${client.personal_info.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <div>
      <h1>Clients</h1>
      <LinkButton to="/add-client">Add New Client</LinkButton>
      <SearchInput
        type="text"
        placeholder="Search clients..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredClients.map(client => (
          <ListItem key={client.id}>
            <div>
              <StatusIndicator status={client.status} />
              {client.personal_info.firstName} {client.personal_info.lastName}
              <br />
              <small>Next Appointment: {getNextAppointment(client.id)}</small>
            </div>
            <div>
              <LinkButton to={`/clients/${client.id}`}>View</LinkButton>
              <LinkButton to={`/add-client/${client.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(client.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ClientList;
