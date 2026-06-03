<?php
declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;
use Cake\Event\EventInterface;

/**
 * Energy Logs API Controller
 *
 * @property \App\Model\Table\EnergyLogsTable $EnergyLogs
 */
class EnergyLogsController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();

        $this->Authentication->addUnauthenticatedActions(['add']);
    }

    public function beforeFilter(EventInterface $event): void
    {
        parent::beforeFilter($event);

        $this->Authentication->addUnauthenticatedActions(['add']);
    }

    /**
     * @return void
     */
    public function index(): void
    {
        $this->request->allowMethod(['get']);

        $userId = $this->getAuthenticatedUserId();
        $deviceId = $this->request->getQuery('device_id');
        $from = trim((string)$this->request->getQuery('from', ''));
        $to = trim((string)$this->request->getQuery('to', ''));

        $query = $this->EnergyLogs->find()
            ->contain(['Devices'])             //load
            ->orderBy([
                'EnergyLogs.created_at' => 'DESC',
                'EnergyLogs.id' => 'DESC',
            ]);

        if ($userId !== null) {
            $query->innerJoinWith('Devices', function ($q) use ($userId) {
                return $q->where(['Devices.user_id' => $userId]);
            });
        }

        if (is_numeric($deviceId)) {
            $query->where(['EnergyLogs.device_id' => (int)$deviceId]);
        }

        if ($from !== '') {
            $query->where([
                'EnergyLogs.created_at >=' => $this->normalizeDateBoundary($from, false),         //chuan hoa ngay bat dau 00:00:00
            ]);
        }

        if ($to !== '') {
            $query->where([
                'EnergyLogs.created_at <=' => $this->normalizeDateBoundary($to, true)             //chuan hoa ngay bat dau 23:59:59
            ]);
        }

        $energyLogs = $query->all()->toList();

        $this->renderJson([
            'status' => 'success',
            'filters' => [
                'device_id' => is_numeric($deviceId) ? (int)$deviceId : null,
                'from' => $from !== '' ? $from : null,
                'to' => $to !== '' ? $to : null,
            ],
            'energyLogs' => $energyLogs,
        ]);
    }

    /**
     * @param string|null $id Energy log id.
     * @return void
     */
    public function view($id = null): void
    {
        $energyLog = $this->EnergyLogs->get($id, contain: ['Devices']);

        $this->renderJson([
            'status' => 'success',
            'energyLog' => $energyLog,
        ]);
    }

    /**
     * @return void
     */
    public function add(): void
    {
        $this->request->allowMethod(['post']);

        $apiKey = trim($this->request->getHeaderLine('X-Device-Key'));
        if ($apiKey === '') {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Thiếu API key',
            ], 401);

            return;
        }

        $devicesTable = $this->fetchTable('Devices');
        $device = $devicesTable->find()
            ->where(['api_key' => $apiKey])
            ->first();

        if (!$device) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'API key không hợp lệ',
            ], 401);

            return;
        }

        $data = $this->request->getData();
        $voltage = $this->toNullableFloat($data['voltage'] ?? null);
        $current = $this->toNullableFloat($data['current'] ?? null);
        $power = $this->toNullableFloat($data['power'] ?? null);
        $energy = $this->toNullableFloat($data['energy'] ?? null);
        $now = date('Y-m-d H:i:s');

        $isValid = $voltage !== null
            && $voltage > 80
            && $power !== null
            && $power >= 0;

        $log = $this->EnergyLogs->newEntity([
            'device_id' => $device->id,
            'power' => $power,
            'voltage' => $voltage,
            'current' => $current,
            'energy' => $energy,
            'is_valid' => $isValid ? 1 : 0,
            'created_at' => $now,
        ]);
        
        if (!$this->EnergyLogs->save($log)) {
            $this->renderJson([
                'status' => 'error',
                'message' => 'Không lưu được dữ liệu',
                'errors' => $log->getErrors(),
            ], 500);

            return;
        }

        $device = $devicesTable->patchEntity($device, [
            'is_online' => 1,
            'last_seen_at' => $now,
        ]);
        $devicesTable->save($device);

        $this->renderJson([
            'status' => 'success',
            'message' => 'Đã nhận dữ liệu từ thiết bị',
            'relay_status' => 1,
            'data' => $log,
        ]);
        
    }

    /**
     * @param string|null $id Energy log id.
     * @return void
     */
    public function edit($id = null): void
    {
        $this->request->allowMethod(['patch', 'post', 'put']);

        $energyLog = $this->EnergyLogs->get($id);
        $energyLog = $this->EnergyLogs->patchEntity($energyLog, $this->request->getData());

        if ($this->EnergyLogs->save($energyLog)) {
            $this->renderJson([
                'status' => 'success',
                'message' => 'Nhật ký năng lượng đã được cập nhật thành công.',
                'energyLog' => $energyLog,
            ]);

            return;
        }

        $this->renderJson([
            'status' => 'error',
            'message' => 'Không thể cập nhật nhật ký năng lượng',
            'errors' => $energyLog->getErrors(),
        ], 422);
    }

    /**
     * @param string|null $id Energy log id.
     * @return void
     */
    public function delete($id = null): void
    {
        $this->request->allowMethod(['post', 'delete']);

        $energyLog = $this->EnergyLogs->get($id);
        if ($this->EnergyLogs->delete($energyLog)) {
            $this->renderJson([
                'status' => 'success',
                'message' => 'Nhật ký năng lượng đã được xoá thành công.',
            ]);

            return;
        }

        $this->renderJson([
            'status' => 'error',
            'message' => 'Không thể xoá nhật ký năng lượng.',
        ], 422);
    }

    private function normalizeDateBoundary(string $value, bool $isEndOfDay): string
    {
        if (strlen($value) === 10) {
            return $value . ($isEndOfDay ? ' 23:59:59' : ' 00:00:00');
        }

        return $value;
    }

    private function toNullableFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return is_numeric($value) ? (float)$value : null;
    }
}
