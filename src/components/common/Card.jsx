export default function Card({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg">

      {title && (
        <div className="border-b border-slate-700 px-5 py-4">
          <h3 className="text-white text-lg font-semibold">
            {title}
          </h3>
        </div>
      )}

      <div className="p-5">
        {children}
      </div>

    </div>
  );
}