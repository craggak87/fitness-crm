import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const ReceiptContainer = styled.div`
  padding: 2rem;
  border: 1px solid #ccc;
  margin: 2rem auto;
  max-width: 800px;
  background: white;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  @media print {
    display: none;
  }
`;

const Receipt: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const [receiptData, setReceiptData] = useState<any>(null);

  useEffect(() => {
    if (paymentId) {
      axios.get(`http://localhost:5000/api/receipts/${paymentId}`)
        .then(res => setReceiptData(res.data))
        .catch(error => console.error('Error fetching receipt data:', error));
    }
  }, [paymentId]);

  if (!receiptData) {
    return <div>Loading receipt...</div>;
  }

  const { payment, client, packageInfo, sessionInfo } = receiptData;

  return (
    <ReceiptContainer>
      <h1>Receipt</h1>
      <p><strong>Receipt Number:</strong> {payment.receipt_number}</p>
      <p><strong>Payment Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
      <hr />
      <h2>Client Information</h2>
      <p><strong>Name:</strong> {client.personal_info.firstName} {client.personal_info.lastName}</p>
      <p><strong>Email:</strong> {client.personal_info.email}</p>
      <hr />
      <h2>Payment Details</h2>
      <p><strong>Amount:</strong> ${payment.amount}</p>
      <p><strong>Payment Method:</strong> {payment.payment_method}</p>
      <p><strong>Type:</strong> {payment.type}</p>
      {packageInfo && (
        <div>
          <h3>Package Details</h3>
          <p><strong>Package Name:</strong> {packageInfo.name}</p>
          <p><strong>Total Sessions:</strong> {packageInfo.total_sessions}</p>
        </div>
      )}
      {sessionInfo && (
        <div>
          <h3>Session Details</h3>
          <p><strong>Session Date:</strong> {new Date(sessionInfo.scheduled_date_time).toLocaleString()}</p>
        </div>
      )}
      <Button onClick={() => window.print()}>Print Receipt</Button>
    </ReceiptContainer>
  );
};

export default Receipt;
