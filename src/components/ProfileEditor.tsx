import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaCheck } from 'react-icons/fa';

interface ProfileEditorProps {
    displayName: string;
    bio: string;
    age: number;
    pictures: string[];
}

function ProfileEditor(props: ProfileEditorProps) {
    const [displayName, setDisplayName] = useState(props.displayName);
    const [bio, setBio] = useState(props.bio);
    const [pictures, setPictures] = useState(props.pictures);

    const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(event.target.value);
    };

    const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(event.target.value);
    };

    const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newPictures = [...pictures];
        newPictures[index] = event.target.value;
        setPictures(newPictures);
    };

    const handlePictureReorder = (oldIndex: number, newIndex: number) => {
        const newPictures = [...pictures];
        const [removedPicture] = newPictures.splice(oldIndex, 1);
        newPictures.splice(newIndex, 0, removedPicture);
        setPictures(newPictures);
    };

    return (
        <form>
            <label htmlFor="display-name">Display Name:</label>
            <input
                type="text"
                id="display-name"
                value={displayName}
                onChange={handleDisplayNameChange} />
                <br />

            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" value={bio} onChange={handleBioChange} />
<br />
            <h3>Profile Pictures:</h3>
            {pictures.map((picture, index) => (
                <div key={index}>
                    <label htmlFor={`picture-${index}`}>Picture {index + 1}:</label>
                    <input
                        type="file"
                        accept="image/*"
                        className={`picture-${index}`}
                        value={picture}
                        onChange={(event) => handlePictureChange(event, index)} />
                    <button type="button" onClick={() => handlePictureReorder(index, index - 1)}>
                        <FaArrowUp />
                    </button>
                    <button type="button" onClick={() => handlePictureReorder(index, index + 1)}>
                        <FaArrowDown />
                    </button>
                </div>
            ))}


            <button type="submit" className='saveProfile'><FaCheck /> Save</button>
        </form>
    );
}

export default ProfileEditor;