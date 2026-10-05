import { Suspense } from "react";
import AuthForm from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <div className="container-page py-16">
      <Suspense
        fallback={
          <div className="card mx-auto w-full max-w-md p-7 text-slate-400">
            Loading login...
          </div>
        }
      >
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}