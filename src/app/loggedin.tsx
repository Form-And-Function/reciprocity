import { auth } from "../auth";
import ProfileEditor from "@/components/ProfileEditor";
import { SignOut } from "@/components/SignOut";
import UserTable from "@/components/UserTable";

export default async function LoggedIn() {
    const session = await auth();
    if (!session?.user || !session.user.email) {
        return null;
    }
    return (
        <div>
            <SignOut />
            <h2>Your profile</h2>
            <ProfileEditor
                // displayName="John Doe"
                // bio=""
                // age={20}
                // pictures={[]}
                // email={session.user.email}
                />
            <br />

            <br />
            <UserTable />

        </div>
    )
    }