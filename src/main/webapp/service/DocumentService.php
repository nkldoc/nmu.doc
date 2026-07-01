<?php

class DocumentService {

    private $db;

    function __construct($db) {
        $this->db = $db;
    }

    public function updateStatus(
            $table,
            $docNo,
            $newStatus,
            $action) {

        switch ($action) {

            case 'SUBMIT':

                $sql = "
                    UPDATE $table
                    SET
                        current_status=?,
                        submit_by=?,
                        submit_date=GETDATE()
                    WHERE document_no=?
                ";
                break;

            case 'SIGN':

                $sql = "
                    UPDATE $table
                    SET
                        current_status=?,
                        sign_by=?,
                        sign_date=GETDATE()
                    WHERE document_no=?
                ";
                break;

            case 'RETURN':

                $sql = "
                    UPDATE $table
                    SET
                        current_status=?,
                        return_by=?,
                        return_date=GETDATE()
                    WHERE document_no=?
                ";
                break;

            case 'CANCEL':

                $sql = "
                    UPDATE $table
                    SET
                        current_status=?,
                        cancel_by=?,
                        cancel_date=GETDATE()
                    WHERE document_no=?
                ";
                break;

            default:

                $sql = "
                    UPDATE $table
                    SET
                        current_status=?,
                        update_by=?,
                        update_date=GETDATE()
                    WHERE document_no=?
                ";
        }

        $params = array(
            $newStatus,
            $_SESSION['user_id'],
            $docNo
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
