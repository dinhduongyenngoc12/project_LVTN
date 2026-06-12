<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

class HourSummariesTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('hour_summaries');
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
        $validator->dateTime('hour_at')->requirePresence('hour_at', 'create')->notEmptyDateTime('hour_at');
        $validator->numeric('total_energy')->allowEmptyString('total_energy');
        $validator->numeric('avg_power')->allowEmptyString('avg_power');
        $validator->numeric('max_power')->allowEmptyString('max_power');

        return $validator;
    }

    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->existsIn(['device_id'], 'Devices'), ['errorField' => 'device_id']);
        $rules->add($rules->isUnique(['device_id', 'hour_at']), ['errorField' => 'hour_at']);

        return $rules;
    }
}
