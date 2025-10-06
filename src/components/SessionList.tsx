import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const LinkButton = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  margin-left: 0.5rem;
`;

interface Session {
  id: string;
  client_id: string;
  scheduled_date_time: string;
  status: string;
}

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const fetchSessions = () => {
    axios.get('http://localhost:5000/api/sessions')
      .then(response => {
        setSessions(response.data);
      })
      .catch(error => {
        console.error('Error fetching sessions:', error);
      });
  };

  const fetchClients = () => {
    axios.get('http://localhost:5000/api/clients')
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });
  };

  useEffect(() => {
    fetchSessions();
    fetchClients();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/sessions/${id}`)
      .then(() => {
        fetchSessions(); // Refresh the list after deletion
      })
      .catch(error => {
        console.error('Error deleting session:', error);
      });
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.personal_info?.firstName} ${client.personal_info?.lastName}` : 'Unknown Client';
  };

  return (
    <div>
      <h1>Sessions</h1>
      <LinkButton to="/log-session">Log New Session</LinkButton>
      <List>
        {sessions.map(session => (
          <ListItem key={session.id}>
            {getClientName(session.client_id)} - {new Date(session.scheduled_date_time).toLocaleString()} - {session.status}
            <div>
              <LinkButton to={`/sessions/${session.id}`}>View</LinkButton>
              <LinkButton to={`/add-edit-session/${session.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(session.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default SessionList;
