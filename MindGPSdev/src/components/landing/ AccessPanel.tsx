import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { useAuth } from "@/context/AuthContext";
import type { AuthMode } from "@/types/types";

type AccessPanelProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "That email is already being used. Try logging in instead.";
    case "auth/invalid-credential":
      return "That email or password does not match our records.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/network-request-failed":
      return "Network issue. Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts right now. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AccessPanel({ mode, onModeChange }: AccessPanelProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === "signup";
  const heading = isSignUp ? "Create your account" : "Welcome back";
  const description = isSignUp
    ? "Make a calm space that you can come back to anytime."
    : "Enter the sanctuary to continue your journey.";
  const submitLabel = isSubmitting
    ? isSignUp
      ? "Creating..."
      : "Signing in..."
    : isSignUp
      ? "Create Account"
      : "Continue";

  useEffect(() => {
    setErrorMessage("");
  }, [mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const trimmedEmail = email.trim();

      if (isSignUp) {
        await signUp(trimmedEmail, password);
      } else {
        await signIn(trimmedEmail, password);
      }

      setPassword("");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2rem] bg-white/55 p-8 shadow-[0_18px_50px_rgba(115,90,200,0.12)] backdrop-blur-xl">
      <div className="space-y-2">
        <h2 className="text-5xl font-semibold tracking-tight text-[#2f1d69]">
          {heading}
        </h2>
        <p className="text-lg leading-relaxed text-[#6a6385]">
          {description}
        </p>
      </div>

      <div className="mt-8 inline-flex rounded-full bg-white/70 p-1 shadow-sm">
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            !isSignUp
              ? "bg-[#6f4fc3] text-white shadow-[0_10px_25px_rgba(111,79,195,0.22)]"
              : "text-[#6a6385] hover:text-[#2f1d69]"
          }`}
          onClick={() => onModeChange("signin")}
          type="button"
        >
          Log In
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            isSignUp
              ? "bg-[#6f4fc3] text-white shadow-[0_10px_25px_rgba(111,79,195,0.22)]"
              : "text-[#6a6385] hover:text-[#2f1d69]"
          }`}
          onClick={() => onModeChange("signup")}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a93b3]"
            htmlFor="auth-email"
          >
            Email Address
          </label>
          <input
            autoComplete="email"
            className="h-14 w-full rounded-full border border-white/40 bg-white/80 px-6 text-base text-[#2f1d69] placeholder:text-[#b8b2cc] outline-none transition focus:border-[#b7a7f5] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            id="auth-email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="name@email.com"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a93b3]"
            htmlFor="auth-password"
          >
            Password
          </label>
          <input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="h-14 w-full rounded-full border border-white/40 bg-white/80 px-6 text-base text-[#2f1d69] placeholder:text-[#b8b2cc] outline-none transition focus:border-[#b7a7f5] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            id="auth-password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="••••••••"
            value={password}
          />
        </div>

        <div className="flex flex-col gap-3 text-sm text-[#6a6385] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isSignUp
              ? "Use at least 6 characters for your password."
              : "Use the same email and password you signed up with."}
          </p>

          <button
            className="font-medium text-[#6a4fd8] hover:opacity-80"
            onClick={() => onModeChange(isSignUp ? "signin" : "signup")}
            type="button"
          >
            {isSignUp ? "Already have an account?" : "Need an account?"}
          </button>
        </div>

        {errorMessage && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          className="h-14 w-full rounded-full bg-[#6f4fc3] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(111,79,195,0.22)] transition hover:bg-[#6545b9] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting || !email.trim() || !password}
          type="submit"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
