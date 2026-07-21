export default function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl shadow-xl">

      {title && (
        <div className="border-b border-slate-700/50 px-6 py-4">
          <h3 className="text-white text-lg font-semibold">
            {title}
          </h3>
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

    </div>
  );
}