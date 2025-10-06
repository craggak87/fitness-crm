
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

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
}

const WorkoutTemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  const fetchTemplates = () => {
    axios.get('http://localhost:5000/api/workout-templates')
      .then(response => {
        setTemplates(response.data);
      })
      .catch(error => {
        console.error('Error fetching workout templates:', error);
      });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:5000/api/workout-templates/${id}`)
      .then(() => {
        fetchTemplates(); // Refresh the list after deletion
      })
      .catch(error => {
        console.error('Error deleting workout template:', error);
      });
  };

  return (
    <div>
      <h1>Workout Templates</h1>
      <LinkButton to="/add-workout-template">Add New Workout Template</LinkButton>
      <List>
        {templates.map(template => (
          <ListItem key={template.id}>
            {template.name} - {template.description}
            <div>
              <LinkButton to={`/workout-templates/${template.id}`}>View</LinkButton>
              <LinkButton to={`/add-workout-template/${template.id}`}>Edit</LinkButton>
              <Button onClick={() => handleDelete(template.id)}>Delete</Button>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default WorkoutTemplateList;
