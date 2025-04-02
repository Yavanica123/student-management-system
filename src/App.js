import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    avg: '',
    semester: '',
    branch: '',
    phone: ''
  });

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handle Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (users.some(user => user.id === Number(newUser.id))) {
        // If ID exists, update the user
        await axios.put(`http://localhost:5000/api/users/${newUser.id}`, newUser);
      } else {
        // Add a new user
        await axios.post('http://localhost:5000/api/users', {
          ...newUser,
          id: Number(newUser.id), // Convert ID to a number
        });
      }

      // Reset form fields
      setNewUser({ id: '', name: '', avg: '', semester: '', branch: '', phone: '' });

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error adding/updating user:', error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1>Student Management System</h1>

      {/* Form to Add or Edit Student */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="ID"
          value={newUser.id}
          onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Average Score"
          value={newUser.avg}
          onChange={(e) => setNewUser({ ...newUser, avg: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Semester"
          value={newUser.semester}
          onChange={(e) => setNewUser({ ...newUser, semester: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Branch"
          value={newUser.branch}
          onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          pattern="[0-9]{10}"
          required
        />
        <button type="submit">{users.some(user => user.id === Number(newUser.id)) ? "Update Student" : "Add Student"}</button>
      </form>

      {/* Display Student List in Table */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Average</th>
            <th>Semester</th>
            <th>Branch</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.avg}</td>
              <td>{user.semester}</td>
              <td>{user.branch}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => setNewUser(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
