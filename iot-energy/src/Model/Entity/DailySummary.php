<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

class DailySummary extends Entity
{
    protected array $_accessible = [
        'device_id' => true,
        'date_at' => true,
        'total_energy' => true,
        'avg_power' => true,
        'max_power' => true,
        'alert_count' => true,
        'device' => true,
    ];
}
