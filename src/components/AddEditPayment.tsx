import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AddEditPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/clients').then(res => setClients(res.data));
    axios.get('http://localhost:5000/api/packages').then(res => setPackages(res.data));

    if (id) {
      axios.get(`http://localhost:5000/api/payments/${id}`)
        .then(response => {
          const paymentData = response.data;
          reset({
            ...paymentData,
            paymentDate: paymentData.payment_date ? new Date(paymentData.payment_date).toISOString().slice(0, 10) : '',
          });
        })
        .catch(error => console.error('Error fetching payment for edit:', error));
    }
  }, [id, reset]);

  const onSubmit = (data: any) => {
    if (id) {
      axios.put(`http://localhost:5000/api/payments/${id}`, data)
        .then(() => navigate('/payments'))
        .catch(error => console.error('Error updating payment:', error));
    } else {
      axios.post('http://localhost:5000/api/payments', data)
        .then(() => navigate('/payments'))
        .catch(error => console.error('Error adding payment:', error));
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Payment' : 'Add Payment'}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Select {...register('clientId', { required: true })}>
          <option value="">Select Client</option>
          {clients.map((client: any) => <option key={client.id} value={client.id}>{client.personal_info?.firstName} {client.personal_info?.lastName}</option>)}
        </Select>
        <Input type="number" step="0.01" {...register('amount', { required: true })} placeholder="Amount" />
        <Input type="date" {...register('paymentDate', { required: true })} placeholder="Payment Date" />
        <Input {...register('paymentMethod')} placeholder="Payment Method" />
        <Input {...register('type')} placeholder="Type (e.g., single_session, package)" />
        <Select {...register('packageId')}>
          <option value="">Select Package (if applicable)</option>
          {packages.map((pkg: any) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
        </Select>
        <Input {...register('sessionId')} placeholder="Session ID (optional)" />
        <Input {...register('receiptNumber')} placeholder="Receipt Number" />
        <textarea {...register('notes')} placeholder="Notes"></textarea>
        <Button type="submit">{id ? 'Update Payment' : 'Add Payment'}</Button>
      </Form>
    </div>
  );
};

export default AddEditPayment;
