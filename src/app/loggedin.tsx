import { auth } from "../auth";
import ProfileEditor from "@/components/ProfileEditor";
import UserTable from "@/components/UserTable";

export default async function LoggedIn() {
    const session = await auth();
    if (!session?.user || !session.user.email) {
        return null;
    }
    return (
        <div>
            <h2>Your profile</h2>
            <ProfileEditor displayName="John Doe" bio="Hello, world!" pictures={["/picture1.jpg", "/picture2.jpg"]} age={23} email={session.user.email} />
            <br />
            <UserTable />
        </div>
    )
    }