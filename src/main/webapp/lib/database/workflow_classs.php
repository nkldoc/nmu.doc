<?php

class WorkflowEngine {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    function nextStatus(
            $module,
            $currentStatus,
            $action) {

        $sql = "
        SELECT from_status  , action_code , to_status , action_desc
        FROM EIS_ERP..workflow_transition
        WHERE module_code=?
        AND from_status=?
        AND action_code=?
        ";
//        echo $this->db->debugSql($sql, array(
//            $module,
//            $currentStatus,
//            $action
//        ));
//        exit();
        $stmt = $this->db->QueryParam($sql,
                array(
                    $module,
                    $currentStatus,
                    $action
                )
        );
        $row = $this->db->Fetch($stmt, SQLSRV_FETCH_ASSOC);
        return $row;
    }
}
