<?php

include_once '../workflow/WorkflowEngine.php';
include_once '../service/AuditService.php';
include_once '../service/DocumentService.php';
include_once '../service/NotificationService.php';

class WorkflowService {

    private $db;
    private $workflow;
    private $audit;
    private $document;
    private $notify;

    function __construct($db) {

        $this->db = $db;

        $this->workflow = new WorkflowEngine($db);

        $this->audit = new AuditService($db);

        $this->document = new DocumentService($db);

        $this->notify = new NotificationService();
    }

    public function process(
            $module,
            $table,
            $docNo,
            $currentStatus,
            $action,
            $next_role
    ) {

        sqlsrv_begin_transaction(
                $this->db->conn
        );

        try {

            $next = $this->workflow
                    ->nextStatus(
                            $module,
                            $currentStatus,
                            $action,
                            $next_role
                    );

            $newStatus = $next->newStatus;
            $statusName = $next->statusName;
            $nextRole = $next->nextRole;

            $this->document
                    ->updateStatus(
                            $table,
                            $docNo,
                            $newStatus,
                            $action,
                            $next_role
                    );

            $message = "ACTION : $action "
                    . "STATUS : $newStatus "
                    . "($statusName)";

            $this->audit->save(
                    $module,
                    $docNo,
                    $action,
                    $newStatus,
                    $message
            );

            $this->notify->send(
                    $docNo,
                    $nextRole,
                    $statusName
            );

            sqlsrv_commit(
                    $this->db->conn
            );

            return array(
                'success' => true,
                'status' => $newStatus,
                'status_name' => $statusName,
                'next_role' => $nextRole,
                'message' => 'Success'
            );
        } catch (Exception $e) {

            sqlsrv_rollback(
                    $this->db->conn
            );

            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
    }
}
