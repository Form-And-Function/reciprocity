import React, { useState } from 'react';
import { FaPlus, FaTrash, FaGripVertical } from 'react-icons/fa';
import supabase from '../utils/supabase'; // Adjust the import path as needed
// import { AdvancedImage, lazyload } from '@cloudinary/react';
// import { Cloudinary } from '@cloudinary/url-gen';
import { CldUploadWidget } from 'next-cloudinary';

import { auth } from "../auth";
import email from 'next-auth/providers/email';



interface ProfileEditorProps {
  displayName: string;
  bio: string;
  age: number;
  pictures: string[];
}

const ProfileEditor: React.FC<ProfileEditorProps> = async (props) => {

  const [displayName, setDisplayName] = useState(props.displayName);
  const [bio, setBio] = useState(props.bio);
  const [pictures, setPictures] = useState<string[]>([]);


  const session = await auth();
 
  if (!session?.user) return null


  const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };

  const handleUpload = (result: any) => {
    setPictures([...pictures, result.info.secure_url]);
  };

  const saveProfile = async () => {
    // try {
    //   const cld = new Cloudinary({
    //     cloud: {
    //       cloudName: 'djmeaco6h',
    //     },
    //   });
  
    //   // Upload pictures to Cloudinary
    //   const uploadedPictures = await Promise.all(
    //     pictures.map(async (picture) => {
    //       const response = await fetch(picture);
    //       const blob = await response.blob();
    //       const uploadedImage = await cld.upload(blob, {
    //         folder: 'profile_pictures',
    //       });
    //       return uploadedImage.secure_url;
    //     })
    //   );
  
      // Save the profile to the Supabase database
      const { data, error } = await supabase.from('User').upsert({
        email: session.user?.email,
        firstName: displayName,
        bio: bio,
        pictures: pictures,
      });
  
      if (error) {
        console.error('Error saving profile:', error, data);
      } else {
        console.log('Profile saved successfully:', data);
      }
    // } catch (error) {}
  };

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPictures = [...pictures];
        newPictures[index] = reader.result as string;
        setPictures(newPictures);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPicture = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files && (event.target as HTMLInputElement).files![0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPictures([...pictures, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const handleRemovePicture = (index: number) => {
    const newPictures = [...pictures];
    newPictures.splice(index, 1);
    setPictures(newPictures);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();
    const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const newPictures = [...pictures];
    const [removed] = newPictures.splice(sourceIndex, 1);
    newPictures.splice(targetIndex, 0, removed);
    setPictures(newPictures);
  };

  return (
    <form>
      <label htmlFor="display-name">Display Name:</label>
      <input type="text" id="display-name" value={displayName} onChange={handleDisplayNameChange} />
      <br />
      <label htmlFor="bio">Bio:</label>
      <textarea id="bio" value={bio} onChange={handleBioChange} />
      <br />
      <h3>Profile Pictures:</h3>
      {pictures.map((picture, index) => (
        <div
          key={index}
          draggable
          onDragStart={(event) => handleDragStart(event, index)}
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, index)}
        >
          <img src={picture} alt={`Picture ${index + 1}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
          <button type="button" onClick={() => handleRemovePicture(index)}>
            <FaTrash />
          </button>
          <FaGripVertical />
        </div>
      ))}
      {/* <CldUploadWidget uploadPreset="ml_default" signatureEndpoint="/api/sign-cloudinary-params" onSuccess={handleUpload}> */}

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
      <button type="submit" className="saveProfile" onClick={(event) => { event.preventDefault(); saveProfile(); }}>
        Save
      </button>
    </form>
  );
};

export default ProfileEditor;