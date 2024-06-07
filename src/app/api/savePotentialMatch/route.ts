import supabase from '../../../utils/supabase';
import sendEmail from '../../../utils/sendEmail';

export async function POST(request: Request) {
  const { userEmail, potentialMatchEmail } = await request.json();

  try {
    // get uuid for user and potential match
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('email', userEmail);

    if (userError) {
        throw userError;
        }

    const { data: potentialMatchData, error: potentialMatchError } = await supabase
        .from('User')
        .select('id')
        .eq('email', potentialMatchEmail);

    if (potentialMatchError) {
        throw potentialMatchError;
        }



    // Fetch current dateMatches array for user and potential match
    const { data: fetchUsers, error: fetchUsersError } = await supabase
        .from('User')
        .select('dateMatches')
        .eq('id', userData[0].id)

        if (fetchUsersError) {
            throw fetchUsersError;
            }

        const { data: fetchPotentialMatches, error: fetchPotentialMatchesError } = await supabase
        .from('User')
        .select('dateMatches')
        .eq('id', potentialMatchData[0].id);

    // Check for errors
    if (fetchPotentialMatchesError) {
        throw fetchPotentialMatchesError;
        }


        
    // append user's id to potential match's dateMatches array
    const updatedPotentialMatches = [...fetchPotentialMatches[0].dateMatches, userData[0].id];
    const updatedUser = await supabase
      .from('User')
      .update({ dateMatches: updatedPotentialMatches })
      .eq('id', potentialMatchData[0].id);

    if (updatedUser.error) {
      throw updatedUser.error;
    }

    // append potential match's id to user's dateMatches array
    const updatedUserMatches = [...fetchUsers[0].dateMatches, potentialMatchData[0].id];
    const updatedPotentialMatch = await supabase
      .from('User')
      .update({ dateMatches: updatedUserMatches })

    if (updatedPotentialMatch.error) {
      throw updatedPotentialMatch.error;
    }

    // Send email to both users
    const emailSubject = 'You have a new match!';
    const emailBody = `Congratulations! You and ${potentialMatchEmail} have matched. Check your dashboard to start chatting.`;
    await sendEmail(userEmail, emailSubject, emailBody);
    await sendEmail(potentialMatchEmail, emailSubject, emailBody);

    return Response.json({ message: 'Potential match saved and email sent' });
  } catch (error) {
    console.error('Error saving potential match:', error);
    return Response.json({ error: 'Failed to save potential match' });
  }
}