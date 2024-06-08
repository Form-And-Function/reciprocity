import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { SupabaseAdapter } from "@auth/supabase-adapter"
import Resend from "next-auth/providers/resend"

console.log(process.env.AUTH_RESEND_API_KEY);

 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Resend({
    from: "match@reciprocal.love",
    apiKey: process.env.AUTH_RESEND_API_KEY ?? "",
  })],
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL ??  "",
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  }),
})