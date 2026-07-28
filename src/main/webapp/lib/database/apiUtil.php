<?php

class apiUtil {

    public function __construct() {

    }

    public function viewAcc($i, $alias = '') {
        $alias = ($alias == '') ? '' : $alias . '.';
        switch ($i) {
            case 1: $ret = ' and ' . $alias . 'dc_user_create_id= ' . $_SESSION["user_id"];
                break;
            case 2: $ret = ' and ' . $alias . 'dc_user_create_cost_id=' . $_SESSION["dc_cost_id"];
                break;
            default: $ret = '';
        }
        return $ret;
    }

    public function viewDepartment($al, $dc_department_id = 0, $type_menu = 0) {

        // echo "{$dc_department_id} {$type_menu}";
        $user_id = $_SESSION["user_id"] ?? null;
        $sp_emp_id = $_SESSION["sp_emp_id"] ?? null;
        $i = $_SESSION['i_level'] ?? 0;
        $i_type_user = $_SESSION['i_type_user'] ?? 0;

        $alias = ($al == '') ? '' : $al . '.';
        if ($i_type_user == 2) { //admin
            $ret = '';
        } elseif ($i_type_user == 1) { //employee
            if ($dc_department_id == 2 && $type_menu == 0) { //สายงาน 1
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ''; // หัวหน้าธุรการเห็น
                        break;
                    default:
                        $ret = '';
                }
            } else if ($dc_department_id == 3) { //อีกสายงาน /
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ''; // หัวหน้าธุรการเห็น
                        break;
                    default:
                        $ret = '';
                }
            } else if ($dc_department_id == 4 && $type_menu == 0) { //เบิกจ่าย
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ''; // หัวหน้าธุรการเห็น
                        break;
                    default:
                        $ret = '';
                }
            } else if ($dc_department_id == 5 && $type_menu == 0) { //ธุรการ
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ''; // หัวหน้าธุรการเห็น
                        break;
                    default:
                        $ret = '';
                }
            } else if ($dc_department_id == 0 && $type_menu == 2) {
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'sp_emp_id= ' . $sp_emp_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ' and ' . $alias . 'dc_department_id =' . $_SESSION["dc_department_id"];
                        break;
                    default:
                        $ret = '';
                }
            } else {
                switch ($i) {
                    case 3:
                        $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id; //ปฏิบัติ
                        break;
                    case 2:
                        $ret = ''; // หัวหน้าธุรการเห็น
                        break;
                    default:
                        $ret = '';
                }
            }
        } else {
            //outsource
        }
        return $ret;
    }

    public function viewDepartmentTor($al) {
        $user_id = $_SESSION["user_id"] ?? null;
        $i = $_SESSION['i_level'] ?? 0;
        $i_type_user = $_SESSION['i_type_user'] ?? 0;
        $dc_department_id = $_SESSION['dc_department_id'] ?? null;

        $alias = ($al == '') ? '' : $al . '.';
        if ($i_type_user == 2) { //admin
            $ret = '';
        } elseif ($i_type_user == 1) { //employee
            switch ($i) {
                case 3:
                    $ret = ' and ' . $alias . 'dc_user_create_id= ' . $user_id;
                    break;
                case 2:
                    $ret = ' and ' . $alias . 'dc_department_id =' . $dc_department_id;
                    break;
                default:
                    $ret = '';
            }
        } else { //outsource
        }
        return $ret;
    }

    public function get($b) {
        return $b ?? null;
    }

    public function json_clean_decode($json, $assoc = false, $depth = 512, $options = 0) {

        // search and remove comments like /* */ and //
        $json = preg_replace("#(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/)|([\s\t](//).*)#", '', $json);

        if (version_compare(phpversion(), '5.4.0', '>=')) {
            $json = json_decode($json, $assoc, $depth, $options);
        } elseif (version_compare(phpversion(), '5.3.0', '>=')) {
            $json = json_decode($json, $assoc, $depth);
        } else {
            $json = json_decode($json, $assoc);
        }

        return $json;
    }

//end func

    public function sendAPI($arr, $url = 'http://staging-api.sellsuki.com/dpx/warehousetxcheck', $meth = 'POST') {
        $data_json = $arr;

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_CAINFO, getcwd() . "/dpx.crt");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
        if ($meth == 'POST') {
            curl_setopt($ch, CURLOPT_POST, 1);
        } else if ($meth == 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        } else if ($meth == 'DELETE') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
        }

        $response = curl_exec($ch);
        curl_close($ch);
        return $response;
    }

    public function mnUser($data, $mode = "") {
        // Guard: ป้องกัน session หลุดแล้วเข้าถึง $_SESSION แบบ undefined key
        // ซึ่งเคยทำให้ PHP fatal error กลางทางผ่าน FastCGI bridge จน php-cgi
        // worker ตาย และลากให้ request อื่นค้างตามไปด้วย (worker pool หด)
        $user_id = $_SESSION["user_id"] ?? null;
        if ($user_id === null) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'message' => 'Session expired',
            ]);
            exit;
        }
        $dc_cost_id = $_SESSION["dc_cost_id"] ?? null;

        if ($mode == "") {
            $mode = (isset($data["mode"])) ? $data["mode"] : "";
        }
        if (strtoupper($mode) == "ADD") {
            $data["dc_user_create_id"] = $user_id;
            $data["dc_user_create_cost_id"] = $dc_cost_id;
            $data["d_create"] = date("Y-m-d H:i:s");
        }

        $data["dc_user_update_id"] = $user_id;
        $data["dc_user_update_cost_id"] = $dc_cost_id;
        $data["d_update"] = date("Y-m-d H:i:s");

        return $data;
    }

    public function __Destruct() {

    }
}
