export function LoadingBlock({ text = "Đang tải dữ liệu..." }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-100" />
      <p className="mt-4 text-sm text-slate-500">{text}</p>
    </div>
  );
}