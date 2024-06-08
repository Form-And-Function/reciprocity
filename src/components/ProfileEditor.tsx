import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import supabase from '../utils/supabase'; // Adjust the import path as needed
import { CldUploadWidget } from 'next-cloudinary';
import { auth } from "../auth"
// import { on } from 'events';

console.log('ProfileEditor');

const ProfileEditor = async () => {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const fetchProfile = async (email: string) => {
    "use server";
    const { data, error } = await supabase.from('User').select('firstName, bio, pictures, dob, gender, secretProfile').eq('email', email);

    if (error) {
      console.error('Error fetching profile:', error, data);
    } else {
      console.log('Profile fetched successfully:', data);
      return data;
    }
  };

  const profile = await fetchProfile(email);

  let displayName: string = 'Mary Poppins';
  let bio: string = 'Practically perfect in every way.';
  let pictures: string[] = [];
  let dob: string = '1964-08-27';
  let gender = 'Female';
  let secretProfile: string = 'I secretly hate children and don\'t want any.';


  if (profile) {
    displayName = profile[0].firstName;
    bio = profile[0].bio;
    pictures = profile[0].pictures;
    dob = profile[0].dob;
    gender = profile[0].gender;
    secretProfile = profile[0].secretProfile;
  }


  const saveProfile = async (displayName: string, bio: string, pictures: string[], dob: string, gender: string, secretProfile: boolean) => {
    "use server";
    const { data, error } = await supabase.from('User').upsert({
      email: session?.user?.email,
      firstName: displayName,
      bio: bio,
      pictures: pictures,
      dob: dob,
      gender: gender,
      secretProfile: secretProfile,
    });

    if (error) {
      console.error('Error saving profile:', error, data);
    } else {
      console.log('Profile saved successfully:', data);
    }
  };
  
  async function handleFormSubmit(formData: FormData) {
    'use server';
    const displayName = formData.get('display-name') as string;
    const bio = formData.get('bio') as string;
    const pictures = formData.get('picture')?.toString().split(',') || [];
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const secretProfile = formData.get('secret-profile') === 'on';
    await saveProfile(displayName, bio, pictures, dob, gender, secretProfile);
  }

  const handleUpload = (result: any) => {
    const pictureInput = document.querySelector('#picture-input') as HTMLInputElement;
    if (pictureInput) {
      const pictures = pictureInput.value ? pictureInput.value.split(',') : [];
      pictures.push(result.info.secure_url);
      pictureInput.value = pictures.join(',');
    }
  };

  const handleRemovePicture = (index: number) => {
    const pictureInput = document.querySelector('#picture-input') as HTMLInputElement;
    if (pictureInput) {
      const pictures = pictureInput.value ? pictureInput.value.split(',') : [];
      pictures.splice(index, 1);
      pictureInput.value = pictures.join(',');
    }
  };

  console.log('profile', profile);

  console.log('made it here');

  return (
    <form action={handleFormSubmit}>
      <label htmlFor="display-name">Display Name:</label>
      <input type="text" id="display-name" name="display-name" defaultValue={displayName} />
      <br />
      <label htmlFor="bio">Bio:</label>
      <textarea id="bio" name="bio" defaultValue={bio}></textarea>
      <br />
      <label htmlFor="dob">Date of Birth:</label>
      <input type="date" id="dob" name="dob" defaultValue={dob} />
      <br />
      <label htmlFor="gender">Gender:</label>
      <select id="gender" name="gender" defaultValue={gender}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <br />
      <label htmlFor="secret-profile">Secret information: this will not be displayed on your profile but it will be used to suggest matches.
        Think of it as a place to put kinks, blunt dealbreakers, baggage, what you are really looking for, etc.</label>
      <textarea id="secret-profile" name="secret-profile" defaultValue="I secretly hate children and don't want any."></textarea>
      <br />
      <h3>Profile Pictures:</h3>
      <input type="hidden" id="picture-input" name="picture" />
      {pictures.map((picture, index) => (
        <div key={index}>
          <img src={picture} alt={`Picture ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          {/* <button type="button" onClick={() => handleRemovePicture(index)}>
            <FaTrash />
          </button> TODO*/}
        </div>
      ))}
      {/* <CldUploadWidget uploadPreset="ilyfrft7" onSuccess={handleUpload}>
        {({ open }) => {
          return (
            <button type="button" onClick={() => open()}>
              <FaPlus /> Add Picture
            </button>
          );
        }}
      </CldUploadWidget> */}
      <br />
      <button type="submit" className="saveProfile">
        Save
      </button>
    </form>
  );
};

export default ProfileEditor;