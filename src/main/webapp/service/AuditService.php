<?php

class AuditService {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    public function save(
            $module,
            $docNo,
            $action,
            $status,
            $message) {

        $sql = "
            INSERT INTO sign_audit_documents
            (
                module_code,
                document_no,
                action_code,
                current_status,
                action_by,
                action_name,
                action_date
            )
            VALUES
            (?,?,?,?,?,?,GETDATE())
        ";

        $params = array(
            $module,
            $docNo,
            $action,
            $status,
            $_SESSION['user_id'],
            $message
        );

        $rs = sqlsrv_query(
                $this->db->conn,
                $sql,
                $params
        );

        if ($rs === false) {
            throw new Exception(
                            print_r(sqlsrv_errors(), true)
                    );
        }
    }
}
