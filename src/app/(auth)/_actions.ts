"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const objectFormData = Object.fromEntries(formData);
  try {
    await signIn("credentials", objectFormData);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    if (error instanceof AuthError) return error.cause?.err?.message;
    return "Something went wrong.";
  }
}

export async function logOut() {
  try {
    await signOut();
  } catch (error) {
    if ((error as Error).message.includes("SignOut")) {
      return "SignOut";
    }
    throw error;
  }
}
