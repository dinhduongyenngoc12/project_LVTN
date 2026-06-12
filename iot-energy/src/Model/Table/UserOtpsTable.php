<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UserOtpsTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('user_otps');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');
    }

    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->scalar('email')
            ->maxLength('email', 100)
            ->requirePresence('email', 'create')
            ->notEmptyString('email');

        $validator
            ->scalar('otp')
            ->maxLength('otp', 6)
            ->requirePresence('otp', 'create')
            ->notEmptyString('otp');

        $validator
            ->dateTime('created_at')
            ->requirePresence('created_at', 'create')
            ->notEmptyDateTime('created_at');

        $validator
            ->dateTime('expires_at')
            ->requirePresence('expires_at', 'create')
            ->notEmptyDateTime('expires_at');

        return $validator;
    }
}
