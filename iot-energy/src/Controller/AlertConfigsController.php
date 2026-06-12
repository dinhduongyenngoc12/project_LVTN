<?php
declare(strict_types=1);

namespace App\Controller;

class AlertConfigsController extends AppController
{
    public function index(): void
    {
        $alertConfigs = $this->paginate(
            $this->AlertConfigs->find()->contain(['Devices']),
        );

        $this->renderJson([
            'status' => 'success',
            'alertConfigs' => $alertConfigs,
            'thresholds' => $alertConfigs,
        ]);
    }

    public function view($id = null): void
    {
        $alertConfig = $this->AlertConfigs->get($id, contain: ['Devices']);

        $this->renderJson([
            'status' => 'success',
            'alertConfig' => $alertConfig,
            'threshold' => $alertConfig,
        ]);
    }

    public function add(): void
    {
        $this->request->allowMethod(['post']);

        $alertConfig = $this->AlertConfigs->newEmptyEntity();
        $alertConfig = $this->AlertConfigs->patchEntity(
            $alertConfig,
            $this->normalizeAlertConfigPayload($this->request->getData())
        );

        if ($this->AlertConfigs->save($alertConfig)) {
            $this->renderJson([
                'status' => 'success',
                'message' => 'Tao cau hinh canh bao thanh cong.',
                'alertConfig' => $alertConfig,
                'threshold' => $alertConfig,
            ], 201);

            return;
        }

        $this->renderJson([
            'status' => 'error',
            'message' => 'Khong the tao cau hinh canh bao.',
            'errors' => $alertConfig->getErrors(),
        ], 422);
    }

    public function edit($id = null): void
    {
        $this->request->allowMethod(['patch', 'post', 'put']);

        $alertConfig = $this->AlertConfigs->get($id);
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

    public function delete($id = null): void
    {
        $this->request->allowMethod(['post', 'delete']);

        $alertConfig = $this->AlertConfigs->get($id);
        if ($this->AlertConfigs->delete($alertConfig)) {
            $this->renderJson([
                'status' => 'success',
                'message' => 'Da xoa cau hinh canh bao.',
            ]);

            return;
        }

        $this->renderJson([
            'status' => 'error',
            'message' => 'Khong the xoa cau hinh canh bao.',
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
