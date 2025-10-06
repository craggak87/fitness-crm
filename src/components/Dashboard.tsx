import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const QuickActionButton = styled(Link)`
  display: block;
  background-color: #28a745;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Dashboard: React.FC = () => {
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [urgentAlerts, setUrgentAlerts] = useState<any[]>([]);
  const [dailySummary, setDailySummary] = useState({ scheduled: 0, completed: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientsRes, sessionsRes, paymentsRes, packagesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/clients'),
          axios.get('http://localhost:5000/api/sessions'),
          axios.get('http://localhost:5000/api/payments'),
          axios.get('http://localhost:5000/api/packages'),
        ]);

        const clients = clientsRes.data;
        const sessions = sessionsRes.data;
        const payments = paymentsRes.data;
        const packages = packagesRes.data;

        const now = new Date();
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        // Filter upcoming sessions for the next 24 hours
        const upcoming = sessions.filter((session: any) => {
          const sessionTime = new Date(session.scheduled_date_time || session.actual_start_time);
          return sessionTime > now && sessionTime <= endOfToday;
        }).map((session: any) => ({
          ...session,
          clientName: `${clients.find((c: any) => c.id === session.client_id)?.personal_info?.firstName || ''} ${clients.find((c: any) => c.id === session.client_id)?.personal_info?.lastName || ''}`,
        })).sort((a: any, b: any) => new Date(a.scheduled_date_time).getTime() - new Date(b.scheduled_date_time).getTime());

        setUpcomingSessions(upcoming);

        // Calculate daily summary
        const todaySessions = sessions.filter((session: any) => {
          const sessionDate = new Date(session.scheduled_date_time || session.actual_start_time);
          return sessionDate.toDateString() === now.toDateString();
        });

        setDailySummary({
          scheduled: todaySessions.length,
          completed: todaySessions.filter((session: any) => session.status === 'completed').length,
        });

        // Identify urgent alerts (medical conditions for today's clients)
        const alerts: any[] = [];
        upcoming.forEach((session: any) => {
          const client = clients.find((c: any) => c.id === session.client_id);
          if (client && client.medical_info && (client.medical_info.conditions?.length > 0 || client.medical_info.customConditions?.length > 0)) {
            alerts.push({
              type: 'medical',
              message: `Medical Alert for ${client.personal_info?.firstName} ${client.personal_info?.lastName} (Session at ${new Date(session.scheduled_date_time).toLocaleTimeString()})`,
              clientId: client.id,
            });
          }
        });
        // Add other alerts here (e.g., overdue payments, expiring packages)
        const today = new Date();
        payments.forEach((payment: any) => {
          if ((payment.payment_status === 'unpaid' || payment.payment_status === 'pending') && new Date(payment.payment_date) < today) {
            const client = clients.find((c: any) => c.id === payment.client_id);
            alerts.push({
              type: 'payment',
              message: `Overdue Payment from ${client?.personal_info?.firstName} ${client?.personal_info?.lastName} for ${payment.amount}`,
              clientId: client?.id,
            });
          }
        });

        packages.forEach((pkg: any) => {
          const remainingSessions = pkg.total_sessions - pkg.used_sessions;
          if (remainingSessions > 0 && remainingSessions <= 3) { // Threshold for expiring packages
            const client = clients.find((c: any) => c.id === pkg.client_id);
            alerts.push({
              type: 'package',
              message: `Package for ${client?.personal_info?.firstName} ${client?.personal_info?.lastName} has ${remainingSessions} sessions remaining`,
              clientId: client?.id,
            });
          }
        });

        setUrgentAlerts(alerts);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardContainer>
      <Card>
        <h2>Today's Summary</h2>
        <p>Scheduled Sessions: {dailySummary.scheduled}</p>
        <p>Completed Sessions: {dailySummary.completed}</p>
      </Card>

      <Card>
        <h2>Upcoming Sessions (Next 24h)</h2>
        {upcomingSessions.length > 0 ? (
          <ul>
            {upcomingSessions.map(session => (
              <li key={session.id}>
                {session.clientName} - {new Date(session.scheduledDateTime).toLocaleTimeString()}
                <div>
                  <Link to={`/log-session?clientId=${session.client_id}`} style={{ marginRight: '0.5rem' }}>Log Session</Link>
                  <Link to={`/clients/${session.client_id}`}>View Client</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming sessions.</p>
        )}
      </Card>

      <Card>
        <h2>Urgent Alerts</h2>
        {urgentAlerts.length > 0 ? (
          <ul>
            {urgentAlerts.map((alert, index) => (
              <li key={index}>{alert.message}</li>
            ))}
          </ul>
        ) : (
          <p>No urgent alerts.</p>
        )}
      </Card>

      <Card>
        <h2>Quick Actions</h2>
        <QuickActionButton to="/log-session">Log New Session</QuickActionButton>
        <QuickActionButton to="/add-client">Add New Client</QuickActionButton>
        <QuickActionButton to="/add-edit-payment">Record Payment</QuickActionButton>
      </Card>
    </DashboardContainer>
  );
};

export default Dashboard;
