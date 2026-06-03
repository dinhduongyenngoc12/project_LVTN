import UserLayout from "../../../layouts/UserLayout";
import { useAuthLoginStore } from "../../../app/store/useAuthStore";

export default function ProfilePage() {
    const { username, email } = useAuthLoginStore();

    return (
        <UserLayout>
            <header className="rounded-[32px] border border-white/70 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-slate-900/10 sm:px-8">
                <p className="text-sm font-medium uppercase tracking-[0.26em] text-emerald-300">
                    Thông tin cá nhân
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                    Hồ sơ người dùng
                </h2>
            </header>

            <section className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/5 backdrop-blur">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Tên người dùng</p>
                        <p className="mt-2 text-lg font-bold text-slate-900">{username || "--"}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="mt-2 break-all text-lg font-bold text-slate-900">{email || "--"}</p>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
