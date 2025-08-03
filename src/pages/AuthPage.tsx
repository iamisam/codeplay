import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Welcome to CodePlay
        </h1>
        <p className="text-center text-slate-400 mb-8">
          {isLoginView
            ? "Sign in to continue"
            : "Create an account to get started"}
        </p>

        {isLoginView ? <LoginForm /> : <SignupForm />}

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            {isLoginView
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
