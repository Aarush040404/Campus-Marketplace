import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function StatusMessage({ error, success }) {
  const message = error || success;
  if (!message) return null;
  const text = typeof message === "string" ? message : message.message || String(message);
  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${
      error ? "border-red-900 bg-red-950/30 text-red-200" : "border-emerald-900 bg-emerald-950/30 text-emerald-200"
    }`}>
      {error ? <AlertCircle size={18} className="shrink-0" /> : <CheckCircle2 size={18} className="shrink-0" />}
      <div>
        <p>{text}</p>
        {error?.details?.length > 0 && <ul className="mt-1 list-disc list-inside">{error.details.map((item) => <li key={item}>{item}</li>)}</ul>}
      </div>
    </div>
  );
}
