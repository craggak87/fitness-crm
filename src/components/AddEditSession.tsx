import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import styled from 'styled-components';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SetModal from './SetModal';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const MedicalAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ExerciseContainer = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const SetContainer = styled.div`
  margin-left: 1rem;
  border: 1px dashed #eee;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  span {
    flex-grow: 1;
  }
`;

const AddEditSession: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, control } = useForm();
  const [clients, setClients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [packages, setPackages] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [currentSetIndex, setCurrentSetIndex] = useState<number | null>(null);

  const selectedClientId = watch('clientId');

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: "exercises",
  });

  const handleAddSet = (exerciseIndex: number) => {
    setCurrentExerciseIndex(exerciseIndex);
    setCurrentSetIndex(null);
    setIsSetModalOpen(true);
  };

  const handleEditSet = (exerciseIndex: number, setIndex: number) => {
    setCurrentExerciseIndex(exerciseIndex);
    setCurrentSetIndex(setIndex);
    setIsSetModalOpen(true);
  };

  const handleSaveSet = (set: any) => {
    if (currentExerciseIndex !== null) {
      const currentExercises = watch('exercises');
      const newExercises = [...currentExercises];
      const exerciseToUpdate = newExercises[currentExerciseIndex];
      let updatedSets;

      if (currentSetIndex !== null) {
        // Edit existing set
        updatedSets = [...(exerciseToUpdate.setsCompleted || [])];
        updatedSets[currentSetIndex] = set;
      } else {
        // Add new set
        updatedSets = [...(exerciseToUpdate.setsCompleted || []), set];
      }

      newExercises[currentExerciseIndex] = {
        ...exerciseToUpdate,
        setsCompleted: updatedSets,
      };

      reset({
        ...watch(),
        exercises: newExercises,
      });
    }
    setIsSetModalOpen(false);
  };

  const handleCloseSetModal = () => {
    setIsSetModalOpen(false);
    setCurrentExerciseIndex(null);
    setCurrentSetIndex(null);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const currentExercises = watch('exercises');
    const currentExerciseSets = currentExercises[exerciseIndex]?.setsCompleted || [];
    reset({
      ...watch(),
      exercises: currentExercises.map((ex: any, idx: number) =>
        idx === exerciseIndex ? { ...ex, setsCompleted: currentExerciseSets.filter((s: any, sIdx: number) => sIdx !== setIndex) } : ex
      ),
    });
  };

  // Fetch all exercises on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/exercises')
      .then(res => setAllExercises(res.data))
      .catch(error => console.error('Error fetching all exercises:', error));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const clientIdFromUrl = queryParams.get('clientId');

    axios.get('http://localhost:5000/api/clients').then(res => {
      setClients(res.data);
      console.log('Clients:', res.data);
    });
    axios.get('http://localhost:5000/api/workout-templates').then(res => setTemplates(res.data));

    if (id) {
      axios.get(`http://localhost:5000/api/sessions/${id}`)
        .then(response => {
          const sessionData = response.data;
          reset({
            clientId: sessionData.client_id,
            templateId: sessionData.template_id,
            packageId: sessionData.package_id,
            scheduledDateTime: sessionData.scheduled_date_time ? new Date(sessionData.scheduled_date_time).toISOString().slice(0, 16) : '',
            actualStartTime: sessionData.actual_start_time ? new Date(sessionData.actual_start_time).toISOString().slice(0, 16) : '',
            actualEndTime: sessionData.actual_end_time ? new Date(sessionData.actual_end_time).toISOString().slice(0, 16) : '',
            status: sessionData.status,
            exercises: sessionData.exercises || [],
            sessionNotes: sessionData.session_notes,
            clientConditionAlerts: sessionData.client_condition_alerts?.join(','),
            nextSessionRecommendations: sessionData.next_session_recommendations,
            paymentStatus: sessionData.payment_status,
          });
        })
        .catch(error => {
          console.error('Error fetching session for edit:', error);
        });
    } else if (clientIdFromUrl) {
      reset({ clientId: clientIdFromUrl });
    }
  }, [id, location.search, reset]);

  useEffect(() => {
    if (selectedClientId) {
      axios.get(`http://localhost:5000/api/clients/${selectedClientId}`)
        .then(res => {
          setSelectedClient(res.data);
          console.log('Selected client:', res.data);
        })
        .catch(error => console.error('Error fetching client details:', error));

      axios.get(`http://localhost:5000/api/packages/client/${selectedClientId}`)
        .then(res => setPackages(res.data))
        .catch(error => console.error('Error fetching client packages:', error));
    } else {
      setSelectedClient(null);
      setPackages([]);
    }
  }, [selectedClientId]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      packageId: data.packageId || null, // Convert empty string to null for UUID
      scheduledDateTime: data.scheduledDateTime || new Date().toISOString().slice(0, 16),
      actualStartTime: data.actualStartTime || new Date().toISOString().slice(0, 16),
      actualEndTime: data.actualEndTime || null,
      clientConditionAlerts: data.clientConditionAlerts ? data.clientConditionAlerts.split(',').map((item: string) => item.trim()) : [],
      exercises: data.exercises.map((exercise: any) => ({
        ...exercise,
        setsCompleted: exercise.setsCompleted.map((set: any) => ({
          ...set,
          reps: parseInt(set.reps, 10),
          weight: parseFloat(set.weight),
        })),
      }))
    };

    console.log('Submitting session data:', formattedData);
    console.log('Exercises being sent:', formattedData.exercises);

    if (id) {
      axios.put(`http://localhost:5000/api/sessions/${id}`, formattedData)
        .then(() => navigate('/sessions'))
        .catch(error => console.error('Error updating session:', error));
    } else {
      console.log('Formatted data before POST:', formattedData);
      axios.post('http://localhost:5000/api/sessions', formattedData)
        .then(() => navigate('/sessions'))
        .catch(error => console.error('Error logging session:', error));
    }
  };

  const initialSetData = currentExerciseIndex !== null && currentSetIndex !== null
    ? watch(`exercises.${currentExerciseIndex}.setsCompleted.${currentSetIndex}`)
    : undefined;

  console.log('Initial set data for modal:', initialSetData);

  return (
    <div>
      <h1>{id ? 'Edit Session' : 'Log Session'}</h1>

      {selectedClient && selectedClient.medical_info && (
        <MedicalAlert>
          <h3>Medical Alerts for {selectedClient.personal_info?.firstName}</h3>
          {selectedClient.medical_info.conditions?.length > 0 && (
            <div>
              <strong>Conditions:</strong>
              <ul>
                {selectedClient.medical_info.conditions.map((c: any, index: number) => (
                  <li key={index}>{c.conditionId} (Severity: {c.severity})</li>
                ))}
              </ul>
            </div>
          )}
          {selectedClient.medical_info.customConditions?.length > 0 && (
            <div>
              <strong>Custom Conditions:</strong>
              <ul>
                {selectedClient.medical_info.customConditions.map((c: any, index: number) => (
                  <li key={index}>{c.name} (Severity: {c.severity})</li>
                ))}
              </ul>
            </div>
          )}
          {selectedClient.medical_info.allergies && <p><strong>Allergies:</strong> {selectedClient.medical_info.allergies}</p>}
          {selectedClient.medical_info.medications && <p><strong>Medications:</strong> {selectedClient.medical_info.medications}</p>}
        </MedicalAlert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Select {...register('clientId', { required: true })}>
          <option value="">Select Client</option>
          {clients.map((client: any) => <option key={client.id} value={client.id}>{client.personal_info?.firstName} {client.personal_info?.lastName}</option>)}
        </Select>
        <Select {...register('templateId')}>
          <option value="">Select Workout Template</option>
          {templates.map((template: any) => <option key={template.id} value={template.id}>{template.name}</option>)}
        </Select>
        <Select {...register('packageId')}>
          <option value="">Select Package (optional)</option>
          {packages.map((pkg: any) => <option key={pkg.id} value={pkg.id}>{pkg.name}</option>)}
        </Select>
        <label htmlFor="scheduledDateTime">Scheduled Date & Time</label>
        <Input id="scheduledDateTime" type="datetime-local" {...register('scheduledDateTime')} placeholder="Scheduled Date & Time" />
        <label htmlFor="actualStartTime">Actual Start Time</label>
        <Input id="actualStartTime" type="datetime-local" {...register('actualStartTime')} placeholder="Actual Start Time" />
        <label htmlFor="actualEndTime">Actual End Time</label>
        <Input id="actualEndTime" type="datetime-local" {...register('actualEndTime')} placeholder="Actual End Time" />
        <Select {...register('status')}>
          <option value="">Select Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-Show</option>
          <option value="rescheduled">Rescheduled</option>
        </Select>
        <textarea {...register('sessionNotes')} placeholder="Session Notes"></textarea>

        <h2>Exercises Logged</h2>
        {exerciseFields.map((exerciseField: any, exerciseIndex: number) => (
          <ExerciseContainer key={exerciseField.id}>
            <Select {...register(`exercises.${exerciseIndex}.exerciseId`)}>
              <option value="">Select Exercise</option>
              {allExercises.map((ex: any) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </Select>
            <Input {...register(`exercises.${exerciseIndex}.exerciseName`)} placeholder="Exercise Name (denormalized)" />
            <textarea {...register(`exercises.${exerciseIndex}.clientFeedback`)} placeholder="Client Feedback"></textarea>
            <textarea {...register(`exercises.${exerciseIndex}.instructorNotes`)} placeholder="Instructor Notes"></textarea>

            <h3>Sets</h3>
            {exerciseField.setsCompleted && exerciseField.setsCompleted.map((setField: any, setIndex: number) => (
              <SetContainer key={setField.id}>
                <span>Set {setField.setNumber}: {setField.reps} reps at {setField.weight} kg</span>
                <Button type="button" onClick={() => handleEditSet(exerciseIndex, setIndex)} style={{ backgroundColor: '#ffc107' }}>Edit</Button>
                <Button type="button" onClick={() => removeSet(exerciseIndex, setIndex)}>Remove</Button>
              </SetContainer>
            ))}
            <Button type="button" onClick={() => handleAddSet(exerciseIndex)}>Add Set</Button>
            <Button type="button" onClick={() => removeExercise(exerciseIndex)}>Remove Exercise</Button>
          </ExerciseContainer>
        ))}
        <Button type="button" onClick={() => appendExercise({ exerciseId: '', exerciseName: '', setsCompleted: [], clientFeedback: '', instructorNotes: '' })}>Add Exercise</Button>

        <textarea {...register('clientConditionAlerts')} placeholder="Client Condition Alerts (comma-separated)"></textarea>
        <textarea {...register('nextSessionRecommendations')} placeholder="Next Session Recommendations"></textarea>
        <Select {...register('paymentStatus')}>
          <option value="">Select Payment Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </Select>
        <Button type="submit">{id ? 'Update Session' : 'Log Session'}</Button>
      </Form>
      {isSetModalOpen && (
        <SetModal
          isOpen={isSetModalOpen}
          onClose={handleCloseSetModal}
          onSave={handleSaveSet}
          initialSet={initialSetData}
        />
      )}
    </div>
  );
};

export default AddEditSession;