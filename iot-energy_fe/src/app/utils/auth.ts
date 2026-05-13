export function normalizeRole(role: string | null | undefined): string {
    return (role ?? "").trim().toLowerCase();
}

export function isAdminRole(role: string | null | undefined): boolean {
    return normalizeRole(role) === "admin";
}

export function getDefaultRouteByRole(role: string | null | undefined): string {
    return isAdminRole(role) ? "/admin" : "/";
}
