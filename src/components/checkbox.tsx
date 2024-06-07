// a checkbox input. Takes a user email and a potential_match_email
// if the user checks the box, it will save that to the database
// if the other user has the corresponding box checked, it will create a match
// if the user unchecks the box, it will remove that from the database unless the other user has already checked the box

import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';

interface PotentialMatchProps {
  userEmail: string;
  potentialMatchEmail: string;
  initialIsChecked: boolean;
  initialIsMatched: boolean;
}

const PotentialMatch: React.FC<PotentialMatchProps> = ({
  userEmail,
  potentialMatchEmail,
  initialIsChecked,
  initialIsMatched,
}) => {
  const [isChecked, setIsChecked] = useState(initialIsChecked);
  const [isMatched, setIsMatched] = useState(initialIsMatched);

  useEffect(() => {
    const updateMatch = async () => {
      if (isChecked && !isMatched) {
        const { data, error } = await supabase
          .from('PotentialMatches')
          .select('*')
          .eq('user_email', potentialMatchEmail)
          .eq('potential_match_email', userEmail);

        if (error) {
          console.error('Error checking match:', error);
        } else {
          setIsMatched(data.length > 0);
        }
      }
    };

    updateMatch();
  }, [isChecked, isMatched, userEmail, potentialMatchEmail]);

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsChecked(isChecked);

    if (isChecked) {
      await fetch('/api/savePotentialMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, potentialMatchEmail }),
      });
    } else {
      await fetch('/api/removePotentialMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, potentialMatchEmail }),
      });
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={isMatched}
        />
        Potential Match
      </label>
      {isMatched && <p>Matched!</p>}
    </div>
  );
};

export default PotentialMatch;