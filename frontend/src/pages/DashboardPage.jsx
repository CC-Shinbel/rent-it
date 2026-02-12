import React from 'react';
import ClientShellLayout from '../client/ClientShellLayout';
import ClientDashboardPage from '../client/ClientDashboardPage';

function DashboardPage() {
  // Placeholder values; replace with real data from your API/auth context
  const fullName = '';
  const memberStatus = 'Bronze';
  const totalSpent = 0;
  const activeCount = 0;
  const upcomingReturns = 0;
  const activeRentals = [];
  const history = [];

  return (
    <ClientShellLayout>
      <ClientDashboardPage
        fullName={fullName}
        memberStatus={memberStatus}
        totalSpent={totalSpent}
        activeCount={activeCount}
        upcomingReturns={upcomingReturns}
        activeRentals={activeRentals}
        history={history}
      />
    </ClientShellLayout>
  );
}

export default DashboardPage;
