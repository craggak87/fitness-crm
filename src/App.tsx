import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import ClientList from './components/ClientList';
import Dashboard from './components/Dashboard';
import AddClient from './components/AddClient';
import ClientDetail from './components/ClientDetail';
import ExerciseList from './components/ExerciseList';
import AddExercise from './components/AddExercise';
import ExerciseDetail from './components/ExerciseDetail';
import WorkoutTemplateList from './components/WorkoutTemplateList';
import Receipt from './components/Receipt';
import AddWorkoutTemplate from './components/AddWorkoutTemplate';
import WorkoutTemplateDetail from './components/WorkoutTemplateDetail';
import AddEditSession from './components/AddEditSession';
import SessionList from './components/SessionList';
import SessionDetail from './components/SessionDetail';
import Schedule from './components/Schedule';
import PaymentList from './components/PaymentList';
import AddEditPayment from './components/AddEditPayment';
import PackageList from './components/PackageList';
import AddEditPackage from './components/AddEditPackage';
import './App.css';

const Nav = styled.nav`
  background: #333;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavList = styled.ul<{ open: boolean }>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: ${props => (props.open ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: #333;
  }
`;

const NavItem = styled.li`
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin: 0;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: block;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  span {
    height: 2px;
    width: 25px;
    background: white;
    margin-bottom: 4px;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <div>
        <Nav>
          <NavLink to="/">Fitness CRM</NavLink>
          <Hamburger onClick={() => setOpen(!open)}>
            <span />
            <span />
            <span />
          </Hamburger>
          <NavList open={open}>
            <NavItem><NavLink to="/" onClick={() => setOpen(false)}>Dashboard</NavLink></NavItem>
            <NavItem><NavLink to="/clients" onClick={() => setOpen(false)}>Clients</NavLink></NavItem>
            <NavItem><NavLink to="/exercises" onClick={() => setOpen(false)}>Exercise Database</NavLink></NavItem>
            <NavItem><NavLink to="/workout-templates" onClick={() => setOpen(false)}>Workout Templates</NavLink></NavItem>
            <NavItem><NavLink to="/sessions" onClick={() => setOpen(false)}>Sessions</NavLink></NavItem>
            <NavItem><NavLink to="/schedule" onClick={() => setOpen(false)}>Schedule</NavLink></NavItem>
            <NavItem><NavLink to="/payments" onClick={() => setOpen(false)}>Payments</NavLink></NavItem>
            <NavItem><NavLink to="/packages" onClick={() => setOpen(false)}>Packages</NavLink></NavItem>
          </NavList>
        </Nav>
        <div style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/add-client/:id" element={<AddClient />} />
            <Route path="/exercises" element={<ExerciseList />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/add-exercise" element={<AddExercise />} />
            <Route path="/add-exercise/:id" element={<AddExercise />} />
            <Route path="/workout-templates" element={<WorkoutTemplateList />} />
            <Route path="/workout-templates/:id" element={<WorkoutTemplateDetail />} />
            <Route path="/receipt/:paymentId" element={<Receipt />} />
            <Route path="/add-workout-template" element={<AddWorkoutTemplate />} />
            <Route path="/add-workout-template/:id" element={<AddWorkoutTemplate />} />
            <Route path="/log-session" element={<AddEditSession />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/sessions/:id" element={<SessionDetail />} />
            <Route path="/add-edit-session/:id" element={<AddEditSession />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/payments" element={<PaymentList />} />
            <Route path="/add-edit-payment" element={<AddEditPayment />} />
            <Route path="/add-edit-payment/:id" element={<AddEditPayment />} />
            <Route path="/packages" element={<PackageList />} />
            <Route path="/add-edit-package" element={<AddEditPackage />} />
            <Route path="/add-edit-package/:id" element={<AddEditPackage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;