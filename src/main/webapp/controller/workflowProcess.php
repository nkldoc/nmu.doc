<?php

include_once '../config/config.php';
include_once '../lib/database/DatabaseServer.php';
include_once '../service/WorkflowService.php';

$db = new DatabaseServer();
$service = new WorkflowService($db);

$result = $service->process(
        $_REQUEST['module_code'] ?? null,
        $_REQUEST['table_name'] ?? null,
        $_REQUEST['document_no'] ?? null,
        $_REQUEST['current_status'] ?? null,
        $_REQUEST['action_code'] ?? null,
        $_REQUEST['from_role'] ?? null
);

echo json_encode($result);
