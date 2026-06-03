export function AlertBanner({
  count,
  onClose,
}: {
  count: number;
  onClose: () => void;
}) {
  if (count <= 0) return null;

  return (
    <div className="mb-5 flex items-center justify-between rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-800">
      <div>
        <p className="font-bold">Cảnh báo vượt ngưỡng</p>
        <p className="text-sm">Có {count} thiết bị đang vượt ngưỡng công suất.</p>
      </div>
      <button onClick={onClose} className="rounded-full px-3 py-1 hover:bg-rose-100">
        ✕
      </button>
    </div>
  );
}