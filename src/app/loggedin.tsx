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
        <div className="instructions">
            <SignOut />

            <p>
                Welcome to reciprocal.love! Please fill out your profile below.

                <br /> Write whatever you want. But please follow our community principles:
            </p>

            <br />
            <ul>
                <li>Be kind and respectful</li>
                <li>Be honest</li>
                <li>Try to make the platform better for everyone</li>
            </ul>

            <br />
            <p>
                Not sure what to write? Here are some ideas:
            </p>

            
            <ul>
                <li>What are you looking for?</li>
                <li>What are you like?</li>
                <li>How often are you on here? Should people still ask you out if you did not check them?</li>
                <li>Get a friend to write a blurb on yourself.</li>
            </ul>
            <p>
                But you could also put a poem, links to your social media, or a tirade on why en passant should be banned in chess. Everything is up to you!
            </p>

            <br />
            <h2>Your profile</h2>

            <br />

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