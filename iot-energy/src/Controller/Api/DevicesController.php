<?php
declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;
use App\Service\DevicesService;

class DevicesController extends AppController
{
    protected DevicesService $devicesService;

    public function initialize(): void
    {
        parent::initialize();
        $this->devicesService = new DevicesService();
    }

    public function index(): void
    {
        $this->request->allowMethod(['get']);

        $keyword = trim((string)$this->request->getQuery('keyword', ''));
        $userId = $this->getAuthenticatedUserId();

        $devices = $this->devicesService
            ->getList($keyword, $userId)
            ->orderBy(['Devices.id' => 'DESC'])
            ->all()
            ->toList();

        $this->renderJson([
            'status' => 'success',
            'message' => 'Lấy danh sách thiết bị thành công',
            'keyword' => $keyword,
            'devices' => $devices,
            'pagingData' => [],
        ]);
    }

    public function view($id = null): void
    {
        $this->request->allowMethod(['get']);

        $device = $this->devicesService->getById($id);

        $this->renderJson([
            'status' => 'success',
            'device' => $device,
        ]);
    }

    public function add(): void
    {
        $this->request->allowMethod(['post']);

        $userId = $this->getAuthenticatedUserId();

        if ($userId === null) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Người dùng chưa đăng nhập',
            ], 401);

            return;
        }

        $data = $this->request->getData();

        $data = [
            'user_id' => $userId,
            'name' => trim((string)($data['name'] ?? '')),
            'device_type' => trim((string)($data['device_type'] ?? '')),
            'rated_power' => $data['rated_power'] ?? null,
        ];

        $result = $this->devicesService->create($data);

        if (!$result['saved']) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Không thể tạo thiết bị',
                'errors' => $result['device']->getErrors(),
            ], 422);

            return;
        }

        $this->renderJson([
            'status' => 'success',
            'message' => 'Tạo thiết bị thành công. Thiết bị đang chờ quản trị viên kích hoạt.',
            'device' => $result['device'],
        ], 201);
    }

    public function edit($id = null): void
    {
        $this->request->allowMethod(['patch', 'post', 'put']);

        $data = $this->request->getData();

        $data = [
            'name' => trim((string)($data['name'] ?? '')),
            'device_type' => trim((string)($data['device_type'] ?? '')),
            'rated_power' => $data['rated_power'] ?? null,
        ];

        $result = $this->devicesService->update($id, $data);

        if (!$result['saved']) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Không thể cập nhật thiết bị',
                'errors' => $result['device']->getErrors(),
            ], 422);

            return;
        }

        $this->renderJson([
            'status' => 'success',
            'message' => 'Cập nhật thiết bị thành công',
            'device' => $result['device'],
        ]);
    }

    public function delete($id = null): void
    {
        $this->request->allowMethod(['delete', 'post']);

        if (!$this->devicesService->remove($id)) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Không thể xóa thiết bị',
            ], 422);

            return;
        }

        $this->renderJson([
            'status' => 'success',
            'message' => 'Xóa thiết bị thành công',
        ]);
    }

   public function updateStatus($id = null): void
    {
        $this->request->allowMethod(['patch']);

        if (!$this->requireAdmin()) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Bạn không có quyền cập nhật trạng thái thiết bị',
            ], 403);

            return;
        }

        $status = trim((string)$this->request->getData('status'));

        $result = $this->devicesService->updateStatus($id, $status);

        if (!$result['saved']) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Không thể cập nhật trạng thái thiết bị',
                'errors' => $result['device']->getErrors(),
            ], 422);

            return;
        }

        $this->renderJson([
            'status' => 'success',
            'message' => 'Cập nhật trạng thái thiết bị thành công',
            'device' => $result['device'],
        ]);
    }
}