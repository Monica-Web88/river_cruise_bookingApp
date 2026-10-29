'use client';
import { useEffect } from 'react';
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Hook point for an error-tracking service (Sentry, Datadog RUM, …).
    console.error(error);
  }, [error]);
  return (
    <div className="container-page py-24 text-center" role="alert">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mx-auto mt-3 max-w-md text-bark-600">
        An unexpected error occurred. You can try again, and if it keeps happening please come back
        a little later.
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
