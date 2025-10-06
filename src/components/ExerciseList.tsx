
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

interface Exercise {
  id: string;
  name: string;
  category: string;
}

const ExerciseList: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchExercises = () => {
    axios.get('http://localhost:5000/api/exercises')
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
      });
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/exercises/${id}`)
      .then(() => {
        fetchExercises(); // Refresh the list after deletion
      })
      .catch(error => {
        console.error('Error deleting exercise:', error);
      });
  };

  return (
    <div>
      <h1>Exercise Database</h1>
      <LinkButton to="/add-exercise">Add New Exercise</LinkButton>
      <List>
        {exercises.map(exercise => (
          <ListItem key={exercise.id}>
            {exercise.name} - {exercise.category}
            <div>
              <LinkButton to={`/exercises/${exercise.id}`}>View</LinkButton>
              <LinkButton to={`/add-exercise/${exercise.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(exercise.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ExerciseList;
