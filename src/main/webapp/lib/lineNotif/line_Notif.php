<?php
/***************************************************
Author:         Dev.Puer
Create Date:	07-02-2023
Description:    ใช้แจ้งเตือน line application หาผู้พัฒนา
****************************************************/
class line_Notif
{
    
    public $url = 'https://notify-api.line.me/api/notify';
    public $token = 'D6FRoKcCbis7buuMmlDNHBJYXgOWamF8pbtHo6AUzS1'; // SEN TO Dev.ICE

    // protected function alert($array)
    // {
    // }

    public function lineNotif($msg)
    {
        $url    = $this->url;
        $token  = $this->token;
        $headers    = [
            'Content-Type: application/x-www-form-urlencoded',
            'Authorization: Bearer ' . $token
        ];
        $fields     = 'message=' . $msg;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        curl_close($ch);

        // var_dump($result);
        $result = json_decode($result, TRUE);
        return $result;
    }


    //แจ้งเตือนผ่านไลน์
    // public function lineNotif($msgg) {

    // ini_set('display_errors', 1);
    // ini_set('display_startup_errors', 1);
    // error_reporting(E_ALL);
    // date_default_timezone_set("Asia/Bangkok");
    // $sToken = "D6FRoKcCbis7buuMmlDNHBJYXgOWamF8pbtHo6AUzS1";
    // $sMessage = $msgg;
    // $chOne = curl_init();
    // curl_setopt($chOne, CURLOPT_URL, "https://notify-api.line.me/api/notify");
    // curl_setopt($chOne, CURLOPT_SSL_VERIFYHOST, 0);
    // curl_setopt($chOne, CURLOPT_SSL_VERIFYPEER, 0);
    // curl_setopt($chOne, CURLOPT_POST, 1);
    // curl_setopt($chOne, CURLOPT_POSTFIELDS, "message=" . $sMessage);
    // $headers = array('Content-type: application/x-www-form-urlencoded', 'Authorization: Bearer ' . $sToken . '',);
    // curl_setopt($chOne, CURLOPT_HTTPHEADER, $headers);
    // curl_setopt($chOne, CURLOPT_RETURNTRANSFER, 1);
    // $result = curl_exec($chOne);

    // //Result error
    // if (curl_error($chOne)) {
    //     return 'error:' . curl_error($chOne);
    // } else {
    //     return $result_ = json_decode($result, true);
    //     //        echo "status : " . $result_['status'];
    //     //        echo "message : " . $result_['message'];
    // }
    // curl_close($chOne);
// }
}
