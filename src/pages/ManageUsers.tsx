// src/pages/ManageUsers.tsx
import React, { useState } from 'react';
import ProtectedRoute from 'src/components/ProtectedRoute';
import { UserRole, User, getRolePermissions } from '../lib/types';

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.MEMBER
  });

  const addUser = () => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      permissions: getRolePermissions(newUser.role)
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: UserRole.MEMBER });
  };

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="manage-users">
        <h1>Manage Users</h1>
        <div className="add-user-form">
          <input 
            placeholder="Name" 
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          />
          <input 
            placeholder="Email" 
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
          <select 
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button onClick={addUser}>Add User</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
};