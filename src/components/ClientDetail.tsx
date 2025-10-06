import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import PersonalInfoTab from './client-detail-tabs/PersonalInfoTab';
import MedicalInfoTab from './client-detail-tabs/MedicalInfoTab';
import FitnessGoalsTab from './client-detail-tabs/FitnessGoalsTab';
import SessionHistoryTab from './client-detail-tabs/SessionHistoryTab';
import PaymentHistoryTab from './client-detail-tabs/PaymentHistoryTab';
import ProgressTab from './client-detail-tabs/ProgressTab';

const DetailContainer = styled.div`
  padding: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${props => (props.active ? '#007bff' : 'transparent')};
  color: ${props => (props.active ? 'white' : '#007bff')};
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px 4px 0 0;

  &:hover {
    background-color: ${props => (props.active ? '#0056b3' : '#f0f0f0')};
  }
`;

const QuickActionsContainer = styled.div`
  margin-bottom: 1rem;
`;

const LinkButton = styled(Link)`
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  margin-right: 1rem;
`;

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/clients/${id}`)
        .then(response => {
          setClient(response.data);
        })
        .catch(error => {
          console.error('Error fetching client details:', error);
        });
    }
  }, [id]);

  if (!client) {
    return <div>Loading client details...</div>;
  }

  return (
    <DetailContainer>
      <h1>{client.personal_info?.firstName} {client.personal_info?.lastName}</h1>

      <QuickActionsContainer>
        <LinkButton to={`/log-session?clientId=${id}`}>Log Session</LinkButton>
        <LinkButton to={`/add-workout-template?clientId=${id}`}>Create Workout</LinkButton>
      </QuickActionsContainer>

      <TabContainer>
        <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>Personal Info</TabButton>
        <TabButton active={activeTab === 'medical'} onClick={() => setActiveTab('medical')}>Medical Info</TabButton>
        <TabButton active={activeTab === 'goals'} onClick={() => setActiveTab('goals')}>Fitness Goals</TabButton>
        <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>Session History</TabButton>
        <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>Payment History</TabButton>
        <TabButton active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>Progress</TabButton>
      </TabContainer>

      <div>
        {activeTab === 'personal' && <PersonalInfoTab client={client} />}
        {activeTab === 'medical' && <MedicalInfoTab client={client} />}
        {activeTab === 'goals' && <FitnessGoalsTab client={client} />}
        {activeTab === 'history' && <SessionHistoryTab clientId={id!} />}
        {activeTab === 'payments' && <PaymentHistoryTab clientId={id!} />}
        {activeTab === 'progress' && <ProgressTab clientId={id!} />}
      </div>
    </DetailContainer>
  );
};

export default ClientDetail;
