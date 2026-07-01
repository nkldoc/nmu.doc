<?php

class NotificationService {

    public function send(
            $docNo,
            $nextRole,
            $message) {

        // ส่ง Email
        // ส่ง LINE
        // ส่ง WebSocket

        error_log(
                "$docNo => $nextRole => $message"
        );
    }
}
