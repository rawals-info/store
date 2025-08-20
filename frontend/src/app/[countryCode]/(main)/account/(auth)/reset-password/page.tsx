import ResetPasswordTemplate from "@modules/account/templates/reset-password-template";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-luxury-ivory/50 animate-pulse rounded" />}> 
      <ResetPasswordTemplate />
    </Suspense>
  );
}