import { NavLink } from "react-router-dom";
import { useLogoutForm } from "../features/auth/hooks/useAuthForm";

const userMenuItems = [
    { label: "Trang chủ", path: "/dashboard" },
    { label: "Thiết bị", path: "/devices" },
    { label: "Cấu hình ngưỡng", path: "/thresholds" },
    { label: "Thống kê", path: "/statistics" },
    { label: "Cảnh báo", path: "/alerts" },
    { label: "Tiện ích", path: "/utilities" }
];

function getMenuItemClass(isActive: boolean) {
    const commonClass = "min-w-fit rounded-2xl px-4 py-3";
    const selectedClass = "bg-emerald-500 text-white";
    const normalClass = "bg-slate-50 text-slate-600";

    return isActive ? commonClass + " " + selectedClass : commonClass + " " + normalClass;
}

type UserLayoutProps = {
    children: React.ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
    const { handleLogout } = useLogoutForm();

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#f5fff9_0%,_#ecfdf5_42%,_#f8fafc_100%)] text-slate-900">
            <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
                <aside className="rounded-[28px] border border-emerald-100 bg-white/85 p-5 shadow-xl shadow-emerald-100/60 backdrop-blur lg:w-72">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white">
                            IE
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                                User Portal
                            </p>
                            <h1 className="mt-1 text-xl font-bold text-slate-900">
                                IoT Energy
                            </h1>
                        </div>
                    </div>

                    <nav className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                        {userMenuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => getMenuItemClass(isActive)}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-semibold">Dashboard</p>
                        <p className="mt-2 leading-6">
                            Theo dõi dữ liệu thiết bị, nhật ký năng lượng và ngưỡng tiêu thụ trong hệ thống.
                        </p>
                    </div> */}

                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
