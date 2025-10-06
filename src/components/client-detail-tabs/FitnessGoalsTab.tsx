import React from 'react';
import styled from 'styled-components';

const DetailItem = styled.p`
  margin-bottom: 0.5rem;
`;

interface Props {
  client: any;
}

const FitnessGoalsTab: React.FC<Props> = ({ client }) => {
  const fitnessGoals = Array.isArray(client.fitness_goals) ? client.fitness_goals : JSON.parse(client.fitness_goals || '[]');

  return (
    <div>
      <h2>Fitness Goals</h2>
      {fitnessGoals.length > 0 ? (
        fitnessGoals.map((goal: any, index: number) => (
          <div key={index}>
            <DetailItem><strong>Goal:</strong> {goal.goal}</DetailItem>
            <DetailItem><strong>Target Date:</strong> {goal.targetDate}</DetailItem>
            <DetailItem><strong>Priority:</strong> {goal.priority}</DetailItem>
            <DetailItem><strong>Status:</strong> {goal.status}</DetailItem>
          </div>
        ))
      ) : (
        <p>No fitness goals available for this client.</p>
      )}
    </div>
  );
};

export default FitnessGoalsTab;