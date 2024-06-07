// PotentialMatch.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../utils/supabase';

interface PotentialMatchProps {
    userEmail: string;
    potentialMatchEmail: string;
}

const PotentialMatch: React.FC<PotentialMatchProps> = ({
    userEmail,
    potentialMatchEmail,
}) => {
    const queryClient = useQueryClient();

    const { data: potentialMatch, isLoading } = useQuery({
        queryKey: ['potentialMatch', userEmail, potentialMatchEmail],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('PotentialMatches')
                .select('*')
                .eq('user_email', userEmail)
                .eq('potential_match_email', potentialMatchEmail)
                .single();

            if (error) {
                throw error;
            }

            return data;
        },
    });

    const { data: matchedUser } = useQuery({
        queryKey: ['matchedUser', potentialMatchEmail, userEmail],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('PotentialMatches')
                .select('*')
                .eq('user_email', potentialMatchEmail)
                .eq('potential_match_email', userEmail)
                .single();

            if (error) {
                throw error;
            }

            return data;
        },
        enabled: !!potentialMatch,
    });


    const savePotentialMatchMutation = useMutation<unknown, Error, void, unknown>(
        {
          mutationFn: async () => {
            const { data, error } = await supabase
              .from('PotentialMatches')
              .insert({ user_email: userEmail, potential_match_email: potentialMatchEmail });
      
            if (error) {
              throw error;
            }
      
            return data;
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['potentialMatch', userEmail, potentialMatchEmail],
            });
            queryClient.invalidateQueries({
              queryKey: ['matchedUser', potentialMatchEmail, userEmail],
            });
          },
        }
      );
      
      const removePotentialMatchMutation = useMutation<unknown, Error, void, unknown>(
        {
          mutationFn: async () => {
            const { data, error } = await supabase
              .from('PotentialMatches')
              .delete()
              .eq('user_email', userEmail)
              .eq('potential_match_email', potentialMatchEmail);
      
            if (error) {
              throw error;
            }
      
            return data;
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['potentialMatch', userEmail, potentialMatchEmail],
            });
            queryClient.invalidateQueries({
              queryKey: ['matchedUser', potentialMatchEmail, userEmail],
            });
          },
        }
      );
      
    const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            await savePotentialMatchMutation.mutateAsync();
        } else {
            await removePotentialMatchMutation.mutateAsync();
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={!!potentialMatch}
                    onChange={handleCheckboxChange}
                    disabled={!!matchedUser}
                />
                Potential Match
            </label>
            {matchedUser && <p>Matched!</p>}
        </div>
    );
};

export default PotentialMatch;