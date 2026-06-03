import UserLayout from "../../../layouts/UserLayout";

export default function ThresholdPage() {
    return (
        <UserLayout>
            <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">
                    Cấu hình ngưỡng
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                    Thiết lập ngưỡng tiêu thụ điện
                </h2>
            </header>

            <section className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur">
                <p className="text-sm text-slate-600">
                    Khu vực cấu hình ngưỡng cảnh báo cho từng thiết bị.
                </p>
            </section>
        </UserLayout>
    );
}
