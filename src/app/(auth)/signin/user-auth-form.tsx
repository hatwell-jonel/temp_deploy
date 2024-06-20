"use client";

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "../_actions";

export function UserAuthForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <form action={dispatch} className="grid gap-4">
      <Input
        placeholder={"example@gmail.com"}
        name="email"
        className="h-10 border-none bg-gray-200"
        autoComplete="username"
      />
      <PasswordInput
        className="h-10 border-none bg-gray-200"
        name="password"
        autoComplete="password"
      />
      <LoginButton />
      {state && <p className="text-destructive">{state}</p>}
    </form>
  );
}

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary">
      {pending ? "Logging In" : "Submit"}
    </Button>
  );
}
