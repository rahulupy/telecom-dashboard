export default function Button({
  children,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-blue-600 px-4 py-2 text-white transition-all duration-300 hover:bg-blue-500"
    >
      {children}
    </button>
  );
}