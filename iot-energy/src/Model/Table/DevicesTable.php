<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Devices Model
 *
 * @property \App\Model\Table\UsersTable&\Cake\ORM\Association\BelongsTo $Users
 * @property \App\Model\Table\EnergyLogsTable&\Cake\ORM\Association\HasMany $EnergyLogs
 * @property \App\Model\Table\AlertConfigsTable&\Cake\ORM\Association\HasOne $AlertConfigs
 * @property \App\Model\Table\HourSummariesTable&\Cake\ORM\Association\HasMany $HourSummaries
 * @property \App\Model\Table\DailySummariesTable&\Cake\ORM\Association\HasMany $DailySummaries
 * @property \App\Model\Table\MonthSummariesTable&\Cake\ORM\Association\HasMany $MonthSummaries
 *
 * @method \App\Model\Entity\Device newEmptyEntity()
 * @method \App\Model\Entity\Device newEntity(array $data, array $options = [])
 * @method array<\App\Model\Entity\Device> newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Device get(mixed $primaryKey, array|string $finder = 'all', \Psr\SimpleCache\CacheInterface|string|null $cache = null, \Closure|string|null $cacheKey = null, mixed ...$args)
 * @method \App\Model\Entity\Device findOrCreate($search, ?callable $callback = null, array $options = [])
 * @method \App\Model\Entity\Device patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method array<\App\Model\Entity\Device> patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Device|false save(\Cake\Datasource\EntityInterface $entity, array $options = [])
 * @method \App\Model\Entity\Device saveOrFail(\Cake\Datasource\EntityInterface $entity, array $options = [])
 * @method iterable<\App\Model\Entity\Device>|\Cake\Datasource\ResultSetInterface<\App\Model\Entity\Device>|false saveMany(iterable $entities, array $options = [])
 * @method iterable<\App\Model\Entity\Device>|\Cake\Datasource\ResultSetInterface<\App\Model\Entity\Device> saveManyOrFail(iterable $entities, array $options = [])
 * @method iterable<\App\Model\Entity\Device>|\Cake\Datasource\ResultSetInterface<\App\Model\Entity\Device>|false deleteMany(iterable $entities, array $options = [])
 * @method iterable<\App\Model\Entity\Device>|\Cake\Datasource\ResultSetInterface<\App\Model\Entity\Device> deleteManyOrFail(iterable $entities, array $options = [])
 */
class DevicesTable extends Table
{
    /**
     * Initialize method
     *
     * @param array<string, mixed> $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('devices');
        $this->setDisplayField('name');
        $this->setPrimaryKey('id');

        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
        ]);
        $this->hasMany('EnergyLogs', [
            'foreignKey' => 'device_id',
        ]);
        $this->hasOne('AlertConfigs', [
            'foreignKey' => 'device_id',
        ]);
        $this->hasMany('HourSummaries', [
            'foreignKey' => 'device_id',
        ]);
        $this->hasMany('DailySummaries', [
            'foreignKey' => 'device_id',
        ]);
        $this->hasMany('MonthSummaries', [
            'foreignKey' => 'device_id',
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->integer('user_id')
            ->notEmptyString('user_id');

        $validator
            ->scalar('name')
            ->maxLength('name', 100)
            ->requirePresence('name', 'create')
            ->notEmptyString('name');

        $validator
            ->scalar('device_type')
            ->maxLength('device_type', 50)
            ->requirePresence('device_type', 'create')
            ->notEmptyString('device_type');

        $validator
            ->numeric('rated_power')
            ->greaterThanOrEqual('rated_power', 0)
            ->allowEmptyString('rated_power');

        $validator
            ->scalar('api_key')
            ->maxLength('api_key', 191)
            ->allowEmptyString('api_key');

        $validator
            ->scalar('status')
            ->inList('status', ['pending', 'active', 'disabled'])
            ->allowEmptyString('status');

        $validator
            ->dateTime('last_seen_at')
            ->allowEmptyDateTime('last_seen_at');

        $validator
            ->dateTime('activated_at')
            ->allowEmptyDateTime('activated_at');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add(
            $rules->existsIn(['user_id'], 'Users'),
            ['errorField' => 'user_id']
        );

        $rules->add(
            $rules->isUnique(['api_key'], ['allowMultipleNulls' => true]),
            ['errorField' => 'api_key']
        );

        return $rules;
    }
}
