<?php
namespace App\Controller\Component;
use Cake\Controller\Component;
use Cake\Mailer\Mailer;
use App\Controller\AppController;
use Cake\Log\Log;

class ComonComponent extends Component{

    function randomOTP($length = 6) {
        return str_pad(random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
        //str_pad in so so 0 con thieu trong chuoi 6 so ngau nhien
    }
    public function sendOTP(string $otp, string $email): bool
    {
        try {
            $mailer = new Mailer('default');
            $mailer
                ->setFrom(['ngocddy@teamsolutions.vn' => 'IoT Energy'])
                ->setTo($email)
                ->setSubject('Mã OTP của bạn')
                ->deliver('Mã OTP: ' . $otp);

            return true;
        } catch (\Throwable $e) {
            Log::error('Send mail failed: ' . $e->getMessage());
            return false;
        }
    }


}
