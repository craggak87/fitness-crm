import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: red;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  gap: 1rem;
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

interface SetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (set: any) => void;
  initialSet?: any;
}

const SetModal: React.FC<SetModalProps> = ({ isOpen, onClose, onSave, initialSet }) => {
  console.log('SetModal rendered. isOpen:', isOpen);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialSet || { setNumber: '', reps: '', weight: '', notes: '' },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(initialSet || { setNumber: '', reps: '', weight: '', notes: '' });
    }
  }, [isOpen, initialSet, reset]);

  const onSubmit = (data: any) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>{initialSet ? 'Edit Set' : 'Add New Set'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input type="number" {...register('setNumber')} placeholder="Set Number" />
          <Input type="number" {...register('reps')} placeholder="Reps" />
          <Input type="number" step="0.01" {...register('weight')} placeholder="Weight" />
          <Input {...register('notes')} placeholder="Notes" />
          <Button type="submit">Save Set</Button>
          <Button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d', marginLeft: '10px' }}>Cancel</Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SetModal;
