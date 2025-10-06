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

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/exercises/${id}`)
        .then(response => {
          setExercise(response.data);
        })
        .catch(error => {
          console.error('Error fetching exercise details:', error);
        });
    }
  }, [id]);

  if (!exercise) {
    return <div>Loading exercise details...</div>;
  }

  return (
    <DetailContainer>
      <h1>Exercise Details: {exercise.name}</h1>
      <DetailItem><strong>Category:</strong> {exercise.category}</DetailItem>
      <DetailItem><strong>Muscle Groups:</strong> {exercise.muscle_groups?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Equipment:</strong> {exercise.equipment?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Difficulty:</strong> {exercise.difficulty}</DetailItem>
      <DetailItem><strong>Description:</strong> {exercise.description}</DetailItem>
      <DetailItem><strong>Instructions:</strong>
        <ol>
          {exercise.instructions?.map((instruction: string, index: number) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </DetailItem>
      <DetailItem><strong>Contraindications:</strong> {exercise.contraindications?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Modifications:</strong> {exercise.modifications?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Video URL:</strong> {exercise.video_url ? <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">Link</a> : 'N/A'}</DetailItem>
      <DetailItem><strong>Custom:</strong> {exercise.is_custom ? 'Yes' : 'No'}</DetailItem>
    </DetailContainer>
  );
};

export default ExerciseDetail;
