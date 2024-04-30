interface ProfileProps {
    name: string;
    pictures: string[];
    age: number;
    bio: string;
}

const Profile: React.FC<ProfileProps> = ({ name, age, bio }) => {
    return (
        <div>
            <h2>{name}</h2>
            <p>Age: {age}</p>
            <p>Bio: {bio}</p>
        </div>
    );
};

export default Profile;