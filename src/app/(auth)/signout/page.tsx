import type { Metadata } from "next";
import SignOutButtons from "./buttons";

export const metadata: Metadata = {
  title: "Sign out",
  description: "Sign out of your account",
};

export default function SignOutPage() {
  return (
    <section className="container grid max-w-xs items-center justify-center gap-8 pt-6 pb-8 md:py-8">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl md:text-3xl">Sign out</h1>
        <p className="text-sm sm:text-base">
          Are you sure you want to sign out?
        </p>
        <SignOutButtons />
      </div>
    </section>
  );
}
