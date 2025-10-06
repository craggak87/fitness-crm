import React from 'react';
import styled from 'styled-components';

const DetailItem = styled.p`
  margin-bottom: 0.5rem;
`;

interface Props {
  client: any;
}

const PersonalInfoTab: React.FC<Props> = ({ client }) => {
  return (
    <div>
      <h2>Personal Information</h2>
      <DetailItem><strong>Email:</strong> {client.personal_info?.email}</DetailItem>
      <DetailItem><strong>Phone:</strong> {client.personal_info?.phone}</DetailItem>
      <DetailItem><strong>Date of Birth:</strong> {client.personal_info?.dateOfBirth}</DetailItem>
      <DetailItem><strong>Status:</strong> {client.status}</DetailItem>
      <h3>Emergency Contact</h3>
      <DetailItem><strong>Name:</strong> {client.personal_info?.emergencyContact?.name}</DetailItem>
      <DetailItem><strong>Phone:</strong> {client.personal_info?.emergencyContact?.phone}</DetailItem>
      <DetailItem><strong>Relationship:</strong> {client.personal_info?.emergencyContact?.relationship}</DetailItem>
    </div>
  );
};

export default PersonalInfoTab;
