import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
`;

interface Props {
  clientId: string;
}

const PaymentHistoryTab: React.FC<Props> = ({ clientId }) => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (clientId) {
      axios.get(`http://localhost:5000/api/payments/client/${clientId}`)
        .then(response => {
          setPayments(response.data);
        })
        .catch(error => {
          console.error('Error fetching payment history:', error);
        });
    }
  }, [clientId]);

  return (
    <div>
      <h2>Payment History</h2>
      <List>
        {payments.map(payment => (
          <ListItem key={payment.id}>
            <strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}<br/>
            <strong>Amount:</strong> ${payment.amount}<br/>
            <strong>Method:</strong> {payment.payment_method}<br/>
            <strong>Type:</strong> {payment.type}<br/>
            <Link to={`/receipt/${payment.id}`}>View Receipt</Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PaymentHistoryTab;
