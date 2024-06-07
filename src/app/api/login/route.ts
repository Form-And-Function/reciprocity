// import bcrypt from 'bcrypt';
import bcrypt from 'bcrypt';
import supabase from '../../../utils/supabase';
import { cookies } from 'next/headers';

// accepts an api request with a post body with an email and password field

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;
    
    // bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // check for a new user with the email and hashed password
    const { data, error } = await supabase
        .from('User')
        .select('id')
        .eq('email', email)
        .eq('password_hash', hashedPassword);

    if (error) {
        console.error('error', error);
        return Response.json({ error });
    }
    else if (data.length === 0) {
        console.error('error', 'Invalid email or password');
        return Response.json({ error: 'Invalid email or password' });
    }

    // get or set the auth token from the Session table
    const { data: sessionData, error: sessionError } = await supabase
        .from('Session')
        .select('token')
        .eq('user_id', data[0].id);

    if (!sessionData || sessionData.length === 0) {
        const { data: newSessionData, error: newSessionError } = await supabase
            .from('Session')
            .insert({ user_id: data[0].id })
            .select('auth_token');

        if (newSessionError) {
            console.error('error', newSessionError);
            return Response.json({ error: newSessionError });
        }

        cookies().set('auth_token', newSessionData[0].auth_token, {
            path: '/',
        });
    }

    cookies().set('email', email, {
        path: '/',
    });

    return Response.json({});
}
