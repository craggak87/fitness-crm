import React from 'react';
import styled from 'styled-components';

const DetailItem = styled.p`
  margin-bottom: 0.5rem;
`;

interface Props {
  client: any;
}

const MedicalInfoTab: React.FC<Props> = ({ client }) => {
  if (!client.medical_info) {
    return <div>No medical information available for this client.</div>;
  }
  return (
    <div>
      <h2>Medical Information</h2>
      <DetailItem><strong>Doctor Clearance:</strong> {client.medical_info?.doctorClearance ? 'Yes' : 'No'}</DetailItem>
      <DetailItem><strong>Last Medical Update:</strong> {client.medical_info?.lastMedicalUpdate}</DetailItem>
      <h3>Conditions</h3>
      <ul>
        {client.medical_info?.conditions?.map((c: any, index: number) => (
          <li key={index}>{c.conditionId} (Severity: {c.severity}, Notes: {c.notes})</li>
        ))}
      </ul>
      <h3>Custom Conditions</h3>
      <ul>
        {client.medical_info?.customConditions?.map((c: any, index: number) => (
          <li key={index}>{c.name} (Severity: {c.severity}, Description: {c.description})</li>
        ))}
      </ul>
      <DetailItem><strong>Allergies:</strong> {client.medical_info?.allergies}</DetailItem>
      <DetailItem><strong>Medications:</strong> {client.medical_info?.medications}</DetailItem>
    </div>
  );
};

export default MedicalInfoTab;
