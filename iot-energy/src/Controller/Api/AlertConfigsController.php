<?php
declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;

class AlertConfigsController extends AppController
{
    public function index(): void
    {
        $this->request->allowMethod(['get']);

        $userId = $this->getAuthenticatedUserId();

        $query = $this->AlertConfigs->find()
            ->contain(['Devices'])
            ->orderBy(['AlertConfigs.id' => 'DESC']);

        if ($userId !== null) {
            $query->innerJoinWith('Devices', function ($q) use ($userId) {
                return $q->where(['Devices.user_id' => $userId]);
            });
        }

        $alertConfigs = $query->all()->toList();

        $this->renderJson([
            'status' => 'success',
            'alertConfigs' => $alertConfigs,
            'thresholds' => $alertConfigs,
        ]);
    }

    public function view($id = null): void
    {
        $this->request->allowMethod(['get']);

        $userId = $this->getAuthenticatedUserId();
        $query = $this->AlertConfigs->find()
            ->contain(['Devices'])
            ->where(['AlertConfigs.id' => $id]);

        if ($userId !== null) {
            $query->innerJoinWith('Devices', function ($q) use ($userId) {
                return $q->where(['Devices.user_id' => $userId]);
            });
        }

        $alertConfig = $query->first();
        if (!$alertConfig) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Khong tim thay cau hinh canh bao.',
            ], 404);

            return;
        }

        $this->renderJson([
            'status' => 'success',
            'alertConfig' => $alertConfig,
            'threshold' => $alertConfig,
        ]);
    }

    public function edit($id = null): void
    {
        $this->request->allowMethod(['patch', 'put']);

        $userId = $this->getAuthenticatedUserId();
        $query = $this->AlertConfigs->find()
            ->contain(['Devices'])
            ->where(['AlertConfigs.id' => $id]);

        if ($userId !== null) {
            $query->innerJoinWith('Devices', function ($q) use ($userId) {
                return $q->where(['Devices.user_id' => $userId]);
            });
        }

        $alertConfig = $query->first();
        if (!$alertConfig) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Khong tim thay cau hinh canh bao.',
            ], 404);

            return;
        }

        $alertConfig = $this->AlertConfigs->patchEntity(
            $alertConfig,
            $this->normalizeAlertConfigPayload($this->request->getData())
        );

        if ($this->AlertConfigs->save($alertConfig)) {
            $this->renderJson([
                'status' => 'success',
                'message' => 'Cap nhat cau hinh canh bao thanh cong.',
                'alertConfig' => $alertConfig,
                'threshold' => $alertConfig,
            ]);

            return;
        }

        $this->renderJson([
            'status' => 'error',
            'message' => 'Khong the cap nhat cau hinh canh bao.',
            'errors' => $alertConfig->getErrors(),
        ], 422);
    }

    private function normalizeAlertConfigPayload(array $data): array
    {
        if (array_key_exists('max_power', $data)) {
            $data['power_threshold'] = $data['power_threshold'] ?? $data['max_power'];
            $data['default_threshold'] = $data['default_threshold'] ?? $data['max_power'];
            unset($data['max_power']);
        }

        return $data;
    }
}
