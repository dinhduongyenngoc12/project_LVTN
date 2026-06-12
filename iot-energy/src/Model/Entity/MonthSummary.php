<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

class MonthSummary extends Entity
{
    protected array $_accessible = [
        'device_id' => true,
        'year' => true,
        'month' => true,
        'total_energy' => true,
        'estimated_cost' => true,
        'note' => true,
        'device' => true,
    ];
}
