<?php

class AuditLog {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    function save(
            $session,
            $module,
            $docNo,
            $actionCode,
            $statusCode,
            $desc,
            $oldData = [],
            $newData = [],
            $errorFlag = 0,
            $errorMsg = ''
    ) {

        $sql = "
        INSERT INTO audit_log
        (
            module_code,
            document_no,
            action_code,
            status_code,
            action_desc,
            old_value,
            new_value,
            user_id,
            user_name,
            ip_address,
            error_flag,
            error_message
        )
        VALUES
        (
            ?,?,?,?,?,?,?,?,?,?,?,?
        )
        ";

        $params = array(
            $module,
            $docNo,
            $actionCode,
            $statusCode,
            $desc,
            json_encode($oldData, JSON_UNESCAPED_UNICODE),
            json_encode($newData, JSON_UNESCAPED_UNICODE),
            $session['user_id'],
            $session['user_name'],
            $_SERVER['REMOTE_ADDR'],
            $errorFlag,
            $errorMsg
        );
        $smt = $this->db->QueryParam($sql, $params);
        return $smt;
    }
}
