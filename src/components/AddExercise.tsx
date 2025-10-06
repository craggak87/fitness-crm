
import React, { useEffect } from 'react';
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

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AddExercise: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/exercises/${id}`)
        .then(response => {
          const exerciseData = response.data;
          reset({
            name: exerciseData.name,
            category: exerciseData.category,
            muscleGroups: exerciseData.muscle_groups?.join(', '),
            equipment: exerciseData.equipment?.join(', '),
            difficulty: exerciseData.difficulty,
            description: exerciseData.description,
            instructions: exerciseData.instructions?.join('\n'),
            contraindications: exerciseData.contraindications?.join('\n'),
            modifications: exerciseData.modifications?.join('\n'),
            videoUrl: exerciseData.video_url,
            isCustom: exerciseData.is_custom,
          });
        })
        .catch(error => {
          console.error('Error fetching exercise for edit:', error);
        });
    }
  }, [id, reset]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      muscleGroups: data.muscleGroups ? data.muscleGroups.split(',').map((item: string) => item.trim()) : [],
      instructions: data.instructions ? data.instructions.split('\n').map((item: string) => item.trim()) : [],
      equipment: data.equipment ? data.equipment.split(',').map((item: string) => item.trim()) : [],
      contraindications: data.contraindications ? data.contraindications.split('\n').map((item: string) => item.trim()) : [],
      modifications: data.modifications ? data.modifications.split('\n').map((item: string) => item.trim()) : [],
    };

    if (id) {
      axios.put(`http://localhost:5000/api/exercises/${id}`, formattedData)
        .then(response => {
          console.log('Exercise updated:', response.data);
          // redirect to exercise list or show success message
        })
        .catch(error => {
          console.error('Error updating exercise:', error);
        });
    } else {
      axios.post('http://localhost:5000/api/exercises', formattedData)
        .then(response => {
          console.log('Exercise added:', response.data);
          // redirect to exercise list or show success message
        })
        .catch(error => {
          console.error('Error adding exercise:', error);
        });
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Exercise' : 'Add Exercise'}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name', { required: true })} placeholder="Name" />
        <Input {...register('category')} placeholder="Category" />
        <Input {...register('muscleGroups')} placeholder="Muscle Groups (comma-separated)" />
        <Input {...register('equipment')} placeholder="Equipment (comma-separated)" />
        <Input {...register('difficulty')} placeholder="Difficulty" />
        <Textarea {...register('description')} placeholder="Description" />
        <Textarea {...register('instructions')} placeholder="Instructions (one per line)" />
        <Textarea {...register('contraindications')} placeholder="Contraindications (one per line)" />
        <Textarea {...register('modifications')} placeholder="Modifications (one per line)" />
        <Input {...register('videoUrl')} placeholder="Video URL" />
        <label>
          <input type="checkbox" {...register('isCustom')} /> Is Custom
        </label>
        <Button type="submit">{id ? 'Update Exercise' : 'Add Exercise'}</Button>
      </Form>
    </div>
  );
};

export default AddExercise;

