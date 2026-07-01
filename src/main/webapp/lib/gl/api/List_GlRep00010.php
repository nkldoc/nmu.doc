<?php
include ("../../conf/config.php");
include ("../../lib/database/DatabaseServer.php");
include ("../../lib/date/i_date.class.php");

$db = new DatabaseServer ();
$date = new i_date ();

$root = "data";
$data = array ();
$con = null;

function List_QueryParam() {
	
	global $db, $date, $root, $data, $con, $arr_status;
	
	$totalCount = 0;
	
	$arr_id = explode ( ";", $_REQUEST ["dc_expense_budget_type_id"] );
	if (! in_array ( "0", $arr_id )) {
		$in = "";
		if (is_array ( $arr_id )) {
			foreach ( $arr_id as $val_parent ) {
				$in .= ($in == "") ? $val_parent : ", " . $val_parent;
			}
			$con .= ($in != "") ? " AND b.dc_expense_budget_type_id IN (" . $in . ")" : "";
		}
	}
	
	if($_REQUEST["i_show_acc"] == 1) { // บัญชีคุม Lv4
		
		$ss_id	= explode(";", $_REQUEST["dc_acc_id_parent"]);
		if( !in_array("0", $ss_id ) ) {
			$in	= "";
			foreach( $ss_id as $val ) { $in	.= ( $in == "" )? $val : ", ".$val; }
			$con	.= " AND e.dc_acc_lv4_id IN (".$in.")";
		}
	
	} else if($_REQUEST["i_show_acc"] == 3) { // บัญชีคุม Lv5
	
		$ss_id	= explode(";", $_REQUEST["dc_acc_id_parent_lv5"]);
		if( !in_array("0", $ss_id ) ) {
			$in	= "";
			foreach( $ss_id as $val ) { $in	.= ( $in == "" )? $val : ", ".$val; }
			$con	.= " AND e.dc_acc_lv5_id IN (".$in.")";
		}
	
	} else if($_REQUEST["i_show_acc"] == 2) { // บัญชีย่อย
	
		$ss_id	= explode(";", $_REQUEST["dc_acc_id"]);
		if( !in_array("0", $ss_id ) ) {
			$in	= "";
			foreach( $ss_id as $val ) { $in	.= ( $in == "" )? $val : ", ".$val; }
			$con	.= " AND e.dc_acc_id IN (".$in.")";
		}
	
	}
	
	$sqlMain = "SET NOCOUNT ON;
				DECLARE @d_begin AS VARCHAR(10) = '" . $_REQUEST ["date_start"] . "';
				DECLARE @d_end AS VARCHAR(10) = '" . $_REQUEST ["date_end"] . "';
				DECLARE @i_year AS INT = '" . $_REQUEST ["year"] . "';
						
				SELECT
					dtl_id
					,table_name
					,CONVERT(VARCHAR(10), d_date, 120) AS d_date
					,ROW_NUMBER() OVER (PARTITION BY d_date, c_approve, dc_acc_lv4_id ORDER BY d_date, c_approve, dc_acc_lv4_id) AS i_approve
					,ROW_NUMBER() OVER (PARTITION BY d_date, c_approve, dc_cheque_id, dc_acc_lv4_id_cheque ORDER BY d_date, c_approve, dc_cheque_id, dc_acc_lv4_id_cheque) AS i_cheque
					,c_approve
					,c_acc_item
					,dc_cheque_id
					,c_cheque
					,i_status
					,dc_acc_id
					,dc_acc_lv4_id
					,dc_acc_id_cheque
					,dc_acc_lv4_id_cheque
					,f_inv
					,f_cheque	
					,RIGHT('0'+CAST(YEAR(d_date) AS varchar(4)) ,4)
						+RIGHT('0'+CAST(MONTH(d_date) AS varchar(2)) ,2)
						+RIGHT('0'+CAST(DAY(d_date) AS varchar(2)) ,2) AS yyyy_mm_dd
				INTO #temp_data
				FROM
				( SELECT 
					c.imp_expense_dtl_id AS dtl_id
					,'imp_expense_hdr' AS table_name
					,c.d_pay AS d_date
					,c.c_approve
					,c.c_acc_item
					,f.dc_cheque_id
					,g.c_cheque
					,c.i_status
					,(CASE WHEN h.imp_expense_dtl_id > 0 THEN h.dc_acc_id ELSE e.dc_acc_id END) AS dc_acc_id
					,(CASE WHEN h.imp_expense_dtl_id > 0 THEN h.dc_acc_lv4_id ELSE e.dc_acc_lv4_id END) AS dc_acc_lv4_id
					,e.dc_acc_id AS dc_acc_id_cheque
					,e.dc_acc_lv4_id AS dc_acc_lv4_id_cheque
					,(CASE WHEN h.imp_expense_dtl_id > 0 THEN h.f_inv ELSE c.f_inv+c.f_vat END) AS f_inv
					,f.f_cheque AS f_cheque
				FROM gl_tran_hdr a
					INNER JOIN imp_expense_hdr b ON a.gl_tran_hdr_id = b.gl_tran_hdr_id
					INNER JOIN imp_expense_dtl c ON b.imp_expense_hdr_id = c.imp_expense_hdr_id
					INNER JOIN dc_expense d ON c.dc_expense_id = d.dc_expense_id
					INNER JOIN vw_dc_acc_with_parent e ON d.dc_acc_id = e.dc_acc_id
					INNER JOIN imp_fix_acc i ON e.dc_acc_id = i.dc_acc_id
					LEFT JOIN imp_expense_dtl_cheque f ON c.imp_expense_dtl_id = f.imp_expense_dtl_id
					LEFT JOIN dc_cheque g ON f.dc_cheque_id = g.dc_cheque_id
					LEFT JOIN (
						SELECT aa.imp_expense_dtl_id
							,dd.dc_acc_id
							,dd.dc_acc_lv4_id
							,SUM(bb.f_inv+ISNULL(bb.f_vat,0)) AS f_inv
						FROM imp_expense_dtl aa
							INNER JOIN imp_expense_item bb ON aa.imp_expense_dtl_id = bb.imp_expense_dtl_id
							INNER JOIN dc_expense cc ON bb.dc_expense_id = cc.dc_expense_id
							INNER JOIN vw_dc_acc_with_parent dd ON CASE WHEN (aa.i_type_year=2) THEN ISNULL(cc.dc_acc_id_overlap,0) ELSE ISNULL(cc.dc_acc_id,0) END = dd.dc_acc_id
						GROUP BY aa.imp_expense_dtl_id, dd.dc_acc_id, dd.dc_acc_lv4_id, aa.i_type_year
					) h ON c.imp_expense_dtl_id = h.imp_expense_dtl_id
				WHERE b.i_enable = ".STATUS_ENABLE."
					AND a.i_is_post IN (2, 3) AND a.i_is_close_year = 2
					AND i.report_number = 1
					/*
					--AND c.c_budget_year = @i_year
					*/
					AND CONVERT(DATETIME, a.d_save_date, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
					{$con}
				UNION ALL
				SELECT
					c.imp_expense_vsn_dtl_id AS dtl_id
					,'imp_expense_vsn_hdr' AS table_name
					,c.d_doc AS d_date
					,c.c_approve
					,c.c_acc_item
					,f.dc_cheque_id
					,g.c_cheque
					,c.i_status
					,(CASE WHEN h.imp_expense_vsn_dtl_id > 0 THEN h.dc_acc_id ELSE e.dc_acc_id END) AS dc_acc_id
					,(CASE WHEN h.imp_expense_vsn_dtl_id > 0 THEN h.dc_acc_lv4_id ELSE e.dc_acc_lv4_id END) AS dc_acc_lv4_id
					,e.dc_acc_id AS dc_acc_id_cheque
					,e.dc_acc_lv4_id AS dc_acc_lv4_id_cheque
					,(CASE WHEN h.imp_expense_vsn_dtl_id > 0 THEN h.f_inv ELSE c.f_inv END) AS f_inv
					,f.f_cheque AS f_cheque
				FROM gl_tran_hdr a
					INNER JOIN imp_expense_vsn_hdr b ON a.gl_tran_hdr_id = b.gl_tran_hdr_id
					INNER JOIN imp_expense_vsn_dtl c ON b.imp_expense_vsn_hdr_id = c.imp_expense_vsn_hdr_id
					INNER JOIN dc_expense_acc_vsn d ON c.dc_expense_acc_vsn_id = d.dc_expense_acc_vsn_id
					INNER JOIN vw_dc_acc_with_parent e ON d.dc_acc_id = e.dc_acc_id
					INNER JOIN imp_fix_acc i ON e.dc_acc_id = i.dc_acc_id
					LEFT JOIN imp_expense_vsn_dtl_cheque f ON c.imp_expense_vsn_dtl_id = f.imp_expense_vsn_dtl_id
					LEFT JOIN dc_cheque g ON f.dc_cheque_id = g.dc_cheque_id
					LEFT JOIN (
						SELECT aa.imp_expense_vsn_dtl_id
							,dd.dc_acc_id
							,dd.dc_acc_lv4_id
							,SUM(bb.f_inv) AS f_inv
						FROM imp_expense_vsn_dtl aa
							INNER JOIN imp_expense_vsn_item bb ON aa.imp_expense_vsn_dtl_id = bb.imp_expense_vsn_dtl_id
							INNER JOIN dc_expense_acc_vsn cc ON bb.dc_expense_acc_vsn_id = cc.dc_expense_acc_vsn_id
							INNER JOIN vw_dc_acc_with_parent dd ON CASE WHEN (aa.i_type_year=2) THEN ISNULL(cc.dc_acc_id_overlap,0) ELSE ISNULL(cc.dc_acc_id,0) END = dd.dc_acc_id
						GROUP BY aa.imp_expense_vsn_dtl_id, dd.dc_acc_id, dd.dc_acc_lv4_id, aa.i_type_year
					) h ON c.imp_expense_vsn_dtl_id = h.imp_expense_vsn_dtl_id
				WHERE b.i_enable = ".STATUS_ENABLE."
					AND a.i_is_post IN (2, 3) AND a.i_is_close_year = 2
					AND i.report_number = 1
					/*
					--AND c.c_budget_year = @i_year
					*/
					AND CONVERT(DATETIME, a.d_save_date, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
					{$con}
				) a
				/*WHERE dc_cheque_id IS NULL*/ 
				
				SELECT * FROM #temp_data ORDER BY d_date, c_approve, c_cheque;";
	
	$arrParam	= array();
	$stmt = $db->QueryParam ( $sqlMain, $arrParam );
	if ($stmt) {
		while ( $row = $db->Fetch ( $stmt ) ) {
			
			$Arr[$row["yyyy_mm_dd"]]["d_date"]			= $date->shot_date_from_db($row["d_date"]);
			
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["d_date"]			= $date->shot_date_from_db($row["d_date"]);
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["i_status"]			= $row["i_status"];
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["c_approve"]		= $row["c_approve"];
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["c_name"]			= $row["c_acc_item"];
			
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["data"][$row["dc_acc_lv4_id"]]["dc_acc_lv4_id"]		= $row["dc_acc_lv4_id"];
			$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["data"][$row["dc_acc_lv4_id"]]["f_inv"]				= $row["f_inv"];
			
			if($row["dc_cheque_id"] > 0) {
				$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["cheque"][$row["dc_cheque_id"]]["i_status"]		= $row["i_status"];
				$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["cheque"][$row["dc_cheque_id"]]["c_cheque"]		= $row["c_cheque"];
				
				$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["cheque"][$row["dc_cheque_id"]]["data"][$row["dc_acc_lv4_id_cheque"]]["dc_acc_lv4_id"]		= $row["dc_acc_lv4_id_cheque"];
				$Arr[$row["yyyy_mm_dd"]]["data"][$row["c_approve"]]["cheque"][$row["dc_cheque_id"]]["data"][$row["dc_acc_lv4_id_cheque"]]["f_cheque"]			= $row["f_cheque"];
				
				// รวมเช็ควันที่
				if($row["i_cheque"] == 1) {
					if (! isset ( $sumDate[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id_cheque"]]["f_cheque"] )) {
						$sumDate[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id_cheque"]]["f_cheque"]	= 0;
					}
					
					if($row["i_status"] == 1) {
						$sumDate[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id_cheque"]]["f_cheque"]			+= $row["f_cheque"];
					} else {
						$sumDate[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id_cheque"]]["f_cheque"]			-= $row["f_cheque"];
					}
				}
			}
			
			// รวมฎีกาวันที่
			if($row["i_approve"] == 1) {
				if (! isset ( $sumDateInv[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id"]]["f_inv"] )) {
					$sumDateInv[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id"]]["f_inv"]	= 0;
				}
				if($row["i_status"] == 1) {
					$sumDateInv[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id"]]["f_inv"]			+= $row["f_inv"];
				} else {
					$sumDateInv[$row["yyyy_mm_dd"]][$row["dc_acc_lv4_id"]]["f_inv"]			-= $row["f_inv"];
				}
			}
		}
		
		if (isset ( $Arr )) {
			foreach ( $Arr as $yyyy_mm_dd => $obj ) {
				foreach ( $obj["data"] as $c_approve => $objApprove ) {
					
					$temp	= array();
					
					$temp ["i_type"]		= 1;
					$temp ["i_status"]		= $objApprove["i_status"];
					$temp ["d_date"]		= $objApprove["d_date"];
					$temp ["c_approve"]		= $objApprove["c_approve"];
					$temp ["c_name"]		= $objApprove["c_name"];
					$temp ["data"]			= $objApprove["data"];

					${$root} [] = $temp;
					
					if(@$objApprove["cheque"]) {
						foreach ( $objApprove["cheque"] as $dc_cheque_id => $objCheque ) {
							
							$temp	= array();
								
							$temp ["i_type"]		= 2;
							$temp ["i_status"]		= $objCheque["i_status"];
							$temp ["c_cheque"]		= $objCheque["c_cheque"];
							$temp ["data"]			= $objCheque["data"];
							
							${$root} [] = $temp;							
						}
					}
				}
				
				// SUM DATE
				$temp	= array();
				
				$temp ["i_type"]		= 3;
				$temp ["d_date"]		= "<b>รวมฎีกาวันที่ ".$obj["d_date"]."</b>";
				$temp ["data"]			= $sumDateInv[$yyyy_mm_dd];
				
				${$root} [] = $temp;
				
				$temp	= array();
				
				$temp ["i_type"]		= 4;
				$temp ["d_date"]		= "<b>รวมเช็ควันที่ ".$obj["d_date"]."</b>";
				$temp ["data"]			= @$sumDate[$yyyy_mm_dd];
				
				${$root} [] = $temp;
			}
		}
	}
	return json_encode ( array ("debug" => true, "totalCount" => $totalCount,$root => ${$root} ) );
}
?>
