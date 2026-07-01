<?php
include ("../api/List_GlRep00010.php");
include ("../../lib/export/exportUtil.php");

$export = new exportUtil ();

$s_title = true;
$title = CUSTOMER_NAME_TH;

$caption = "ทะเบียนคุมค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล (บัญชี)";

if ($_REQUEST ["type"] == "excel") { $export->headerExcel ( $caption ); }

$thead = "";
$thead1 = "";
$thead2 = "";
$rowAll = 0;

// $mm1	= round($_REQUEST ["c_mm1"]);
// $mm2	= round($_REQUEST ["c_mm2"]);

// // =================== gen Head =================== //
$wh	= "";
if($_REQUEST["i_show_acc"] == 1) { // บัญชีคุม Lv4
	
	// =======================================//
	$ss_id = explode ( ";", $_REQUEST ["dc_acc_id_parent"] );
	if (! in_array ( "0", $ss_id )) {
		$in = "";
		foreach ( $ss_id as $val ) { $in .= ($in == "") ? $val : ", " . $val; }
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
		$wh	= " AND a.dc_acc_lv4_id IN (".$in.")";
		$str_acc = "<div><strong>รายการบัญชีคุม Lv4 : <font color='blue'>" . $name . "</font></strong></div>";
	} else {
		$str_acc = "<div><strong>รายการบัญชีคุม Lv4 : <font color='blue'>ทั้งหมด</font></strong></div>";
	}
	// =======================================//
	
} else if($_REQUEST["i_show_acc"] == 3) { // บัญชีคุม Lv5
	
	// =======================================//
	$ss_id = explode ( ";", $_REQUEST ["dc_acc_id_parent_lv5"] );
	if (! in_array ( "0", $ss_id )) {
		$in = "";
		foreach ( $ss_id as $val ) { $in .= ($in == "") ? $val : ", " . $val; }
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
		$wh	= " AND a.dc_acc_lv5_id IN (".$in.")";
		$str_acc = "<div><strong>รายการบัญชีคุม Lv5 : <font color='blue'>" . $name . "</font></strong></div>";
	} else {
		$str_acc = "<div><strong>รายการบัญชีคุม Lv5 : <font color='blue'>ทั้งหมด</font></strong></div>";
	}
	// =======================================//
	
} else if($_REQUEST["i_show_acc"] == 2) { // บัญชีย่อย
	
	// =======================================//
	$ss_id = explode ( ";", $_REQUEST ["dc_acc_id"] );
	if (! in_array ( "0", $ss_id )) {
		$in = "";
		foreach ( $ss_id as $val ) { $in .= ($in == "") ? $val : ", " . $val; }
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
		$wh	= " AND a.dc_acc_id IN (".$in.")";
		$str_acc = "<div><strong>รายการบัญชีย่อย : <font color='blue'>" . $name . "</font></strong></div>";
	} else {
		$str_acc = "<div><strong>รายการบัญชีย่อย : <font color='blue'>ทั้งหมด</font></strong></div>";
	}
	// =======================================//
}

$sql_head = "	SELECT DISTINCT a.dc_acc_lv4_id, a.c_code_lv4, a.c_name_lv4
				FROM vw_dc_acc_with_parent a
					INNER JOIN imp_fix_acc b ON a.dc_acc_id = b.dc_acc_id
				WHERE a.i_enable = ? AND a.i_delete = ? AND b.report_number = 1 {$wh} ORDER BY a.c_code_lv4;";
$stmt_h = $db->QueryParam ( $sql_head, array ( STATUS_ENABLE, DELETE_FALSE ) );

if ($stmt_h) {
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2 width=88>วันที่</th>";
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2 width=100>เลขที่ฎีกา</th>";
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2>รายการ</th>";
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2 width=73>เลขที่เช็ค</th>";
	while ( $data_h = $db->Fetch ( $stmt_h ) ) {
// 		$i = 0;
// 		$thead3 = "";
		$ArrHeadID [$data_h ["dc_acc_lv4_id"]] = $data_h ["c_code_lv4"]." ".$data_h ["c_name_lv4"];
		
// 		$thead1 .= "<th width='100' nowrap style='vertical-align:middle; background-color:#ffe8c6;'>ปี " . ($_REQUEST ["year"] + 543) . "</th>";
// 		if ($_REQUEST ["i_show_month"] == 2) {
			
// 			for($ii=$mm1;$ii<=$mm2;$ii++) {
// 				$nn		= sprintf("%02d",$ii);
// 				$val	= $date->s_month_thai[$nn];
// 				$thead2 .= "<th nowrap style='vertical-align:middle; background-color:#ffe8c6;'>" . $val . "</th>";
// 				$rowAll ++;
// 				if ($ii == $mm2) {
		$thead1 .= "<th style='vertical-align:middle;'>".$data_h ["c_code_lv4"]."</th>";
		$thead2 .= "<th style='vertical-align:middle;'>".$data_h ["c_name_lv4"]."</th>";
		$rowAll ++;
// 					$i ++;
// 				}
// 				$i ++;
				
// 				$thead3 .= "<th nowrap style='vertical-align:middle; background-color:#d9f5b9;'>" . $val . "</th>";
// 				$rowAll ++;
// 				if ($ii == $mm2) {
// 					$thead3 .= "<th width='100' nowrap style='vertical-align:middle; background-color:#d9f5b9;'>เหลื่อมปี " . ($_REQUEST ["year"] + 542) . "</th>";
// 					$rowAll ++;
// 					$i ++;
// 				}
// 				$i ++;
// 			}
// 		} else {
// 			$thead2 .= "<th nowrap width='100' style='vertical-align:middle; background-color:#ffe8c6;'>ปี " . ($_REQUEST ["year"] + 543) . "</th>";
// 			$rowAll ++;
// 			$thead3 .= "<th nowrap width='100' style='vertical-align:middle; background-color:#d9f5b9;'>เหลื่อมปี " . ($_REQUEST ["year"] + 542) . "</th>";
// 			$rowAll ++;
// 			$i = 2;
// 		}
// 		$thead2 .= $thead3;
// 		$thead1 .= "<th style='vertical-align:middle;' nowrap colspan=" . $i . ">" . $data_h ["c_name"] . "</th>";
	}
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2 width=100>ผลรวมทั้งหมด</th>";
	$thead .= "<tr height=20>" . $thead1 . "</tr>";
	$thead .= "<tr height=20>" . $thead2 . "</tr>";
}
// ================================================ //
// function gen_acc($style, $param, $em = "td") {
	
// 	global $date, $mm1, $mm2;
	
// 	$tt = "";
	
// 	for($vv = 1; $vv <= 2; $vv++) {
		
// 		$ind		= $vv;
// 		$sum		= 0;
// 		$f_amount	= 0;
		
// 		for($ii=$mm1;$ii<=$mm2;$ii++) {
// 			$f_amount = (@$param [$ind]) ? $param [$ind] ["f_amount" . ( int ) $ii] : 0;
// 			if ($_REQUEST ["i_show_month"] == 2) {
// 				if (@$param [$ind]) {
// 					if ($f_amount > 0) {
// 						$tt .= "<{$em} " . $style . " nowrap align='right'>" . number_format ( $f_amount, 2 ) . "</{$em}>";
// 					} else if ($f_amount < 0) {
// 						$tt .= "<{$em} " . $style . " nowrap align='right'>(" . number_format ( abs($f_amount), 2 ) . ")</{$em}>";
// 					} else {
// 						$tt .= "<{$em} " . $style . " nowrap align='right'>-</{$em}>";
// 					}
// 				} else { $tt .= "<{$em} " . $style . " nowrap align='right'>-</{$em}>"; }
// 			}
// 			$sum += $f_amount;
// 		}
		
// 		if ($sum > 0) { $tt .= "<{$em} " . $style . " nowrap align='right'>" . number_format ( $sum, 2 ) . "</{$em}>"; }
// 		else if ($sum < 0) { $tt .= "<{$em} " . $style . " nowrap align='right'>(" . number_format ( abs($sum), 2 ) . ")</{$em}>"; }
// 		else { $tt .= "<{$em} " . $style . " align='right' nowrap>-</{$em}>"; }
// 	}
// 	return $tt;
// }

// function sum_row($param) {
	
// 	global $date, $mm1, $mm2;
	
// 	$sum		= 0;
// 	for($vv = 1; $vv <= 2; $vv++) {
// 		$ind		= $vv;
// 		$f_amount	= 0;
// 		for($ii=$mm1;$ii<=$mm2;$ii++) {
// 			$f_amount = (@$param [$ind]) ? $param [$ind] ["f_amount" . ( int ) $ii] : 0;
// 			$sum += $f_amount;
// 		}
// 	}
// 	return $sum;
// }

$data_dtl = json_decode ( List_QueryParam (), true );

if (is_array ( $data_dtl ) && count ( $data_dtl ["data"] ) > 0) {
	
	$tbody = "<tbody>";
	
	foreach ( $data_dtl ["data"] as $index => $jObj ) {
		
// 		$style	= "style='border: 0px solid; border-left: 1px solid;'";
		$style	= "";
// 		$nbsp	= "";
		
		// GEN TBODY
		if (@$jObj ["i_type"] == 1) {
			
			$bg	= "background-color: #dcfffa;";
			$color	= ($jObj["i_status"] == 1)? "" : "color: red;";
			$style	.= "style='{$color} {$bg}'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<td ".$style." align='center' nowrap>".$jObj["d_date"]."</td>";
			$tbody .= "<td ".$style." align='center'>".$jObj["c_approve"]."</td>";
			$tbody .= "<td ".$style."><span class='text-overflow' style='width: 300px;'>".$jObj["c_name"]."</span></td>";
			$tbody .= "<td ".$style."></td>";
			foreach ( $ArrHeadID as $dc_acc_lv4_id => $val ) {
				if(@$jObj ["data"][$dc_acc_lv4_id]) {
					$ob	= $jObj ["data"][$dc_acc_lv4_id];
					if ($jObj["i_status"] == 1) {
						$tbody .= "<td ".$style." align='right'>".number_format($ob["f_inv"],2)."</td>";
						$vv += $ob["f_inv"];
					} else {
						$tbody .= "<td ".$style." align='right'>(".number_format($ob["f_inv"],2).")</td>";
						$vv -= $ob["f_inv"];
					}
				} else { $tbody .= "<td ".$style."></td>"; }
			}
			
			if ($vv > 0) { $tbody .= "<td ".$style." align='right'>".number_format($vv,2)."</td>"; }
			else { $tbody .= "<td ".$style." align='right'>(".number_format(abs($vv),2).")</td>"; }
			
			$tbody .= "</tr>";
				
		} else if (@$jObj ["i_type"] == 2) {
			
			$bg	= "";
			$style	.= ($jObj["i_status"] == 1)? "style='{$bg}'" : "style='color: red; {$bg}'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<td ".$style." align='center' nowrap colspan=3></td>";
			$tbody .= "<td ".$style." align='center' nowrap>".$jObj["c_cheque"]."</td>";
			foreach ( $ArrHeadID as $dc_acc_lv4_id => $val ) {
				if(@$jObj ["data"][$dc_acc_lv4_id]) {
					$ob	= $jObj ["data"][$dc_acc_lv4_id];
					if ($jObj["i_status"] == 1) {
						$tbody .= "<td ".$style." align='right'>".number_format($ob["f_cheque"],2)."</td>";
						$vv += $ob["f_cheque"];
					} else {
						$tbody .= "<td ".$style." align='right'>(".number_format($ob["f_cheque"],2).")</td>";
						$vv -= $ob["f_cheque"];
					}
				} else { $tbody .= "<td ".$style."></td>"; }
			}
			
			if ($vv > 0) { $tbody .= "<td ".$style." align='right'>".number_format($vv,2)."</td>"; }
			else { $tbody .= "<td ".$style." align='right'>(".number_format(abs($vv),2).")</td>"; }
			
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 3) {
			
			$bg	= "background-color: #aed2cc;";
			$style	.= "style='{$bg} border-bottom: 3px double;'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<td style='{$bg}' align='center' nowrap colspan=4>{$jObj["d_date"]}</td>";
			foreach ( $ArrHeadID as $dc_acc_lv4_id => $val ) {
				if(@$jObj ["data"][$dc_acc_lv4_id]) {
					$ob	= $jObj ["data"][$dc_acc_lv4_id];
					$tbody .= "<td {$style} align='right'><b>".number_format($ob["f_inv"],2)."</b></td>";
					$vv += $ob["f_inv"];
				} else { $tbody .= "<td {$style} align='right'><b>-</b></td>"; }
			}
			
			if ($vv > 0) { $tbody .= "<td {$style} align='right'><b>".number_format($vv,2)."</b></td>"; }
			else { $tbody .= "<td {$style} align='right'><b>(".number_format(abs($vv),2).")</b></td>"; }
			
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 4) {
			
			$bg	= "background-color: #aed2cc;";
			$style	.= "style='{$bg} border-bottom: 3px double;'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<td style='{$bg}' align='center' nowrap colspan=4>{$jObj["d_date"]}</td>";
			foreach ( $ArrHeadID as $dc_acc_lv4_id => $val ) {
				if(@$jObj ["data"][$dc_acc_lv4_id]) {
					$ob	= $jObj ["data"][$dc_acc_lv4_id];
					$tbody .= "<td {$style} align='right'><b>".number_format($ob["f_cheque"],2)."</b></td>";
					$vv += $ob["f_cheque"];
				} else { $tbody .= "<td {$style} align='right'><b>-</b></td>"; }
			}
			
			if ($vv > 0) { $tbody .= "<td {$style} align='right'><b>".number_format($vv,2)."</b></td>"; }
			else { $tbody .= "<td {$style} align='right'><b>(".number_format(abs($vv),2).")</b></td>"; }
			
			$tbody .= "</tr>";
			
		}
	}
	
	$tbody .= "</tbody>";
} else {
	$tbody = "<tbody><tr><td align='center' colspan=" . ($rowAll + 1) . ">ไม่มีข้อมูล</td></tr></tbody>";
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo COMPANY_NAME;?></title>
<link rel="stylesheet" type="text/css" href="../../css/report_css.css" />
</head>
<body>
<?php
if ($s_title == true)
	echo "<div align='center'><strong>" . $title . "</strong></div>";

$arr_id = explode ( ";", $_REQUEST ["dc_expense_budget_type_id"] );
if (! in_array ( "0", $arr_id )) {
	$in = "";
	if (is_array ( $arr_id )) {
		foreach ( $arr_id as $val_parent ) {
			$in .= ($in == "") ? $val_parent : ", " . $val_parent;
		}
		$stmt = $db->QueryParam ( "SELECT c_name FROM vw_dc_expense_budget_type WHERE dc_expense_budget_type_id IN (" . $in . ")", array () );
		if ($stmt) {
			$txt_budget = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$txt_budget .= ($txt_budget == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
	}
} else { $txt_budget = "ทั้งหมด"; }

echo "<div align='center'><strong>" . $caption . "</strong></div>";
echo "<div align='center'><strong>ปีงบประมาณ " . ($_REQUEST ["year"] + 543) . "</strong></div>";
echo "<div><strong>แหล่งเงิน : <font color='blue'>" . $txt_budget . "</font></strong></div>";
echo "<div><strong>วันที่บันทึกบัญชี : <font color='blue'>" . $date->extDateBuddha ( $_REQUEST ["date_start"] ) . "</font> ถึงวันที่ : <font color='blue'>" . $date->extDateBuddha ( $_REQUEST ["date_end"] ) . "</font></strong></div>";
echo $str_acc;
?>
<table width="100%" class="table_report" border="0" cellspacing="1" cellpadding="0" style="page-break-after: always;">
		<thead valign="top">
<?php echo $thead; ?>
		</thead>
<?php echo $tbody; ?>
</table>
</body>
</html>