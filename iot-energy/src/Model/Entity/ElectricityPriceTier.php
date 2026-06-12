<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

class ElectricityPriceTier extends Entity
{
    protected array $_accessible = [
        'tier_order' => true,
        'from_kwh' => true,
        'to_kwh' => true,
        'price_kwh' => true,
        'effective_from' => true,
    ];
}
