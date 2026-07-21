import useLocalization from "../../hooks/useLocalization";

export default function Footer() {
  const { data } = useLocalization();

  return (
    <footer className="mt-8 border-t border-slate-800 py-4 text-sm text-slate-500">
      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <span>Telecom Tracker v1.0</span>

        <span>
          Backend: Mock Data
        </span>

        <span>
          Last Sync: {data?.lastUpdate}
        </span>
      </div>
    </footer>
  );
}