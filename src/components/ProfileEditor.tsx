import React from 'react';
import { FaPlus, FaTrash, FaGripVertical } from 'react-icons/fa';
import supabase from '../utils/supabase'; // Adjust the import path as needed
import { CldUploadWidget } from 'next-cloudinary';

interface ProfileEditorProps {
  displayName: string;
  bio: string;
  age: number;
  pictures: string[];
  email: string;
}

const ProfileEditor: React.FC<ProfileEditorProps> = async (props) => {
  const saveProfile = async (displayName: string, bio: string, pictures: string[]) => {
    const { data, error } = await supabase.from('User').upsert({
      email: props.email,
      firstName: displayName,
      bio: bio,
      pictures: pictures,
    });

    if (error) {
      console.error('Error saving profile:', error, data);
    } else {
      console.log('Profile saved successfully:', data);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const displayName = formData.get('display-name') as string;
    const bio = formData.get('bio') as string;
    const pictures = Array.from(formData.getAll('picture') as string[]);

    await saveProfile(displayName, bio, pictures);
  };

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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="display-name">Display Name:</label>
      <input type="text" id="display-name" name="display-name" defaultValue={props.displayName} />
      <br />
      <label htmlFor="bio">Bio:</label>
      <textarea id="bio" name="bio" defaultValue={props.bio} />
      <br />
      <h3>Profile Pictures:</h3>
      <input type="hidden" id="picture-input" name="picture" defaultValue={props.pictures.join(',')} />
      {props.pictures.map((picture, index) => (
        <div key={index}>
          <img src={picture} alt={`Picture ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          <button type="button" onClick={() => handleRemovePicture(index)}>
            <FaTrash />
          </button>
        </div>
      ))}
      <CldUploadWidget uploadPreset="ilyfrft7" onSuccess={handleUpload}>
        {({ open }) => {
          return (
            <button type="button" onClick={() => open()}>
              <FaPlus /> Add Picture
            </button>
          );
        }}
      </CldUploadWidget>
      <br />
      <button type="submit" className="saveProfile">
        Save
      </button>
    </form>
  );
};

export default ProfileEditor;