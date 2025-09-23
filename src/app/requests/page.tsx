import { Suspense } from "react";
import RequestForm from "./request-form";

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <RequestForm />
    </Suspense>
  );
}
