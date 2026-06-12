<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

class DailySummariesTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('daily_summaries');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');

        $this->belongsTo('Devices', [
            'foreignKey' => 'device_id',
            'joinType' => 'INNER',
        ]);
    }

    public function validationDefault(Validator $validator): Validator
    {
        $validator->integer('device_id')->requirePresence('device_id', 'create')->notEmptyString('device_id');
        $validator->date('date_at')->requirePresence('date_at', 'create')->notEmptyDate('date_at');
        $validator->numeric('total_energy')->allowEmptyString('total_energy');
        $validator->numeric('avg_power')->allowEmptyString('avg_power');
        $validator->numeric('max_power')->allowEmptyString('max_power');
        $validator->integer('alert_count')->notEmptyString('alert_count');

        return $validator;
    }

    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->existsIn(['device_id'], 'Devices'), ['errorField' => 'device_id']);
        $rules->add($rules->isUnique(['device_id', 'date_at']), ['errorField' => 'date_at']);

        return $rules;
    }
}
