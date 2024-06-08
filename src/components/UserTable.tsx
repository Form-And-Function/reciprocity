import React from 'react';
import supabase from '../utils/supabase';
import { auth } from '../auth';

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
  const session = await auth();

  if (!session?.user) return null;

  const userEmailAddress = session.user.email;

  if (!userEmailAddress) return null;

  const fetchProfile = async (userEmailAddress: string) => {
    "use server";
    const { data, error } = await supabase.from('User').select('dateChecks, dateMatches, bio, secretProfile').eq('email', userEmailAddress);

    if (error) {
      console.error('Error fetching profile:', error, data);
    } else {
      console.log('Profile fetched successfully:', data);
      return data;
    }
  };

  const userProfile = await fetchProfile(userEmailAddress);

  if (!userProfile) return null;

  const dateChecks = userProfile[0].dateChecks;
  const dateMatches = userProfile[0].dateMatches;
  const bio = userProfile[0].bio;
  const secretProfile = userProfile[0].secretProfile;

  const fetchUsers = async (formData: FormData) => {
    'use server';
    const ageFilter = formData.get('ageFilter') as string | null;
    const genderFilter = formData.get('genderFilter') as string | null;

    let query = supabase.from('User').select('id, firstName, bio, pictures, dob, gender, email');

    if (ageFilter !== null) {
      query = query.gte('dob', new Date(new Date().getFullYear() - parseInt(ageFilter), 0, 1));
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


  const users = await fetchUsers(new FormData());

  async function formAction(formData: FormData) {
    "use server";
    const users = await fetchUsers(formData);
    console.log(users);
  }

  async function handleCheckboxChange(formData: FormData) {
    "use server";
    const userId = formData.get('userId') as string;
    const potentialMatchEmail = formData.get('potentialMatchEmail') as string;
    const isChecked = formData.get('isChecked') === 'on';

    if (userEmailAddress) {
      if (isChecked) {
        await savePotentialMatch(userEmailAddress, potentialMatchEmail);
      } else {
        await removePotentialMatch(userEmailAddress, potentialMatchEmail);
      }
    }
  }

  async function savePotentialMatch(userEmail: string, potentialMatchEmail: string) {
    "use server";
    // get the uuid for the potential match

    const { data: potentialMatchData, error: potentialMatchError } = await supabase
      .from('User')
      .select('id')
      .eq('email', potentialMatchEmail);

    if (potentialMatchError) {
      console.error('error', potentialMatchError);
      return;
    }

    const potentialMatchId = potentialMatchData[0].id;

    // get the user's matches

    const { data, error } = await supabase
      .from('User')
      .select('dateChecks')
      .eq('id', potentialMatchId);

    if (error) {
      console.error('Error checking match:', error);
      return;
    }
    
    const dateChecks = data[0].dateChecks;

    // add the potential match to the user's matches

    const updatedDateChecks = [...dateChecks, userEmail];

    // update the user's matches

    const { data: updateData, error: updateError } = await supabase
      .from('User')
      .update({ updatedDateChecks: updatedDateChecks })
      .eq('id', potentialMatchId);
  }

  async function removePotentialMatch(userEmail: string, potentialMatchEmail: string) {
    "use server";
    
    // get the uuid for the potential match

    const { data: potentialMatchData, error: potentialMatchError } = await supabase
      .from('User')
      .select('id')
      .eq('email', potentialMatchEmail);

    if (potentialMatchError) {
      console.error('error', potentialMatchError);
      return;
    }

    const potentialMatchId = potentialMatchData[0].id;

    // get the user's matches

    const { data, error } = await supabase
      .from('User')
      .select('dateChecks')
      .eq('id', potentialMatchId);

    if (error) {
      console.error('Error checking match:', error);
      return;
    }

    const dateChecks = data[0].dateChecks;

    // remove the potential match from the user's matches

    const updatedDateChecks = dateChecks.filter((match: string) => match !== userEmail);

    // update the user's matches

    const { data: updateData, error: updateError } = await supabase
      .from('User')
      .update({ dateChecks: updatedDateChecks })
      .eq('id', potentialMatchId);

  }

  async function isMatched(userEmail: string, potentialMatchEmail: string) {
    "use server";

    const { data: potentialMatchData, error: potentialMatchError } = await supabase
    .from('User')
    .select('id')
    .eq('email', potentialMatchEmail);

    if (potentialMatchError) {
      console.error('error', potentialMatchError);
      return;
    }

    const potentialMatchId = potentialMatchData[0].id;


    const { data, error } = await supabase
      .from('User')
      .select('dateChecks')
      .eq('id', potentialMatchId);

    if (error) {
      console.error('Error checking match:', error);
      return false;
    } else {
      return data[0].dateChecks.includes(potentialMatchEmail);
    }
  }



  return (
    <div>
      <h3>Filters</h3>
      <form action={formAction}>
        <div className="filters">
          <div>
            <label>Age:</label>
            <input type="number" name="ageFilter" />
          </div>
          <div>
            <label>Gender:</label>
            <select name="genderFilter">
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button type="submit">Apply Filters</button>
        </div>
      </form>

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
                <form action={handleCheckboxChange}>
                  <input type="hidden" name="userId" value={user.id} />
                  {user.email && (
                    <input type="hidden" name="potentialMatchEmail" value={user.email} />
                  )}
                  <input type="checkbox" name="isChecked" className={
                    dateChecks.includes(user.email) ? 'matched' : ''
                  } />
                  
                </form>
              </td>
              <td>
                {/* <form action={handleCheckboxChange}>
                  <input type="hidden" name="userId" value={user.id} />
                  {user.email && (
                    <input type="hidden" name="potentialMatchEmail" value={user.email} />
                  )}
                  <input type="checkbox" name="isChecked" />
                  {user.email && userEmailAddress && isMatched(userEmailAddress, user.email) && <span>Matched!</span>}
                </form> */}
              </td>

              <td>
                {/* {user.otherCategoryName && (
                  <div>
                    <label>{user.otherCategoryName}</label>
                    <form action={handleCheckboxChange}>
                      <input type="hidden" name="userId" value={user.id} />
                      {user.email && (
                        <input type="hidden" name="potentialMatchEmail" value={user.email} />
                      )}
                      <input type="checkbox" name="isChecked" />
                      {user.email && userEmailAddress && isMatched(userEmailAddress, user.email) && <span>Matched!</span>}
                    </form>
                  </div>
                )} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;