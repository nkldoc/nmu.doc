<?php

class WorkflowDao {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    /**
     * หา Workflow
     */
    public function findTransition(
            $moduleCode,
            $fromStatus,
            $actionCode,
            $roleCode) {

        $sql = "
            SELECT TOP 1
                *
            FROM workflow_transitions
            WHERE module_code = ?
            AND from_status = ?
            AND action_code = ?
            AND from_role = ?
            AND active_flag = 1
        ";

        $params = array(
            $moduleCode,
            $fromStatus,
            $actionCode,
            $roleCode
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

        return sqlsrv_fetch_array(
                $rs,
                SQLSRV_FETCH_ASSOC
        );
    }

    /**
     * ดึง Action ที่ทำได้
     */
    public function findActions(
            $moduleCode,
            $currentStatus,
            $roleCode) {

        $sql = "
            SELECT
                action_code,
                action_desc,
                button_text,
                button_icon,
                button_color
            FROM workflow_transitions
            WHERE module_code = ?
            AND from_status = ?
            AND from_role = ?
            AND active_flag = 1
            ORDER BY sort_order
        ";

        $params = array(
            $moduleCode,
            $currentStatus,
            $roleCode
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

        $data = array();

        while ($row = sqlsrv_fetch_array(
        $rs,
        SQLSRV_FETCH_ASSOC)) {

            $data[] = $row;
        }

        return $data;
    }
}
