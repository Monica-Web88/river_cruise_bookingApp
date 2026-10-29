import Link from 'next/link';
import RiverScene from '@/components/RiverScene';
export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <div className="w-full max-w-md overflow-hidden rounded-4xl border border-sand-200 shadow-soft">
        <RiverScene uid="404" theme="mist" className="aspect-[16/9] w-full" />
      </div>
      <p className="eyebrow mt-10">Error 404</p>
      <h1 className="mt-2 text-4xl font-semibold">We’ve drifted off course</h1>
      <p className="mt-3 max-w-md text-bark-600">
        The page you’re looking for doesn’t exist or has moved downstream.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/cruises" className="btn btn-secondary">
          Browse cruises
        </Link>
      </div>
    </div>
  );
}
