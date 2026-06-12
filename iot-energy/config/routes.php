<?php

use Cake\Routing\Route\DashedRoute;
use Cake\Routing\RouteBuilder;

return function (RouteBuilder $routes): void {
    $routes->setRouteClass(DashedRoute::class);

    $routes->scope('/api', function (RouteBuilder $builder): void {
        $builder->setExtensions(['json']);

        $builder->scope('/auth', ['prefix' => 'Api'], function (RouteBuilder $builder): void {
            $builder->connect('/register', ['controller' => 'Users', 'action' => 'register'], ['_method' => 'POST']);
            $builder->connect('/checkOTP', ['controller' => 'Users', 'action' => 'checkOTP'], ['_method' => 'POST']);
            $builder->connect('/resend-otp', ['controller' => 'Users', 'action' => 'resendOTP'], ['_method' => 'POST']);
            $builder->connect('/login', ['controller' => 'Users', 'action' => 'login'], ['_method' => 'POST']);
            $builder->connect('/logout', ['controller' => 'Users', 'action' => 'logout'], ['_method' => 'POST']);
            $builder->connect('/me', ['controller' => 'Users', 'action' => 'me'], ['_method' => 'GET']);
            $builder->connect('/refresh', ['controller' => 'Users', 'action' => 'refresh'], ['_method' => 'POST']);
            $builder->connect('/social/google',
                ['controller' => 'Users', 'action' => 'socialLogin', 'provider' => 'google'],
                ['pass' => ['provider']]           
            );
        });

        $builder->scope('/users', ['prefix' => 'Api'], function (RouteBuilder $builder): void {
            $builder->connect('', ['controller' => 'Users', 'action' => 'index'], ['_method' => 'GET']);
        });

        $builder->scope('/devices', ['prefix' => 'Api'], function (RouteBuilder $builder): void {
        $builder->get('', ['controller' => 'Devices', 'action' => 'index']);
        $builder->post('', ['controller' => 'Devices', 'action' => 'add']);
        $builder->get('/{id}', ['controller' => 'Devices', 'action' => 'view'])->setPass(['id']);
        $builder->put('/{id}', ['controller' => 'Devices', 'action' => 'edit'])->setPass(['id']);
        $builder->patch('/{id}', ['controller' => 'Devices', 'action' => 'edit'])->setPass(['id']);
        $builder->delete('/{id}', ['controller' => 'Devices', 'action' => 'delete'])->setPass(['id']);

        $builder->post('/{id}/activate', ['controller' => 'Devices', 'action' => 'activate'])->setPass(['id']);
        $builder->post('/{id}/disable', ['controller' => 'Devices', 'action' => 'disable'])->setPass(['id']);
        });

        $builder->scope('/energy-logs', ['prefix' => 'Api'], function (RouteBuilder $builder): void {
            $builder->get('', ['controller' => 'EnergyLogs', 'action' => 'index']);
            $builder->post('', ['controller' => 'EnergyLogs', 'action' => 'add']);
            $builder->get('/hour-power', ['controller' => 'EnergyLogs','action' => 'hourPower']);
            $builder->get('/day-energy', ['controller' => 'EnergyLogs','action' => 'dayPower']);
            $builder->get('/month-power', ['controller' => 'EnergyLogs','action' => 'monthPower']);
            $builder->get('/{id}', ['controller' => 'EnergyLogs', 'action' => 'view'])->setPass(['id']);

        });

        $builder->scope('/alert-configs', ['prefix' => 'Api'], function (RouteBuilder $builder): void {
            $builder->connect('', ['controller' => 'AlertConfigs', 'action' => 'index'], ['_method' => 'GET']);
            $builder->connect('/{id}', ['controller' => 'AlertConfigs', 'action' => 'view'], ['pass' => ['id'], '_method' => 'GET']);
            $builder->connect('/{id}', ['controller' => 'AlertConfigs', 'action' => 'edit'], ['pass' => ['id'], '_method' => ['PUT', 'PATCH']]);
        });

        $builder->fallbacks();
    });
};
