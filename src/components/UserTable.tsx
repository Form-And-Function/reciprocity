import React, { useEffect, useState } from 'react';
import supabase from '../utils/supabase'; // Adjust the import path as needed

interface User {
  id: string;
  firstName: string | null;
  bio: string | null;
  pictures: string[]; // Assuming pictures are stored as an array of URLs
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('id, firstName, bio, pictures');

    if (error) {
      console.error('error', error);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Bio</th>
          <th>Profile Picture</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.firstName}</td>
            <td>{user.bio}</td>
            <td>
              {user.pictures.length > 0 && (
                <img src={user.pictures[0]} alt="Profile" style={{ width: '100px' }} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
