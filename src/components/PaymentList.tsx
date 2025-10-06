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

interface Payment {
  id: string;
  client_id: string;
  amount: number;
  payment_date: string;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const fetchPayments = () => {
    axios.get('http://localhost:5000/api/payments')
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
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
    fetchPayments();
    fetchClients();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/payments/${id}`)
      .then(() => fetchPayments())
      .catch(error => console.error('Error deleting payment:', error));
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.personal_info?.firstName} ${client.personal_info?.lastName}` : 'Unknown Client';
  };

  return (
    <div>
      <h1>Payments</h1>
      <LinkButton to="/add-edit-payment">Add New Payment</LinkButton>
      <List>
        {payments.map(payment => (
          <ListItem key={payment.id}>
            {getClientName(payment.client_id)} - ${payment.amount} - {new Date(payment.payment_date).toLocaleDateString()}
            <div>
              <LinkButton to={`/add-edit-payment/${payment.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(payment.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PaymentList;
