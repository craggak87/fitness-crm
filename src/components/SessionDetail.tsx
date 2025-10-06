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

const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<any>(null);
  const [clientName, setClientName] = useState<string>('Loading...');
  const [templateName, setTemplateName] = useState<string>('Loading...');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/sessions/${id}`)
        .then(response => {
          setSession(response.data);
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
          if (response.data.template_id) {
            axios.get(`http://localhost:5000/api/workout-templates/${response.data.template_id}`)
              .then(templateRes => {
                setTemplateName(templateRes.data.name);
              })
              .catch(error => {
                console.error('Error fetching template name:', error);
                setTemplateName('Unknown Template');
              });
          }
        })
        .catch(error => {
          console.error('Error fetching session details:', error);
        });
    }
  }, [id]);

  if (!session) {
    return <div>Loading session details...</div>;
  }

  return (
    <DetailContainer>
      <h1>Session Details</h1>
      <DetailItem><strong>Client:</strong> {clientName}</DetailItem>
      <DetailItem><strong>Workout Template:</strong> {templateName}</DetailItem>
      <DetailItem><strong>Scheduled:</strong> {session.scheduled_date_time ? new Date(session.scheduled_date_time).toLocaleString() : 'N/A'}</DetailItem>
      <DetailItem><strong>Actual Start:</strong> {session.actual_start_time ? new Date(session.actual_start_time).toLocaleString() : 'N/A'}</DetailItem>
      <DetailItem><strong>Actual End:</strong> {session.actual_end_time ? new Date(session.actual_end_time).toLocaleString() : 'N/A'}</DetailItem>
      <DetailItem><strong>Status:</strong> {session.status}</DetailItem>
      <DetailItem><strong>Session Notes:</strong> {session.session_notes}</DetailItem>
      <DetailItem><strong>Client Condition Alerts:</strong> {session.client_condition_alerts?.join(', ' || 'N/A')}</DetailItem>
      <DetailItem><strong>Next Session Recommendations:</strong> {session.next_session_recommendations}</DetailItem>
      <DetailItem><strong>Payment Status:</strong> {session.payment_status}</DetailItem>

      <h2>Exercises Logged</h2>
      {session.exercises && session.exercises.length > 0 ? (
        <ol>
          {session.exercises.map((exercise: any, index: number) => (
            <li key={index}>
              <strong>Exercise ID:</strong> {exercise.exerciseId}<br/>
              <strong>Exercise Name:</strong> {exercise.exerciseName}<br/>
              <strong>Sets Completed:</strong>
              <ul>
                {exercise.setsCompleted?.map((set: any, setIndex: number) => (
                  <li key={setIndex}>Set {set.setNumber}: {set.reps} reps, {set.weight} kg, Notes: {set.notes}</li>
                ))}
              </ul>
              <strong>Client Feedback:</strong> {exercise.clientFeedback}<br/>
              <strong>Instructor Notes:</strong> {exercise.instructorNotes}
            </li>
          ))}
        </ol>
      ) : (
        <DetailItem>No exercises logged for this session.</DetailItem>
      )}
    </DetailContainer>
  );
};

export default SessionDetail;
