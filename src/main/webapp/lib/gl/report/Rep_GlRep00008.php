<?php
include ("../api/List_GlRep00008.php");
include ("../../lib/export/exportUtil.php");

$export = new exportUtil ();

$s_title = true;
$title = CUSTOMER_NAME_TH;

$caption = ($_REQUEST ["PAGE"] == "GlRep00008")? "ค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล (บัญชี)" : "ค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล";

if ($_REQUEST ["type"] == "excel") { $export->headerExcel ( $caption ); }

$thead = "";
$thead1 = "";
$thead2 = "";
$rowAll = 0;

$mm1	= round($_REQUEST ["c_mm1"]);
$mm2	= round($_REQUEST ["c_mm2"]);

// =================== gen Head =================== //
$arr_id = explode ( ";", $_REQUEST ["dc_expense_budget_type_id"] );
if (! in_array ( "0", $arr_id )) {
	$in = "";
	if (is_array ( $arr_id )) {
		foreach ( $arr_id as $val_parent ) {
			$in .= ($in == "") ? $val_parent : ", " . $val_parent;
		}
		$wh = ($in != "") ? " AND dc_expense_budget_type_id IN (" . $in . ")" : "";
		
		$stmt = $db->QueryParam ( "SELECT c_name FROM vw_dc_expense_budget_type WHERE dc_expense_budget_type_id IN (" . $in . ")", array () );
		if ($stmt) {
			$txt_budget = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$txt_budget .= ($txt_budget == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
	}
} else {
	$wh = "";
	$txt_budget = "ทั้งหมด";
}

$sql_head = "SELECT dc_expense_budget_type_id, c_name FROM vw_dc_expense_budget_type WHERE i_enable = ? {$wh} ORDER BY c_name;";
$stmt_h = $db->QueryParam ( $sql_head, array ( STATUS_ENABLE ) );

if ($stmt_h) {
	$thead1 .= "<th style='vertical-align:middle;' nowrap rowspan=2>รายการ</th>";
	while ( $data_h = $db->Fetch ( $stmt_h ) ) {
		$i = 0;
		$thead3 = "";
		$ArrHeadID [$data_h ["dc_expense_budget_type_id"]] = $data_h ["c_name"];
		
		if ($_REQUEST ["i_show_month"] == 2) {
			
			for($ii=$mm1;$ii<=$mm2;$ii++) {
				$nn		= sprintf("%02d",$ii);
				$val	= $date->s_month_thai[$nn];
				$thead2 .= "<th nowrap style='vertical-align:middle; background-color:#ffe8c6;'>" . $val . "</th>";
				$rowAll ++;
				if ($ii == $mm2) {
					$thead2 .= "<th width='100' nowrap style='vertical-align:middle; background-color:#ffe8c6;'>ปี " . ($_REQUEST ["year"] + 543) . "</th>";
					$rowAll ++;
					$i ++;
				}
				$i ++;
				
				$thead3 .= "<th nowrap style='vertical-align:middle; background-color:#d9f5b9;'>" . $val . "</th>";
				$rowAll ++;
				if ($ii == $mm2) {
					$thead3 .= "<th width='100' nowrap style='vertical-align:middle; background-color:#d9f5b9;'>เหลื่อมปี " . ($_REQUEST ["year"] + 542) . "</th>";
					$rowAll ++;
					$i ++;
				}
				$i ++;
			}
		} else {
			$thead2 .= "<th nowrap width='100' style='vertical-align:middle; background-color:#ffe8c6;'>ปี " . ($_REQUEST ["year"] + 543) . "</th>";
			$rowAll ++;
			$thead3 .= "<th nowrap width='100' style='vertical-align:middle; background-color:#d9f5b9;'>เหลื่อมปี " . ($_REQUEST ["year"] + 542) . "</th>";
			$rowAll ++;
			$i = 2;
		}
		$thead2 .= $thead3;
		$thead1 .= "<th style='vertical-align:middle;' nowrap colspan=" . $i . ">" . $data_h ["c_name"] . "</th>";
	}
	$thead1 .= "<th rowspan='2' width='100' nowrap style='vertical-align:middle; background-color:#ffe8c6;'>รวมทั้งสิ้น</th>";
	$thead .= "<tr height=20>" . $thead1 . "</tr>";
	$thead .= "<tr height=20>" . $thead2 . "</tr>";
}
// ================================================ //
function gen_month($style, $param, $em = "td") {
	
	global $date, $mm1, $mm2;
	
	$tt = "";
	
	for($vv = 1; $vv <= 2; $vv++) {
		
		$ind		= $vv;
		$sum		= 0;
		$f_amount	= 0;
		
		for($ii=$mm1;$ii<=$mm2;$ii++) {
			$f_amount = (@$param [$ind]) ? $param [$ind] ["f_amount" . ( int ) $ii] : 0;
			if ($_REQUEST ["i_show_month"] == 2) {
				if (@$param [$ind]) {
					if ($f_amount > 0) {
						$tt .= "<{$em} " . $style . " nowrap align='right'>" . number_format ( $f_amount, 2 ) . "</{$em}>";
					} else if ($f_amount < 0) {
						$tt .= "<{$em} " . $style . " nowrap align='right'>(" . number_format ( abs($f_amount), 2 ) . ")</{$em}>";
					} else {
						$tt .= "<{$em} " . $style . " nowrap align='right'>-</{$em}>";
					}
				} else { $tt .= "<{$em} " . $style . " nowrap align='right'>-</{$em}>"; }
			}
			$sum += $f_amount;
		}
		
		if ($sum > 0) { $tt .= "<{$em} " . $style . " nowrap align='right'>" . number_format ( $sum, 2 ) . "</{$em}>"; }
		else if ($sum < 0) { $tt .= "<{$em} " . $style . " nowrap align='right'>(" . number_format ( abs($sum), 2 ) . ")</{$em}>"; }
		else { $tt .= "<{$em} " . $style . " align='right' nowrap>-</{$em}>"; }
	}
	return $tt;
}

function sum_row($param) {
	
	global $date, $mm1, $mm2;
	
	$sum		= 0;
	for($vv = 1; $vv <= 2; $vv++) {
		$ind		= $vv;
		$f_amount	= 0;
		for($ii=$mm1;$ii<=$mm2;$ii++) {
			$f_amount = (@$param [$ind]) ? $param [$ind] ["f_amount" . ( int ) $ii] : 0;
			$sum += $f_amount;
		}
	}
	return $sum;
}

$data_dtl = json_decode ( List_QueryParam (), true );

if (is_array ( $data_dtl ) && count ( $data_dtl ["data"] ) > 0) {
	
	$tbody = "<tbody>";
	
	foreach ( $data_dtl ["data"] as $index => $jObj ) {
		
		$style	= "style='border: 0px solid; border-left: 1px solid;'";
		$nbsp	= "";
		
		// GEN TBODY
		if (@$jObj ["i_type"] == 1) {
			$tbody .= "<tr>";
			$tbody .= "<td ".$style." nowrap><b style='border-bottom: 3px double;'>".$jObj["d_date"]."</b></td>";
			for($ii = 1; $ii <= $rowAll; $ii ++) { $tbody .= "<td ".$style."></td>"; }
			$tbody .= "<td ".$style."></td>";
			$tbody .= "</tr>";
				
		} else if (@$jObj ["i_type"] == 2 || @$jObj ["i_type"] == 3 || @$jObj ["i_type"] == 4) {
			
			$nbsp	= "";
			for($ii = 2; $ii< $jObj ["i_type"]; $ii++) { $nbsp .= "&nbsp;&nbsp;&nbsp;"; }
			$tbody .= "<tr>";
			$tbody .= "<td ".$style." nowrap>".$nbsp."<b>".$jObj["c_name"]."</b></td>";
			for($ii = 1; $ii <= $rowAll; $ii ++) { $tbody .= "<td ".$style."></td>"; }
			$tbody .= "<td ".$style."></td>";
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 5) {
			
			$style	= "style='border: 0px solid; border-left: 1px solid; border-bottom: 1px solid;'";
			$nbsp	= "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<td ".$style." nowrap>".$nbsp.$jObj["c_name"]."</td>";
			foreach ( $ArrHeadID as $budget_id => $val ) {
				$dd = @$jObj ["data"] ["budget_id"] [$budget_id];
				$tbody .= gen_month ( $style, $dd );
				$vv += sum_row ( $dd );
				
			}
			if ($vv > 0) { $tbody .= "<td " . $style . " nowrap align='right'>" . number_format ( $vv, 2 ) . "</td>"; }
			else if ($vv < 0) { $tbody .= "<td " . $style . " nowrap align='right'>(" . number_format ( abs($vv), 2 ) . ")</td>"; }
			else { $tbody .= "<td " . $style . " align='right' nowrap>-</td>"; }
			
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 6 || $jObj ["i_type"] == 9 || $jObj ["i_type"] == 12 || $jObj ["i_type"] == 15
			|| $jObj ["i_type"] == 18 || $jObj ["i_type"] == 21) {
			// หัก ส่งคืน
			$bg	= "";
			if($jObj ["i_type"] == "6") { $bg = "background:#FDFE86;"; }
			else if($jObj ["i_type"] == "9") { $bg = "background:#59CE5D;"; }
			else if($jObj ["i_type"] == "12") { $bg = "background:#FA7A74;"; }
			else if($jObj ["i_type"] == "15") { $bg = "background:#D281F1;"; }
			else if($jObj ["i_type"] == "18") { $bg = "background:#82E1FF;"; }
			else if($jObj ["i_type"] == "21") { $bg = "background:#EBEBEB;"; }
			
			$td	= ($jObj ["i_type"] == "6")? "td" : "th";
			
			$style	= "style='border: 0px solid; border-left: 1px solid; border-bottom: 1px solid; {$bg}'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<{$td} style='border: 0px solid; border-left: 1px solid;' nowrap align='right'>".$jObj["c_name"]."</{$td}>";
			foreach ( $ArrHeadID as $budget_id => $val ) {
				$dd = @$jObj ["data"] ["budget_id"] [$budget_id];
				$tbody .= gen_month ( $style, $dd, $td );
				$vv += sum_row ( $dd );
			}
			
			if ($vv > 0) { $tbody .= "<{$td} " . $style . " nowrap align='right'>" . number_format ( $vv, 2 ) . "</{$td}>"; }
			else if ($vv < 0) { $tbody .= "<{$td} " . $style . " nowrap align='right'>(" . number_format ( abs($vv), 2 ) . ")</{$td}>"; }
			else { $tbody .= "<{$td} " . $style . " align='right' nowrap>-</{$td}>"; }
			
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 7 || @$jObj ["i_type"] == 10 || @$jObj ["i_type"] == 13
			|| @$jObj ["i_type"] == 16 || @$jObj ["i_type"] == 19 || @$jObj ["i_type"] == 22) {
			
			$bg	= "";
			if($jObj ["i_type"] == "7") { $bg = "background:#FBFD2D;"; }
			else if($jObj ["i_type"] == "10") { $bg = "background:#32E93E;"; }
			else if($jObj ["i_type"] == "13") { $bg = "background:#F84F46;"; }
			else if($jObj ["i_type"] == "16") { $bg = "background:#C648F7;"; }
			else if($jObj ["i_type"] == "19") { $bg = "background:#64DAFF;"; }
			else if($jObj ["i_type"] == "22") { $bg = "background:#C3C3C3;"; }
			
			$td	= ($jObj ["i_type"] == "7")? "td" : "th";
			$style	= "style='border: 0px solid; border-left: 1px solid; border-bottom: 1px solid; {$bg}'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<{$td} style='border: 0px solid; border-left: 1px solid; border-bottom: 1px solid;' nowrap align='right'>".$jObj["c_name"]."</{$td}>";
			foreach ( $ArrHeadID as $budget_id => $val ) {
				$dd = @$jObj ["data"] ["budget_id"] [$budget_id];
				$tbody .= gen_month ( $style, $dd, $td );
				$vv += sum_row ( $dd );
			}
			
			if ($vv > 0) { $tbody .= "<{$td} " . $style . " nowrap align='right'>" . number_format ( $vv, 2 ) . "</{$td}>"; }
			else if ($vv < 0) { $tbody .= "<{$td} " . $style . " nowrap align='right'>(" . number_format ( abs($vv), 2 ) . ")</{$td}>"; }
			else { $tbody .= "<{$td} " . $style . " align='right' nowrap>-</{$td}>"; }
			
			$tbody .= "</tr>";
			
		} else if (@$jObj ["i_type"] == 8 || @$jObj ["i_type"] == 11 || @$jObj ["i_type"] == 14
			|| @$jObj ["i_type"] == 17 || @$jObj ["i_type"] == 20) {
			
			$bg	= "";
			$lv = "";
			
			if($jObj ["i_type"] == "8") {
				$bg = "background:#99E19B;";
			} else if($jObj ["i_type"] == "11") {
				$bg = "background:#FB9C97;";
			} else if($jObj ["i_type"] == "14") {
				$bg = "background:#E5AAFC;";
			} else if($jObj ["i_type"] == "17") {
				$bg = "background:#ADECFF;";
			} else if($jObj ["i_type"] == "20") {
				$bg = "background:#F8F8F8;";
			}
			
			$align = ($jObj["i_type"] == 17)? "center" : "right";
						
			$style	= "style='border: 0px solid; border-left: 1px solid; border-bottom: 1px solid; {$bg}'";
			$vv		= 0;
			
			$tbody .= "<tr>";
			$tbody .= "<th ".$style." nowrap align='{$align}'>".$jObj["c_name"]."</th>";
			foreach ( $ArrHeadID as $budget_id => $val ) {
				$dd = @$jObj ["data"] ["budget_id"] [$budget_id];
				$tbody .= gen_month ( $style, $dd, "th" );
				$vv += sum_row ( $dd );
			}

			if ($vv > 0) { $tbody .= "<th " . $style . " nowrap align='right'>" . number_format ( $vv, 2 ) . "</th>"; }
			else if ($vv < 0) { $tbody .= "<th " . $style . " nowrap align='right'>(" . number_format ( abs($vv), 2 ) . ")</th>"; }
			else { $tbody .= "<th " . $style . " align='right' nowrap>-</th>"; }
			
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

if ($_REQUEST ["i_show_month"] == 2) {
	$str_date = "<div><strong>ระหว่างเดือน : <font color='blue'>" . $date->l_month_thai [$_REQUEST ["c_mm1"]] . "</font> ถึง <font color='blue'>" . $date->l_month_thai [$_REQUEST ["c_mm2"]] . "</font></strong></div>";
} else {
	$str_date = "";
}

if($_REQUEST["i_show_acc"] == 1) { // บัญชีคุม Lv4
	
	// =======================================//
	$ss_id = explode ( ";", $_REQUEST ["dc_acc_id_parent"] );
	if (! in_array ( "0", $ss_id )) {
		$in = "";
		foreach ( $ss_id as $val ) {
			$in .= ($in == "") ? $val : ", " . $val;
		}
	
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
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
		foreach ( $ss_id as $val ) {
			$in .= ($in == "") ? $val : ", " . $val;
		}
	
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
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
		foreach ( $ss_id as $val ) {
			$in .= ($in == "") ? $val : ", " . $val;
		}
	
		$stmt = $db->QueryParam ( "SELECT c_name FROM dc_acc WHERE dc_acc_id IN (" . $in . ")", array () );
		if ($stmt) {
			$name = "";
			while ( $row = $db->Fetch ( $stmt ) ) {
				$name .= ($name == "") ? $row ["c_name"] : ", " . $row ["c_name"];
			}
		}
		$str_acc = "<div><strong>รายการบัญชีย่อย : <font color='blue'>" . $name . "</font></strong></div>";
	} else {
		$str_acc = "<div><strong>รายการบัญชีย่อย : <font color='blue'>ทั้งหมด</font></strong></div>";
	}
	// =======================================//
}

echo "<div align='center'><strong>" . $caption . "</strong></div>";
echo "<div align='center'><strong>ปีงบประมาณ " . ($_REQUEST ["year"] + 543) . "</strong></div>";
echo "<div><strong>แหล่งเงิน : <font color='blue'>" . $txt_budget . "</font></strong></div>";
echo "<div><strong>วันที่บันทึกบัญชี : <font color='blue'>" . $date->extDateBuddha ( $_REQUEST ["date_start"] ) . "</font> ถึงวันที่ : <font color='blue'>" . $date->extDateBuddha ( $_REQUEST ["date_end"] ) . "</font></strong></div>";
echo $str_date;
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
