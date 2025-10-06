import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  clientId: string;
}

const ProgressTab: React.FC<Props> = ({ clientId }) => {
  const [progressData, setProgressData] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/exercises').then(res => setExercises(res.data));
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      axios.get(`http://localhost:5000/api/progress/${clientId}/${selectedExercise}`)
        .then(res => setProgressData(res.data))
        .catch(error => console.error('Error fetching progress data:', error));
    }
  }, [clientId, selectedExercise]);

  return (
    <div>
      <h2>Progress</h2>
      <select onChange={e => setSelectedExercise(e.target.value)} value={selectedExercise}>
        <option value="">Select an exercise</option>
        {exercises.map((exercise: any) => (
          <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
        ))}
      </select>
      {progressData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="scheduled_date_time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_volume" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No progress data available for this exercise.</p>
      )}
    </div>
  );
};

export default ProgressTab;
