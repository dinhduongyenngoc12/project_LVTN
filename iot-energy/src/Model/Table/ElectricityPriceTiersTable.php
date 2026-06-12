<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

class ElectricityPriceTiersTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('electricity_price_tiers');
        $this->setDisplayField('tier_order');
        $this->setPrimaryKey('id');
    }

    public function validationDefault(Validator $validator): Validator
    {
        $validator->integer('tier_order')->requirePresence('tier_order', 'create')->notEmptyString('tier_order');
        $validator->numeric('from_kwh')->requirePresence('from_kwh', 'create')->notEmptyString('from_kwh');
        $validator->numeric('to_kwh')->allowEmptyString('to_kwh');
        $validator->numeric('price_kwh')->requirePresence('price_kwh', 'create')->notEmptyString('price_kwh');
        $validator->date('effective_from')->requirePresence('effective_from', 'create')->notEmptyDate('effective_from');

        return $validator;
    }

    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->isUnique(['effective_from', 'tier_order']), ['errorField' => 'tier_order']);

        return $rules;
    }
}
