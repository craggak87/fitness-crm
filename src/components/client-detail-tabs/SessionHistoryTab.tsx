import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const SessionHistoryTab: React.FC<Props> = ({ clientId }) => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    if (clientId) {
      axios.get(`http://localhost:5000/api/sessions/client/${clientId}`)
        .then(response => {
          setSessions(response.data);
        })
        .catch(error => {
          console.error('Error fetching session history:', error);
        });
    }
  }, [clientId]);


  return (
    <div>
      <h2>Session History</h2>
      <List>
        {sessions.map(session => {
          let exercises = session.exercises;
          if (typeof exercises === 'string') {
            try {
              exercises = JSON.parse(exercises);
            } catch (e) {
              console.error("Error parsing session.exercises", e);
              exercises = [];
            }
          }
          if (!Array.isArray(exercises)) {
            exercises = [];
          }

          return (
          <ListItem key={session.id}>
            <strong>Date:</strong> {new Date(session.scheduled_date_time).toLocaleString()}<br/>
            <strong>Status:</strong> {session.status}<br/>
            <strong>Notes:</strong> {session.session_notes}
            {exercises.length > 0 && (
              <div>
                <strong>Exercises:</strong>
                <ul>
                  {exercises.map((exercise: any, index: number) => (
                    <li key={index}>
                      {exercise.exerciseName}
                      <ul>
                        {exercise.setsCompleted && exercise.setsCompleted.map((set: any, setIndex: number) => (
                          <li key={setIndex}>
                            Set {set.setNumber}: {set.reps} reps at {set.weight} kg
                          </li>
                        ))
                        }
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default SessionHistoryTab;
