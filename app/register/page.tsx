import { Suspense } from "react";
import AuthForm from "@/components/forms/AuthForm";

export default function RegisterPage() {
  return (
    <div className="container-page py-16">
      <Suspense
        fallback={
          <div className="card mx-auto w-full max-w-md p-7 text-slate-400">
            Loading registration...
          </div>
        }
      >
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}