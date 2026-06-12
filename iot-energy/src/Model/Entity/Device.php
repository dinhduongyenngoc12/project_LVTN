<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Device Entity
 *
 * @property int $id
 * @property int|null $user_id
 * @property string|null $name
 * @property string|null $device_type
 * @property float|null $rated_power
 * @property string|null $api_key
 * @property string $status
 * @property \Cake\I18n\DateTime|null $last_seen_at
 * @property \Cake\I18n\DateTime|null $activated_at
 * @property \Cake\I18n\DateTime|null $created_at
 * @property \Cake\I18n\DateTime|null $updated_at
 *
 * @property \App\Model\Entity\User $user
 * @property \App\Model\Entity\EnergyLog[] $energy_logs
 * @property \App\Model\Entity\AlertConfig $alert_config
 * @property \App\Model\Entity\HourSummary[] $hour_summaries
 * @property \App\Model\Entity\DailySummary[] $daily_summaries
 * @property \App\Model\Entity\MonthSummary[] $month_summaries
 */
class Device extends Entity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * @var array<string, bool>
     */
    protected array $_accessible = [
        'user_id' => true,
        'name' => true,
        'device_type' => true,
        'rated_power' => true,
        'api_key' => true,
        'status' => true,
        'last_seen_at' => true,
        'activated_at' => true,
        'created_at' => true,
        'updated_at' => true,

        'user' => true,
        'energy_logs' => true,
        'alert_config' => true,
        'hour_summaries' => true,
        'daily_summaries' => true,
        'month_summaries' => true,
    ];
}