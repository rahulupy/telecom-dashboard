import Card from "./Card";
import { AlertTriangle } from "lucide-react";

export default function ErrorCard({ title, message }) {
  return (
    <Card title={title}>
      <div className="flex items-center gap-3 text-red-400">
        <AlertTriangle size={22} />
        <span>{message}</span>
      </div>
    </Card>
  );
}