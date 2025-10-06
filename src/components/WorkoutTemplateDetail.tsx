import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 1rem;
`;

const DetailItem = styled.p`
  margin-bottom: 0.5rem;
`;

const WorkoutTemplateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<any>(null);
  const [clientName, setClientName] = useState<string>('Loading...');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/workout-templates/${id}`)
        .then(response => {
          setTemplate(response.data);
          if (response.data.client_id) {
            axios.get(`http://localhost:5000/api/clients/${response.data.client_id}`)
              .then(clientRes => {
                setClientName(`${clientRes.data.personal_info?.firstName} ${clientRes.data.personal_info?.lastName}`);
              })
              .catch(error => {
                console.error('Error fetching client name:', error);
                setClientName('Unknown Client');
              });
          }
        })
        .catch(error => {
          console.error('Error fetching workout template details:', error);
        });
    }
  }, [id]);

  if (!template) {
    return <div>Loading workout template details...</div>;
  }

  return (
    <DetailContainer>
      <h1>Workout Template Details: {template.name}</h1>
      <DetailItem><strong>Client:</strong> {clientName}</DetailItem>
      <DetailItem><strong>Description:</strong> {template.description}</DetailItem>
      <DetailItem><strong>Estimated Duration:</strong> {template.estimated_duration} minutes</DetailItem>
      <DetailItem><strong>Tags:</strong> {template.tags?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Active:</strong> {template.is_active ? 'Yes' : 'No'}</DetailItem>
      <DetailItem><strong>Created Date:</strong> {new Date(template.created_date).toLocaleString()}</DetailItem>
      <DetailItem><strong>Last Modified:</strong> {new Date(template.last_modified).toLocaleString()}</DetailItem>

      <h2>Exercises</h2>
      {template.exercises && template.exercises.length > 0 ? (
        <ol>
          {template.exercises.map((exercise: any, index: number) => (
            <li key={index}>
              <strong>Exercise ID:</strong> {exercise.exerciseId}<br/>
              <strong>Order:</strong> {exercise.order}<br/>
              <strong>Sets:</strong> {exercise.sets}<br/>
              <strong>Reps:</strong> {exercise.reps}<br/>
              <strong>Weight:</strong> {exercise.weight}<br/>
              <strong>Rest Time:</strong> {exercise.restTime}<br/>
              <strong>Notes:</strong> {exercise.notes}<br/>
              <strong>Progression Notes:</strong> {exercise.progressionNotes}
            </li>
          ))}
        </ol>
      ) : (
        <DetailItem>No exercises defined for this template.</DetailItem>
      )}
    </DetailContainer>
  );
};

export default WorkoutTemplateDetail;
