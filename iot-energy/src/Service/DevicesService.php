<?php
declare(strict_types=1);

namespace App\Service;

use App\Model\Table\DevicesTable;
use Cake\I18n\FrozenTime;
use Cake\ORM\Query\SelectQuery;
use Cake\ORM\TableRegistry;

class DevicesService
{
    protected DevicesTable $Devices;

    public function __construct()
    {
        $devicesTable = TableRegistry::getTableLocator()->get('Devices');
        $this->Devices = $devicesTable;
    }

    public function getList(?string $keyword = null, ?int $userId = null): SelectQuery
    {
        $query = $this->Devices->find()
            ->join([
                'table' => 'users',
                'alias' => 'u',
                'type' => 'LEFT',
                'conditions' => 'u.id = Devices.user_id',
            ])
            ->select([
                'id' => 'Devices.id',
                'name' => 'Devices.name',
                'device_type' => 'Devices.device_type',
                'rated_power' => 'Devices.rated_power',
                'user_id' => 'Devices.user_id',
                'api_key' => 'Devices.api_key',
                'status' => 'Devices.status',
                'last_seen_at' => 'Devices.last_seen_at',
                'activated_at' => 'Devices.activated_at',
                'username' => 'u.username',
            ]);

        if ($userId !== null) {
            $query->where(['Devices.user_id' => $userId]);
        }

        if ($keyword !== null && $keyword !== '') {
            $query->where(['Devices.name LIKE' => '%' . trim($keyword) . '%']);
        }

        return $query;
    }

    public function getById($id = null)
    {
        return $this->Devices->get($id, contain: [
            'Users',
            'EnergyLogs',
            'AlertConfigs',
        ]);
    }

    public function create(array $data): array
    {
        $device = $this->Devices->newEmptyEntity();

        $data['api_key'] = $this->generateApiKey();
        $data['status'] = 'pending';
        $data['last_seen_at'] = null;
        $data['activated_at'] = null;

        $device = $this->Devices->patchEntity($device, $data);
        $saved = (bool)$this->Devices->save($device);

        return compact('device', 'saved');
    }

    public function update($id = null, array $data = []): array
    {
        $device = $this->Devices->get($id);

        unset(
            $data['api_key'],
            $data['status'],
            $data['last_seen_at'],
            $data['activated_at']
        );

        $device = $this->Devices->patchEntity($device, $data);
        $saved = (bool)$this->Devices->save($device);

        return compact('device', 'saved');
    }

    public function activate($id = null): array
    {
        $device = $this->Devices->get($id);

        $device = $this->Devices->patchEntity($device, [
            'status' => 'active',
            'activated_at' => FrozenTime::now(),
        ]);

        $saved = (bool)$this->Devices->save($device);

        return compact('device', 'saved');
    }

    public function disable($id = null): array
    {
        $device = $this->Devices->get($id);

        $device = $this->Devices->patchEntity($device, [
            'status' => 'disabled',
        ]);

        $saved = (bool)$this->Devices->save($device);

        return compact('device', 'saved');
    }

    public function updateStatus($id, string $status): array
    {
        $allowedStatuses = [
            'pending',
            'active',
            'disabled',
        ];

        $device = $this->Devices->get($id);

        if (!in_array($status, $allowedStatuses, true)) {
            $device->setError('status', [
                'invalid' => 'Trạng thái thiết bị không hợp lệ',
            ]);

            return [
                'device' => $device,
                'saved' => false,
            ];
        }

        $data = [
            'status' => $status,
        ];

        if ($status === 'active' && $device->activated_at === null) {
            $data['activated_at'] = FrozenTime::now();
        }

        $device = $this->Devices->patchEntity($device, $data);
        $saved = (bool)$this->Devices->save($device);

        return compact('device', 'saved');
    }
    public function remove($id = null): bool
    {
        $device = $this->Devices->get($id);

        return (bool)$this->Devices->delete($device);
    }

    //tao api_key
    private function generateApiKey(): string
    {
        do {
            $apiKey = 'IOT_' . strtoupper(bin2hex(random_bytes(8)));

            $exists = $this->Devices->exists([
                'api_key' => $apiKey,
            ]);
        } while ($exists);

        return $apiKey;
    }
}