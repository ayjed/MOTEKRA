// Use only in optional visual Suspense boundaries. A root loading.tsx can
// stream essential server content into a hidden JS-dependent swap fragment.
export default function LoadingState() {
  return <div className="container status-page" role="status"><p className="eyebrow">MOTEKRA</p><p>Loading the next perspective…</p><div className="skeleton" aria-hidden="true" /></div>;
}
