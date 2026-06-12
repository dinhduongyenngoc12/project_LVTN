import type { DeviceItem, DevicePayload } from "../../../api/deviceApi";
import { DEVICE_TYPES } from "../utils/deviceUtils";

type DeviceFormProps = {
    isOpen: boolean;
    editingDevice: DeviceItem | null;
    formData: DevicePayload;
    submitting: boolean;
    onClose: () => void;
    onChange: (data: DevicePayload) => void;
    onSubmit: () => void;
};
//hien thi modal, nhap ten, chon loai tb, nhap cong suat dinh muc, gui dl qua page = onSubmit
export default function DeviceFormModal({
    isOpen,
    editingDevice,
    formData,
    submitting,
    onClose,
    onChange,
    onSubmit,
}: DeviceFormProps) {
    //neu modal(cua so noi) chua mo thi khong render gi ra giao dien
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
            <form

                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
                className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            {editingDevice ? "Sửa thiết bị" : "Thêm thiết bị"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Nhập thông tin thiết bị điện cần theo dõi.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                    >
                        Đóng
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Tên thiết bị
                        </span>

                        <input
                            value={formData.name}
                            onChange={(event) =>
                                onChange({
                                    ...formData,
                                    name: event.target.value,
                                })
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                            placeholder="Ví dụ: Tủ lạnh Samsung"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Loại thiết bị
                        </span>

                        <select
                            value={formData.device_type}
                            onChange={(event) =>
                                onChange({
                                    ...formData,
                                    device_type: event.target.value,
                                })
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                        >
                            {DEVICE_TYPES.map((deviceType) => (
                                <option key={deviceType} value={deviceType}>
                                    {deviceType}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Công suất định mức
                        </span>

                        <input
                            type="number"
                            min="0"
                            value={formData.rated_power ?? ""}
                            onChange={(event) =>
                                onChange({
                                    ...formData,
                                    rated_power:
                                        event.target.value === ""
                                            ? null
                                            : Number(event.target.value),
                                })
                            }
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
                            placeholder="Ví dụ: 77"
                        />
                    </label>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Đang lưu..." : "Lưu thiết bị"}
                    </button>
                </div>
            </form>
        </div>
    );
}