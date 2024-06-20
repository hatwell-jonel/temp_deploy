import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Metadata } from "next";
import { UserAuthForm } from "./user-auth-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <section className="container max-w-lg">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">CaPEx Integrated System</CardTitle>
          <CardDescription>Sign in below to proceed.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <form className="flex gap-4">
            <Button
              variant={"outline"}
              formAction={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Icons.google className="size-5 mr-2" />
              Google
            </Button>
          </form> */}
          <UserAuthForm />
        </CardContent>
      </Card>
    </section>
  );
}
