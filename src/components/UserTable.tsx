import React from 'react';
import supabase from '../utils/supabase';
import Image from 'next/image';
import { auth } from "../auth";
import CheckBox from './checkbox';

interface User {
  id: string;
  firstName: string | null;
  bio: string | null;
  pictures: string[];
  dob: string | null;
  gender: string | null;
  otherCategoryName: string | null;
  email: string | null;
}

const UserTable: React.FC = async () => {
  const fetchUsers = async (ageFilter: number | null, genderFilter: string | null) => {
    let query = supabase.from('User').select('id, firstName, bio, pictures, dob, gender');

    if (ageFilter !== null) {
      query = query.gte('dob', new Date(new Date().getFullYear() - ageFilter, 0, 1));
    }

    if (genderFilter !== null) {
      query = query.eq('gender', genderFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('error', error);
      return [];
    } else {
      return data as User[];
    }
  };

  const session = await auth();

  if (!session?.user) return null;

  const userEmailAddress = session.user.email;

  const ageFilter = null; // Replace with your age filter value
  const genderFilter = null; // Replace with your gender filter value

  const users = await fetchUsers(ageFilter, genderFilter);

  return (
    <div>
      <h3>Filters</h3>
      <div className='filters'>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={ageFilter ?? ''}
            onChange={(e) => {
              const newAgeFilter = e.target.value ? Number(e.target.value) : null;
              fetchUsers(newAgeFilter, genderFilter);
            }}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            value={genderFilter ?? ''}
            onChange={(e) => {
              const newGenderFilter = e.target.value || null;
              fetchUsers(ageFilter, newGenderFilter);
            }}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Profile Picture</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Hang out?</th>
            <th>Go on a date?</th>
            <th>Something else?</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.bio}</td>
              <td>
                {user.pictures.length > 0 && (
                  <img src={user.pictures[0]} alt="Profile" width={100} height={100} />
                )}
              </td>
              <td>{user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : ''}</td>
              <td>{user.gender}</td>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <CheckBox userEmail='userEmailAddress' potentialMatchEmail='user.email' />
              </td>
              <td>
                {user.otherCategoryName && (
                  <div>
                    <label>{user.otherCategoryName}</label>
                    <input type="checkbox" />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;