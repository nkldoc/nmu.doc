<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: *');
header('Access-Control-Allow-Headers: Content-Type, X-Api-Key ,Origin, X-Requested-With, Accept ,Authorization , X-PINGOTHER,');
header('Access-Control-Allow-Credentials: true');

include("line_Notif.php");
$sl = new line_Notif();
if($_REQUEST['mode']== 1){
    $sl-> token = "KPXXAppt3dElykpoSxJsZqGs2SF0fgwoQUW5YAXKbDB"; //token กลุ่มไลน์ KPXXAppt3dElykpoSxJsZqGs2SF0fgwoQUW5YAXKbDB
    }  else if($_REQUEST['mode']== 3){
    $sl-> token = "EsmmKHFiONTCCvmk5kdJBDEYpLyXLwIZV1Za4XQOdJM"; //token กลุ่มไลน์ฝ่ายจัดสรร EsmmKHFiONTCCvmk5kdJBDEYpLyXLwIZV1Za4XQOdJM
    } else {
    $sl-> token = "D6FRoKcCbis7buuMmlDNHBJYXgOWamF8pbtHo6AUzS1";
}
$res = $sl->lineNotif(urldecode($_REQUEST['msg']));
echo json_encode($res);
exit;
