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

const AddEditPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/clients').then(res => setClients(res.data));

    if (id) {
      axios.get(`http://localhost:5000/api/packages/${id}`)
        .then(response => {
          const packageData = response.data;
          reset({
            ...packageData,
            purchaseDate: packageData.purchase_date ? new Date(packageData.purchase_date).toISOString().slice(0, 10) : '',
            sessions: packageData.sessions ? JSON.stringify(packageData.sessions, null, 2) : ''
          });
        })
        .catch(error => console.error('Error fetching package for edit:', error));
    }
  }, [id, reset]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      sessions: data.sessions ? JSON.parse(data.sessions) : null,
    };

    if (id) {
      axios.put(`http://localhost:5000/api/packages/${id}`, formattedData)
        .then(() => navigate('/packages'))
        .catch(error => console.error('Error updating package:', error));
    } else {
      axios.post('http://localhost:5000/api/packages', formattedData)
        .then(() => navigate('/packages'))
        .catch(error => console.error('Error adding package:', error));
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Package' : 'Add Package'}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Select {...register('clientId', { required: true })}>
          <option value="">Select Client</option>
          {clients.map((client: any) => <option key={client.id} value={client.id}>{client.personal_info?.firstName} {client.personal_info?.lastName}</option>)}
        </Select>
        <Input {...register('name', { required: true })} placeholder="Package Name" />
        <Input type="number" {...register('totalSessions', { required: true })} placeholder="Total Sessions" />
        <Input type="number" step="0.01" {...register('pricePerSession')} placeholder="Price Per Session" />
        <Input type="number" step="0.01" {...register('totalAmount', { required: true })} placeholder="Total Amount" />
        <Input type="date" {...register('purchaseDate', { required: true })} placeholder="Purchase Date" />
        <Input {...register('status')} placeholder="Status (e.g., active, completed)" />
        <textarea {...register('sessions')} placeholder="Sessions (JSON Array)"></textarea>
        <Button type="submit">{id ? 'Update Package' : 'Add Package'}</Button>
      </Form>
    </div>
  );
};

export default AddEditPackage;
