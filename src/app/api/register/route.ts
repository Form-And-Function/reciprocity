// import bcrypt from 'bcrypt';
import bcrypt from 'bcrypt';
import supabase from '../../../utils/supabase';

// accepts an api request with a post body with an email and password field

export async function POST(request: Request) {
    const body = await request.json();
    const { email, password } = body;
    
    // bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // upsert a new user with the email and hashed password
    const { data, error } = await supabase
        .from('User')
        .insert([{ email, password: hashedPassword }]);

    if (error) {
        console.error('error', error);
    }

    return Response.json({});
}
