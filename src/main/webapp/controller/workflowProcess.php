<?php

include_once '../config/config.php';
include_once '../lib/database/DatabaseServer.php';
include_once '../service/WorkflowService.php';

$db = new DatabaseServer();
$service = new WorkflowService($db);

$result = $service->process(
        $_REQUEST['module_code'],
        $_REQUEST['table_name'],
        $_REQUEST['document_no'],
        $_REQUEST['current_status'],
        $_REQUEST['action_code'],
        $_REQUEST['from_role']
);

echo json_encode($result);
