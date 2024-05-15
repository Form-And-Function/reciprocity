import Image from "next/image";

interface ProfileProps {
    name: string;
    pictures: string[];
    age: number;
    bio: string;
}

const Profile: React.FC<ProfileProps> = ({ name, age, bio, pictures }) => {
    return (
        <div>
            <h2>{name}</h2>
            <div>
            <p>Age: {age}</p>
            </div>
            
            <div>
            <p>Bio: {bio}</p>
            </div>
            
            <h3>Profile Pictures:</h3>
            <ul>
                {pictures.map((picture, index) => (
                    <li key={index}>
                        <Image src={picture} alt={`Picture ${index + 1}`} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;