import React from 'react';
import AddUserForm from './AddUserForm';
import DeleteUserModal from './DeleteUserModal';
import EditUserForm from './EditUserForm';
import RAdminDashboard from './RAdminDashboard';
import Statistics from './Statistics';

const DigiLib = () => {
  return (
    <div className="digilib-container"> {/* ✅ Added class for spacing */}
      <RAdminDashboard />
      <DeleteUserModal/>
      <Statistics/>
    </div>
  );
};

export default DigiLib;
