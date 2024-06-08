
import { signIn } from "../auth"

export function SignIn() {
    return (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signIn("google")
                }}
            >
                <button type="submit">Sign in with Google</button>
            </form>

            <form
                action={async (formData) => {
                    "use server"
                    await signIn("resend", formData)
                }}
            >
                <input type="text" name="email" placeholder="Email" />
                <button type="submit">Sign in with a link sent to your email</button>
            </form>
        </div>
    )
} 