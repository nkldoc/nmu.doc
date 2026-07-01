<?php

include_once dirname(__DIR__) . '/dao/WorkflowDao.php';
include_once dirname(__DIR__) . '/model/WorkflowResult.php';

class WorkflowEngine {

    private $db;
    private $dao;

    public function __construct($db) {
        $this->db = $db;
        $this->dao = new WorkflowDao($db);
    }

    /**
     * หา Workflow ถัดไป
     */
    public function nextStatus(
            $moduleCode,
            $currentStatus,
            $actionCode,
            $roleCode = null) {

//        if ($roleCode == null) {
//            $roleCode = $_SESSION['user_name'];
//        }

        $wf = $this->dao->findTransition(
                $moduleCode,
                $currentStatus,
                $actionCode,
                $roleCode
        );

        if (!$wf) {

            throw new Exception(
                            "ไม่พบ Workflow : "
                            . $moduleCode
                            . " / "
                            . $currentStatus
                            . " / "
                            . $actionCode
                    );
        }

        $result = new WorkflowResult();

        $result->success = true;
        $result->oldStatus = $currentStatus;
        $result->newStatus = $wf['to_status'];
        $result->statusName = $wf['status_name'];
        $result->actionCode = $actionCode;
        $result->actionDesc = $wf['action_desc'];
        $result->nextRole = $wf['to_role'];

        return $result;
    }

    /**
     * ตรวจสอบว่าผู้ใช้มีสิทธิ์ดำเนินการหรือไม่
     */
    public function validateAction(
            $moduleCode,
            $currentStatus,
            $actionCode,
            $roleCode) {

        $wf = $this->dao->findTransition(
                $moduleCode,
                $currentStatus,
                $actionCode,
                $roleCode
        );

        return ($wf != false);
    }

    /**
     * ดึง Action ที่สามารถทำได้
     */
    public function getAvailableActions(
            $moduleCode,
            $currentStatus,
            $roleCode) {

        return $this->dao->findActions(
                        $moduleCode,
                        $currentStatus,
                        $roleCode
                );
    }
}
