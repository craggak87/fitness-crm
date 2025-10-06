
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

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

const Textarea = styled.textarea`
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

const AddWorkoutTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [clients, setClients] = useState([]);
  const [exercises, setExercises] = useState([]); // This state is not directly used for form submission, but for potential future exercise selection UI

  useEffect(() => {
    axios.get('http://localhost:5000/api/clients').then(res => {
      setClients(res.data);
    });
    axios.get('http://localhost:5000/api/exercises').then(res => setExercises(res.data));

    if (id) {
      axios.get(`http://localhost:5000/api/workout-templates/${id}`)
        .then(response => {
          const templateData = response.data;
          reset({
            name: templateData.name,
            description: templateData.description,
            estimatedDuration: templateData.estimated_duration,
            clientId: templateData.client_id,
            exercises: JSON.stringify(templateData.exercises, null, 2), // Convert JSONB to string for textarea
            tags: templateData.tags?.join(', '),
            isActive: templateData.is_active,
          });
        })
        .catch(error => {
          console.error('Error fetching workout template for edit:', error);
        });
    }
  }, [id, reset]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map((item: string) => item.trim()) : [],
      exercises: data.exercises ? JSON.parse(data.exercises) : [], // Parse JSON string back to object/array
    };

    if (id) {
      axios.put(`http://localhost:5000/api/workout-templates/${id}`, formattedData)
        .then(response => {
          console.log('Workout Template updated:', response.data);
          // redirect or show success message
        })
        .catch(error => {
          console.error('Error updating workout template:', error);
        });
    } else {
      axios.post('http://localhost:5000/api/workout-templates', formattedData)
        .then(response => {
          console.log('Workout Template added:', response.data);
          // redirect or show success message
        })
        .catch(error => {
          console.error('Error adding workout template:', error);
        });
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Workout Template' : 'Add Workout Template'}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name', { required: true })} placeholder="Name" />
        <Textarea {...register('description')} placeholder="Description" />
        <Input type="number" {...register('estimatedDuration')} placeholder="Estimated Duration (mins)" />
        <Input {...register('tags')} placeholder="Tags (comma-separated)" />
        <Select {...register('clientId', { required: true })}>
          <option value="">Select Client</option>
          {clients.map((client: any) => <option key={client.id} value={client.id}>{client.personal_info?.firstName} {client.personal_info?.lastName}</option>)}
        </Select>
        <h2>Exercises (JSON Array)</h2>
        <Textarea {...register('exercises')} placeholder="Exercises (JSON Array)" rows={10}></Textarea>
        <label>
          <input type="checkbox" {...register('isActive')} /> Is Active
        </label>
        <Button type="submit">{id ? 'Update Workout Template' : 'Add Workout Template'}</Button>
      </Form>
    </div>
  );
};

export default AddWorkoutTemplate;
