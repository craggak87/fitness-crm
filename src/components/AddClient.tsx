
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const AddClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();

  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({
    control,
    name: "medicalInfo.conditions"
  });

  const { fields: customConditionFields, append: appendCustomCondition, remove: removeCustomCondition } = useFieldArray({
    control,
    name: "medicalInfo.customConditions"
  });

  const { fields: goalFields, append: appendGoal, remove: removeGoal } = useFieldArray({
    control,
    name: "fitnessGoals"
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/clients/${id}`)
        .then(response => {
          const clientData = response.data;
          reset({
            personalInfo: {
              firstName: clientData.personal_info?.firstName || '',
              lastName: clientData.personal_info?.lastName || '',
              email: clientData.personal_info?.email || '',
              phone: clientData.personal_info?.phone || '',
              dateOfBirth: clientData.personal_info?.dateOfBirth?.split('T')[0] || '',
              emergencyContact: {
                name: clientData.personal_info?.emergencyContact?.name || '',
                phone: clientData.personal_info?.emergencyContact?.phone || '',
                relationship: clientData.personal_info?.emergencyContact?.relationship || '',
              },
            },
            medicalInfo: {
              conditions: clientData.medical_info?.conditions || [],
              customConditions: clientData.medical_info?.customConditions || [],
              allergies: clientData.medical_info?.allergies || '',
              medications: clientData.medical_info?.medications || '',
              doctorClearance: clientData.medical_info?.doctorClearance || false,
              lastMedicalUpdate: clientData.medical_info?.lastMedicalUpdate?.split('T')[0] || '',
            },
            fitnessGoals: clientData.fitness_goals || [],
            status: clientData.status || 'active',
          });
        })
        .catch(error => {
          console.error('Error fetching client for edit:', error);
        });
    }
  }, [id, reset, control]);

  const onSubmit = (data: any) => {
    const clientData = {
      personalInfo: data.personalInfo,
      medicalInfo: data.medicalInfo,
      fitnessGoals: data.fitnessGoals,
      status: data.status,
    };
    console.log('Client data being sent to backend:', clientData);

    if (id) {
      axios.put(`http://localhost:5000/api/clients/${id}`, clientData)
        .then(response => {
          console.log('Client updated:', response.data);
          // redirect to client list or show success message
        })
        .catch(error => {
          console.error('Error updating client:', error);
        });
    } else {
      axios.post('http://localhost:5000/api/clients', clientData)
        .then(response => {
          console.log('Client added:', response.data);
          // redirect to client list or show success message
        })
        .catch(error => {
          console.error('Error adding client:', error);
        });
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Client' : 'Add Client'}</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Personal Information</h2>
        <Input {...register('personalInfo.firstName', { required: true })} placeholder="First Name" />
        <Input {...register('personalInfo.lastName', { required: true })} placeholder="Last Name" />
        <Input {...register('personalInfo.email')} placeholder="Email" />
        <Input {...register('personalInfo.phone')} placeholder="Phone" />
        <Input type="date" {...register('personalInfo.dateOfBirth')} placeholder="Date of Birth" />

        <h2>Emergency Contact</h2>
        <Input {...register('personalInfo.emergencyContact.name')} placeholder="Name" />
        <Input {...register('personalInfo.emergencyContact.phone')} placeholder="Phone" />
        <Input {...register('personalInfo.emergencyContact.relationship')} placeholder="Relationship" />

        <h2>Medical Information</h2>
        <label>
          <input type="checkbox" {...register('medicalInfo.doctorClearance')} /> Doctor Clearance
        </label>
        <Input type="date" {...register('medicalInfo.lastMedicalUpdate')} placeholder="Last Medical Update" />
        <Input {...register('medicalInfo.allergies')} placeholder="Allergies" />
        <Input {...register('medicalInfo.medications')} placeholder="Medications" />

        <h3>Conditions</h3>
        {conditionFields.map((field, index) => (
          <div key={field.id}>
            <Input {...register(`medicalInfo.conditions.${index}.conditionId`)} placeholder="Condition ID" />
            <Input {...register(`medicalInfo.conditions.${index}.severity`)} placeholder="Severity" />
            <Input {...register(`medicalInfo.conditions.${index}.notes`)} placeholder="Notes" />
            <RemoveButton type="button" onClick={() => removeCondition(index)}>Remove</RemoveButton>
          </div>
        ))}
        <AddButton type="button" onClick={() => appendCondition({ conditionId: '', severity: '', notes: '' })}>Add Condition</AddButton>

        <h3>Custom Conditions</h3>
        {customConditionFields.map((field, index) => (
          <div key={field.id}>
            <Input {...register(`medicalInfo.customConditions.${index}.name`)} placeholder="Name" />
            <Input {...register(`medicalInfo.customConditions.${index}.description`)} placeholder="Description" />
            <Input {...register(`medicalInfo.customConditions.${index}.severity`)} placeholder="Severity" />
            <RemoveButton type="button" onClick={() => removeCustomCondition(index)}>Remove</RemoveButton>
          </div>
        ))}
        <AddButton type="button" onClick={() => appendCustomCondition({ name: '', description: '', severity: '' })}>Add Custom Condition</AddButton>

        <h2>Fitness Goals</h2>
        {goalFields.map((field, index) => (
          <div key={field.id}>
            <Input {...register(`fitnessGoals.${index}.goal`)} placeholder="Goal" />
            <Input type="date" {...register(`fitnessGoals.${index}.targetDate`)} placeholder="Target Date" />
            <Input {...register(`fitnessGoals.${index}.priority`)} placeholder="Priority" />
            <Input {...register(`fitnessGoals.${index}.status`)} placeholder="Status" />
            <RemoveButton type="button" onClick={() => removeGoal(index)}>Remove</RemoveButton>
          </div>
        ))}
        <AddButton type="button" onClick={() => appendGoal({ goal: '', targetDate: '', priority: '', status: '' })}>Add Goal</AddButton>

        <h2>Status</h2>
        <select {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="prospect">Prospect</option>
        </select>

        <Button type="submit">{id ? 'Update Client' : 'Add Client'}</Button>
      </Form>
    </div>
  );
};

export default AddClient;
