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

interface Package {
  id: string;
  client_id: string;
  name: string;
  total_sessions: number;
  used_sessions: number;
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const fetchPackages = () => {
    axios.get('http://localhost:5000/api/packages')
      .then(response => {
        setPackages(response.data);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
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
    fetchPackages();
    fetchClients();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/packages/${id}`)
      .then(() => fetchPackages())
      .catch(error => console.error('Error deleting package:', error));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.personal_info?.firstName} ${client.personal_info?.lastName}` : 'Unknown Client';
  };

  return (
    <div>
      <h1>Packages</h1>
      <LinkButton to="/add-edit-package">Add New Package</LinkButton>
      <List>
        {packages.map(pkg => (
          <ListItem key={pkg.id}>
            {getClientName(pkg.client_id)} - {pkg.name} ({pkg.used_sessions}/{pkg.total_sessions} sessions used)
            <div>
              <LinkButton to={`/add-edit-package/${pkg.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(pkg.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PackageList;
