<?php

class WorkflowResult {

    public $success = true;
    public $message = '';
    public $oldStatus;
    public $newStatus;
    public $statusName;
    public $actionCode;
    public $nextRole;
    public $nextUser;
    public $notificationMessage;

    public function toArray() {

        return array(
            'success' => $this->success,
            'message' => $this->message,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'status_name' => $this->statusName,
            'action_code' => $this->actionCode,
            'next_role' => $this->nextRole,
            'next_user' => $this->nextUser,
            'notification_message' =>
            $this->notificationMessage
        );
    }
}
