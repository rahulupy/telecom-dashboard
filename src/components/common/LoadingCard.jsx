import Card from "./Card";

export default function LoadingCard({ title }) {
  return (
    <Card title={title}>
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
      </div>
    </Card>
  );
}