<?php

class WebSocketNotifier {

    private $apiUrl;

    public function __construct() {

        // Java API สำหรับ Push Notification
        $this->apiUrl = "/api/notify";
    }

    public function send(
            $userId,
            $title,
            $message,
            $documentNo = '') {

        $payload = array(
            'userId' => $userId,
            'title' => $title,
            'message' => $message,
            'documentNo' => $documentNo,
            'createdDate' => date('Y-m-d H:i:s')
        );

        $ch = curl_init();

        curl_setopt_array($ch, array(
            CURLOPT_URL => $this->apiUrl,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false
        ));

        $response = curl_exec($ch);

        if (curl_errno($ch)) {

            error_log(
                    'Notify Error : '
                    . curl_error($ch)
            );
        }

        curl_close($ch);

        return $response;
    }
}
