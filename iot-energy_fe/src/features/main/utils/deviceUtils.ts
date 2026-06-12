import type { DeviceStatus } from "../../../api/deviceApi";

// Danh sách loại thiết bị cố định để dùng trong form thêm/sửa.
export const DEVICE_TYPES = [
    "Tủ lạnh",
    "Máy lạnh",
    "Máy giặt",
    "Quạt điện",
    "Tivi",
    "Máy bơm nước",
    "Bình nóng lạnh",
    "Nồi cơm điện",
    "Lò vi sóng",
    "Nồi chiên không dầu",
    "Bếp điện",
    "Máy sấy tóc",
    "Bàn là điện",
    "Bóng đèn",
    "Lọc hồ cá",
    "Khác",
];

//Record dùng để khai báo object có key là DeviceStatus và value là string
//Mục đích: chuyển status từ backend sang nhãn tiếng Việt để hiển thị
export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
    pending: "Chờ kích hoạt",
    active: "Đang hoạt động",
    disabled: "Đã vô hiệu hóa",
};


export function getConnectionStatus(
    lastSeenAt?: string | null,
): "online" | "offline" {
    if (!lastSeenAt) {
        return "offline";
    }

    const lastSeenTime = new Date(lastSeenAt).getTime();     //chuyen thoi gian thanh timestamp (so mili giay ke tu 1/1/1970)

    if (!Number.isFinite(lastSeenTime)) {
        return "offline";
    }

    const diffMinutes = (Date.now() - lastSeenTime) / 1000 / 60;       //đổi mili s -> s -> phut: so phut chenh lech tu lan cuoi den bay gio

    return diffMinutes <= 2 ? "online" : "offline";
}

//format thoi gian
export function formatDeviceDateTime(value?: string | null): string {
    if (!value) {
        return "Chưa có dữ liệu";
    }

    const date = new Date(value);

    if (!Number.isFinite(date.getTime())) {
        return "Chưa có dữ liệu";
    }

    return date.toLocaleString("vi-VN");
}

//cong suat dinh muc user nhap
export function formatRatedPower(value?: number | null): string {
    if (value === null || value === undefined) {
        return "Chưa nhập";
    }

    return Number(value).toLocaleString("vi-VN") + " W";
}