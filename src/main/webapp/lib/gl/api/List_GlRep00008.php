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
	
	$con2= null;
	
	$totalCount = 0;
	$fld_show		= "";
	$group_show		= "";
	$order_show		= "";
	
	$ArrY	= array(1 => "ปีงบประมาณ", 2 => "เหลื่อมปี");
	$ArrD	= array(0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ");
	
	$mm1	= round($_REQUEST ["c_mm1"]);
	$mm2	= round($_REQUEST ["c_mm2"]);
	
	if ($_REQUEST ["i_show_month"] == 3) {
		$fld_show		= ",CONVERT(VARCHAR, b.d_date, 120) AS d_date
							,RIGHT('0'+CAST(YEAR(b.d_date) AS varchar(4)) ,4)
							+RIGHT('0'+CAST(MONTH(b.d_date) AS varchar(2)) ,2)
							+RIGHT('0'+CAST(DAY(b.d_date) AS varchar(2)) ,2) AS yyyy_mm_dd";
		$group_show		= ",b.d_date";
		$order_show		= "b.d_date,";
	}
	
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
			$con2	.= " AND c.dc_acc_lv4_id IN (".$in.")";
		}
	
	} else if($_REQUEST["i_show_acc"] == 3) { // บัญชีคุม Lv5
	
		$ss_id	= explode(";", $_REQUEST["dc_acc_id_parent_lv5"]);
		if( !in_array("0", $ss_id ) ) {
			$in	= "";
			foreach( $ss_id as $val ) { $in	.= ( $in == "" )? $val : ", ".$val; }
			$con2	.= " AND c.dc_acc_lv5_id IN (".$in.")";
		}
	
	} else if($_REQUEST["i_show_acc"] == 2) { // บัญชีย่อย
	
		$ss_id	= explode(";", $_REQUEST["dc_acc_id"]);
		if( !in_array("0", $ss_id ) ) {
			$in	= "";
			foreach( $ss_id as $val ) { $in	.= ( $in == "" )? $val : ", ".$val; }
			$con2	.= " AND c.dc_acc_id IN (".$in.")";
		}
	
	}
	
	$subSql	= "";
	if ($_REQUEST ["PAGE"] == "GlRep00008") { // ค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล (บัญชี)
		
		foreach($ArrY AS $i_type_year => $name){
				
			$year	= ($i_type_year == 1)? "@i_year" : "@i_year-1";

			// ========== GL ของ ทุกอย่างที่ไม่ใช่ BTN (auto) ========== //
			$subSql	.= ($subSql == "")? "" : "UNION ALL";
			$subSql .= "
						/* {$name} */
						SELECT
							0 AS i_deduct
							,c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date AS d_date
							,SUM(CASE WHEN month(b.d_save_date) = 1 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount1
							,SUM(CASE WHEN month(b.d_save_date) = 2 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount2
							,SUM(CASE WHEN month(b.d_save_date) = 3 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount3
							,SUM(CASE WHEN month(b.d_save_date) = 4 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount4
							,SUM(CASE WHEN month(b.d_save_date) = 5 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount5
							,SUM(CASE WHEN month(b.d_save_date) = 6 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount6
							,SUM(CASE WHEN month(b.d_save_date) = 7 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount7
							,SUM(CASE WHEN month(b.d_save_date) = 8 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount8
							,SUM(CASE WHEN month(b.d_save_date) = 9 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount9
							,SUM(CASE WHEN month(b.d_save_date) = 10 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount10
							,SUM(CASE WHEN month(b.d_save_date) = 11 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount11
							,SUM(CASE WHEN month(b.d_save_date) = 12 THEN ISNULL(c.f_dr,0) ELSE 0 END ) AS f_amount12
						FROM gl_tran_hdr b
							INNER JOIN gl_tran_dtl c ON b.gl_tran_hdr_id = c.gl_tran_hdr_id
							INNER JOIN dc_acc d ON c.dc_acc_id = d.dc_acc_id
							INNER JOIN imp_fix_acc e ON d.dc_acc_id = e.dc_acc_id
						WHERE
							b.i_enable = 1 AND b.i_is_post in (3) AND LEFT(b.c_code,1) = 'g'
							AND b.i_is_close_year = 2
							AND b.i_type = 2
							AND d.i_enable = 1
							AND c.i_type_year = {$i_type_year}
							AND c.c_budget_year = {$year}
							AND c.f_dr > 0
							AND CONVERT(DATETIME, b.d_save_date, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
							AND b.table_name IN ('imp_expense_vsn_hdr', 'imp_expense_hdr')
						GROUP BY
							c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date
						";
		}
		
	} else { // ค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล
		
		foreach($ArrY AS $i_type_year => $name){
			
			$year	= ($i_type_year == 1)? "@i_year" : "@i_year-1";
			
			$subSql	.= ($subSql == "")? "" : "UNION ALL";
			$subSql	.= "
						/*E-phys*/
						/*{$name}*/
						SELECT
							0 AS i_deduct
							,a.dc_expense_budget_type_id
							,b.dc_acc_id_report AS dc_acc_id
							,b.i_type_year
							,b.d_pay AS d_date
							,SUM(CASE WHEN month(b.d_pay) = 1 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount1
							,SUM(CASE WHEN month(b.d_pay) = 2 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount2
							,SUM(CASE WHEN month(b.d_pay) = 3 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount3
							,SUM(CASE WHEN month(b.d_pay) = 4 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount4
							,SUM(CASE WHEN month(b.d_pay) = 5 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount5
							,SUM(CASE WHEN month(b.d_pay) = 6 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount6
							,SUM(CASE WHEN month(b.d_pay) = 7 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount7
							,SUM(CASE WHEN month(b.d_pay) = 8 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount8
							,SUM(CASE WHEN month(b.d_pay) = 9 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount9
							,SUM(CASE WHEN month(b.d_pay) = 10 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount10
							,SUM(CASE WHEN month(b.d_pay) = 11 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount11
							,SUM(CASE WHEN month(b.d_pay) = 12 THEN b.f_inv+b.f_vat ELSE 0 END ) AS f_amount12
						FROM imp_expense_hdr a
							INNER JOIN vw_imp_expense_dtl_items b on a.imp_expense_hdr_id = b.imp_expense_hdr_id
							INNER JOIN dc_expense c on b.dc_expense_id = c.dc_expense_id
							INNER JOIN dc_acc d on b.dc_acc_id_report = d.dc_acc_id
							INNER JOIN imp_fix_acc e ON d.dc_acc_id = e.dc_acc_id
						WHERE a.i_enable = 1
							AND b.i_type_year = {$i_type_year}
							AND b.c_budget_year = {$year}
							AND CONVERT(DATETIME, b.d_pay, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
						GROUP BY a.dc_expense_budget_type_id, b.dc_acc_id_report, b.i_type_year, b.d_pay
						UNION ALL
						/*Vision Net*/
						SELECT
							0 AS i_deduct
							,a.dc_expense_budget_type_id
							,b.dc_acc_id_report AS dc_acc_id
							,b.i_type_year
							,b.d_doc AS d_date
							,SUM(CASE WHEN month(b.d_doc) = 1 THEN b.f_inv ELSE 0 END ) AS f_amount1
							,SUM(CASE WHEN month(b.d_doc) = 2 THEN b.f_inv ELSE 0 END ) AS f_amount2
							,SUM(CASE WHEN month(b.d_doc) = 3 THEN b.f_inv ELSE 0 END ) AS f_amount3
							,SUM(CASE WHEN month(b.d_doc) = 4 THEN b.f_inv ELSE 0 END ) AS f_amount4
							,SUM(CASE WHEN month(b.d_doc) = 5 THEN b.f_inv ELSE 0 END ) AS f_amount5
							,SUM(CASE WHEN month(b.d_doc) = 6 THEN b.f_inv ELSE 0 END ) AS f_amount6
							,SUM(CASE WHEN month(b.d_doc) = 7 THEN b.f_inv ELSE 0 END ) AS f_amount7
							,SUM(CASE WHEN month(b.d_doc) = 8 THEN b.f_inv ELSE 0 END ) AS f_amount8
							,SUM(CASE WHEN month(b.d_doc) = 9 THEN b.f_inv ELSE 0 END ) AS f_amount9
							,SUM(CASE WHEN month(b.d_doc) = 10 THEN b.f_inv ELSE 0 END ) AS f_amount10
							,SUM(CASE WHEN month(b.d_doc) = 11 THEN b.f_inv ELSE 0 END ) AS f_amount11
							,SUM(CASE WHEN month(b.d_doc) = 12 THEN b.f_inv ELSE 0 END ) AS f_amount12
						FROM imp_expense_vsn_hdr a
							INNER JOIN vw_imp_expense_vsn_dtl_items b on a.imp_expense_vsn_hdr_id = b.imp_expense_vsn_hdr_id
							INNER JOIN dc_expense_acc_vsn c on b.dc_expense_acc_vsn_id = c.dc_expense_acc_vsn_id
							INNER JOIN dc_acc d on b.dc_acc_id_report = d.dc_acc_id
							INNER JOIN imp_fix_acc e ON d.dc_acc_id = e.dc_acc_id
						WHERE a.i_enable = 1
							AND b.i_type_year = {$i_type_year}
							AND b.c_budget_year = {$year}
							AND CONVERT(DATETIME, b.d_doc, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
						GROUP BY a.dc_expense_budget_type_id, b.dc_acc_id_report, b.i_type_year, b.d_doc
						";
		}
	}
	
	foreach($ArrY AS $i_type_year => $name){
	
		$year	= ($i_type_year == 1)? "@i_year" : "@i_year-1";

		foreach($ArrD AS $i_return => $d_name){
			
			// ========== BTN ที่บันทึกบัญชี GX/GL แล้ว เฉพาะรหัส+ชื่อผังบัญชี และยอดเงินที่บันทึกบัญชี  ========== //
			$fld = ($i_return == 0)? "f_dr" : "f_cr"; // เฉพาะ ผังบัญชี = 1, เฉพาะ ผังบัญชี [หักส่งคืน] = 2
			$subSql	.= ($subSql == "")? "" : "UNION ALL";
			$subSql	.= "
						/*BTN เฉพาะ {$d_name}*/
						/* {$name} */
						SELECT
							{$i_return} AS i_deduct
							,c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date AS d_date
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 1 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount1
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 2 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount2
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 3 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount3
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 4 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount4
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 5 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount5
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 6 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount6
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 7 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount7
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 8 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount8
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 9 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount9
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 10 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount10
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 11 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount11
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 12 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount12
						FROM gl_bank a
							INNER JOIN gl_tran_hdr b ON a.gl_tran_hdr_id = b.gl_tran_hdr_id
							INNER JOIN gl_tran_dtl c ON c.gl_tran_hdr_id = b.gl_tran_hdr_id
							INNER JOIN dc_acc d ON d.dc_acc_id = c.dc_acc_id
							INNER JOIN imp_fix_acc e ON d.dc_acc_id = e.dc_acc_id
						WHERE a.i_enable = 1 AND LEFT(a.c_code,3) = 'btn' AND b.table_name = 'gl_bank'
							AND b.i_enable = 1 AND b.i_is_post > 1 AND LEFT(b.c_code,1) = 'g'
							AND b.i_is_close_year = 2
							AND ISNULL(c.{$fld},0) > 0
							AND b.i_type = 2
							AND d.i_enable = 1
							AND c.i_type_year = {$i_type_year}
							AND c.c_budget_year = {$year}
							AND CONVERT(DATETIME, b.d_save_date, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
							".(($i_return > 0)? " AND c.i_return = ".$i_return : "")." 
						GROUP BY
							c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date
						";

			// ========== GX ของ ทุกอย่างที่ไม่ใช่ BTN เฉพาะ ผังบัญชี (manual) ========== //
			$subSql	.= ($subSql == "")? "" : "UNION ALL";
			$subSql .= "
						/*ฝั่ง GX ของ ทุกอย่างที่ไม่ใช่ BTN เฉพาะ {$d_name}*/
						/* {$name} */
						SELECT
							{$i_return} AS i_deduct
							,c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date AS d_date
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 1 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount1
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 2 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount2
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 3 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount3
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 4 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount4
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 5 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount5
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 6 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount6
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 7 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount7
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 8 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount8
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 9 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount9
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 10 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount10
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 11 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount11
							,".(($i_return == 0)? "" : "-(")."SUM(CASE WHEN month(b.d_save_date) = 12 THEN ISNULL(c.{$fld},0) ELSE 0 END )".(($i_return == 0)? "" : ")")." AS f_amount12
						FROM gl_tran_hdr b
							INNER JOIN gl_tran_dtl c ON b.gl_tran_hdr_id = c.gl_tran_hdr_id
							INNER JOIN dc_acc d ON c.dc_acc_id = d.dc_acc_id
							INNER JOIN imp_fix_acc e ON d.dc_acc_id = e.dc_acc_id
						WHERE
							b.i_enable = 1 AND b.i_is_post > 1 AND LEFT(b.c_code,1) = 'g'
							AND b.i_is_close_year = 2
							AND ISNULL(c.{$fld},0) > 0
							AND b.i_type = 1
							AND d.i_enable = 1
							AND c.i_type_year = {$i_type_year}
							AND c.c_budget_year = {$year}
							AND CONVERT(DATETIME, b.d_save_date, 102) BETWEEN CONVERT(DATETIME, @d_begin, 102) AND CONVERT(DATETIME, @d_end, 102)
							".(($i_return > 0)? " AND c.i_return = ".$i_return : "")." 
						GROUP BY
							c.dc_expense_budget_type_id
							,c.dc_acc_id
							,c.i_type_year
							,b.d_save_date
						";
		}
	}
	
	$sqlMain = "SET NOCOUNT ON;
				DECLARE @d_begin AS VARCHAR(10) = '" . $_REQUEST ["date_start"] . "';
				DECLARE @d_end AS VARCHAR(10) = '" . $_REQUEST ["date_end"] . "';
				DECLARE @i_year as int = '" . $_REQUEST ["year"] . "';
						
				SELECT * INTO #imp_data FROM({$subSql}) a
					
				SELECT
					a.dc_expense_budget_type_id
					,a.c_name AS budget_name
					{$fld_show}
					,c.dc_acc_lv3_id
					,c.c_code_lv3
					,c.c_name_lv3
					,c.dc_acc_lv4_id
					,c.c_code_lv4
					,c.c_name_lv4
					,c.dc_acc_lv5_id
					,c.c_code_lv5
					,c.c_name_lv5
					,c.dc_acc_id
					,c.c_code
					,c.c_name
					,b.i_type_year
					,b.i_deduct
					,SUM(b.f_amount1) AS f_amount1
					,SUM(b.f_amount2) AS f_amount2
					,SUM(b.f_amount3) AS f_amount3
					,SUM(b.f_amount4) AS f_amount4
					,SUM(b.f_amount5) AS f_amount5
					,SUM(b.f_amount6) AS f_amount6
					,SUM(b.f_amount7) AS f_amount7
					,SUM(b.f_amount8) AS f_amount8
					,SUM(b.f_amount9) AS f_amount9
					,SUM(b.f_amount10) AS f_amount10
					,SUM(b.f_amount11) AS f_amount11
					,SUM(b.f_amount12) AS f_amount12
				FROM vw_dc_expense_budget_type a
					INNER JOIN (
						SELECT aa.* FROM #imp_data aa WHERE aa.i_deduct = 0
						UNION ALL
						SELECT bb.* FROM #imp_data bb WHERE bb.i_deduct IN (1,2,3)) b ON a.dc_expense_budget_type_id = b.dc_expense_budget_type_id
					LEFT JOIN vw_dc_acc_with_parent c ON b.dc_acc_id = c.dc_acc_id
				WHERE a.i_enable=?
					{$con2}
					{$con}
				GROUP BY a.dc_expense_budget_type_id
					,c.dc_acc_lv3_id ,c.c_code_lv3 ,c.c_name_lv3
					,c.dc_acc_lv4_id ,c.c_code_lv4 ,c.c_name_lv4
					,c.dc_acc_lv5_id ,c.c_code_lv5 ,c.c_name_lv5
					,c.dc_acc_id ,c.c_code ,c.c_name
					,a.c_name, b.i_type_year, b.i_deduct
					{$group_show}
				ORDER BY
					{$order_show}
					c.c_code_lv3,c.c_code_lv4,c.c_code_lv5,b.i_deduct;";
						
	$arrParam [] = STATUS_ENABLE;
	
	$stmt = $db->QueryParam ( $sqlMain, $arrParam );
	
	if ($stmt) {
		
		while ( $row = $db->Fetch ( $stmt ) ) {
			
			$yyyy_mm_dd	= ($_REQUEST ["i_show_month"] == 3)? $row["yyyy_mm_dd"] : 0;
			
			$Arr[$yyyy_mm_dd]["d_date"]	= @$row["d_date"];
			
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["c_code_lv3"]	= $row["c_code_lv3"];
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["c_name_lv3"]	= $row["c_name_lv3"];
				
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row ["dc_acc_lv4_id"]]["c_code_lv4"]	= $row["c_code_lv4"];
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row ["dc_acc_lv4_id"]]["c_name_lv4"]	= $row["c_name_lv4"];
				
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["c_code_lv5"] = $row["c_code_lv5"];
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["c_name_lv5"] = $row["c_name_lv5"];
				
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["c_code_lv6"] = $row ["c_code"];
			$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["c_name_lv6"] = $row ["c_name"];
			
			for($ii=$mm1;$ii<=$mm2;$ii++) {
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["data"][$row["i_deduct"]][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = $row ["f_amount".$ii];
				
				// ============= รวม ============= //
				// รวมท้ายรายงาน
				if (! isset ( $sum["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$sum["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}				
				// วันที่
				if (! isset ( $Arr[$yyyy_mm_dd]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 3
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 4
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 5
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 6
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				
				$sum["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]]["data"][$row["dc_acc_id"]]["sum_total"][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				
				// ================== แยกเงินบัญชี , หัก ส่งคืน ================== //
				$c_de	= "sum".$row["i_deduct"];
				
				// รวมท้ายรายงาน
				if (! isset ( $sum[$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$sum[$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// วันที่
				if (! isset ( $Arr[$yyyy_mm_dd][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 3
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 4
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				// LV 5
				if (! isset ( $Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] )) {
					$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] = 0;
				}
				
				$sum[$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
				$Arr[$yyyy_mm_dd]["data"][$row["dc_acc_lv3_id"]]["data"][$row["dc_acc_lv4_id"]]["data"][$row["dc_acc_lv5_id"]][$c_de][$row["dc_expense_budget_type_id"]] [$row ["i_type_year"]] ["f_amount".$ii] += $row ["f_amount".$ii];
			}
		}
		
		if (isset ( $Arr )) {
			
			foreach ( $Arr as $yyyy_mm_dd => $objDay ) {
				if($_REQUEST ["i_show_month"] == 3) {
					$temp = array ("i_type" => 1, "d_date" => $date->shot_date_from_db($objDay["d_date"]) );
					${$root} [] = $temp;
				}

				// LV3
				foreach ( $objDay["data"] as $lv3_id => $obj_lv3 ) {
					$temp = array ( "i_type" => 2, "c_name" => $obj_lv3["c_code_lv3"]." ".$obj_lv3["c_name_lv3"]  );
					${$root} [] = $temp;
					
					// LV4
					foreach ( $obj_lv3["data"] as $lv4_id => $obj_lv4 ) {						
						$temp = array ( "i_type" => 3, "c_name" => $obj_lv4["c_code_lv4"]." ".$obj_lv4["c_name_lv4"] );
						${$root} [] = $temp;

						// LV5
						foreach ( $obj_lv4["data"] as $lv5_id => $obj_lv5 ) {
							$temp = array ( "i_type" => 4, "c_name" => $obj_lv5["c_code_lv5"]." ".$obj_lv5 ["c_name_lv5"] );								
							${$root} [] = $temp;
							
							// LV6
							foreach ( $obj_lv5 ["data"] as $lv6_id => $obj_lv6 ) {								
								
								if(@$obj_lv6["data"][0]) {
									$temp	= array();
									
									$temp ["i_type"] = 5;
									$temp ["c_name"] = $obj_lv6["c_code_lv6"]." ".$obj_lv6["c_name_lv6"];
									
									foreach ( $obj_lv6["data"][0] as $budget_id1 => $obj_budget1 ) { $temp["data"]["budget_id"][$budget_id1] = $obj_budget1; }
									${$root} [] = $temp;
								}
								
								$chk	= false;
								foreach ($ArrD AS $kk => $vv) {
									if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
										if(@$obj_lv6["data"][$kk]) {
											$chk	= true;
											$temp	= array();
											
											$temp ["i_type"] = 6;
											$temp ["c_name"] = $vv;
											foreach ( $obj_lv6["data"][$kk] as $budget_id2 => $obj_budget2 ) { $temp["data"]["budget_id"][$budget_id2] = $obj_budget2; }
											${$root} [] = $temp;
										}
										
										if($kk == 3 && $chk == true) {
											// เงินรวม
											$temp = array ();
												
											$temp ["i_type"]	= 7;
											$temp ["c_name"]	= $obj_lv6["c_code_lv6"]." ".$obj_lv6["c_name_lv6"];
											foreach ( $obj_lv6["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
											${$root} [] = $temp;
										}
									}
								}
							}
							
							// =================== SUM LV 5 =================== //
							if(@$obj_lv5["sum0"]) { // sum บัญชี Lv 5									
								$temp = array ();
									
								$temp ["i_type"]	= 8;
								$temp ["c_name"]	= "<font color=red>Lv 5</font> รวม ".$obj_lv5["c_code_lv5"]." ".$obj_lv5["c_name_lv5"];
								foreach ( $obj_lv5["sum0"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
								${$root} [] = $temp;
							}
							
							$chk	= false;
							foreach ($ArrD AS $kk => $vv) {
								if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
									if(@$obj_lv5["sum".$kk]) {
										$chk	= true;
										$temp = array ();
											
										$temp ["i_type"]	= 9;
										$temp ["c_name"]	= "รวม ".$vv;
										foreach ( $obj_lv5["sum".$kk] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
										${$root} [] = $temp;
									}
									
									if($kk == 3 && $chk == true) {
										// เงินรวม
										$temp = array ();
									
										$temp ["i_type"]	= 10;
										$temp ["c_name"]	= "รวม ".$obj_lv5["c_name_lv5"];
										foreach ( $obj_lv5["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
										${$root} [] = $temp;
									}
								}
							}
						}
						
						// =================== SUM LV 4 =================== //
						if(@$obj_lv4["sum0"]) { // sum บัญชี Lv4
							$temp = array ();
								
							$temp ["i_type"]	= 11;
							$temp ["c_name"]	= "<font color=red>Lv 4</font> รวม ".$obj_lv4["c_code_lv4"]." ".$obj_lv4["c_name_lv4"];
							foreach ( $obj_lv4["sum0"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
							${$root} [] = $temp;
						}
						
						$chk	= false;
						foreach ($ArrD AS $kk => $vv) {
							if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
								if(@$obj_lv4["sum".$kk]) {
									$chk	= true;
									$temp = array ();
										
									$temp ["i_type"]	= 12;
									$temp ["c_name"]	= "รวม ".$vv;
									foreach ( $obj_lv4["sum".$kk] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
									${$root} [] = $temp;
								}
								
								if($kk == 3 && $chk == true) {
									// เงินรวม
									$temp = array ();
										
									$temp ["i_type"]	= 13;
									$temp ["c_name"]	= "รวม ".$obj_lv4["c_name_lv4"];
									foreach ( $obj_lv4["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
									${$root} [] = $temp;
								}
							}
						}
					}
					
					// =================== SUM LV 3 =================== //
					if(@$obj_lv3["sum0"]) { // sum บัญชี Lv3
						$temp = array ();
						
						$temp ["i_type"]	= 14;
						$temp ["c_name"]	= "<font color=red>Lv 3</font> รวม ".$obj_lv3["c_code_lv3"]." ".$obj_lv3["c_name_lv3"];
						foreach ( $obj_lv3["sum0"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
						${$root} [] = $temp;
					}
					
					$chk	= false;
					foreach ($ArrD AS $kk => $vv) {
						if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
							if(@$obj_lv3["sum".$kk]) {
								$chk	= true;
								$temp = array ();
					
								$temp ["i_type"]	= 15;
								$temp ["c_name"]	= "รวม ".$vv;
								foreach ( $obj_lv3["sum".$kk] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
								${$root} [] = $temp;
							}
							
							if($kk == 3 && $chk == true) {
								// เงินรวม
								$temp = array ();
							
								$temp ["i_type"]	= 16;
								$temp ["c_name"]	= "รวม ".$obj_lv3["c_name_lv3"];
								foreach ( $obj_lv3["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
								${$root} [] = $temp;
							}
						}
					}
				}
				
				// =================== วันที่ =================== //
				if($_REQUEST["i_show_month"] == 3) {
					if(@$objDay["sum0"]) { // sum วันที่
						$temp = array ();
					
						$temp ["i_type"]	= 17;
						$temp ["c_name"]	= "รวมวันที่ ".$date->shot_date_from_db($objDay["d_date"]);
						foreach ( $objDay["sum0"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
						${$root} [] = $temp;
					}
					
					$chk	= false;
					foreach ($ArrD AS $kk => $vv) {
						if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
							if(@$objDay["sum".$kk]) {
								$chk	= true;
								$temp = array ();
									
								$temp ["i_type"]	= 18;
								foreach ( $objDay["sum".$kk] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
								${$root} [] = $temp;
							}
							
							if($kk == 3 && $chk == true) {
								// เงินรวม
								$temp = array ();
							
								$temp ["i_type"]	= 19;
								$temp ["c_name"]	= "รวม ".$vv;
								foreach ( $objDay["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
								${$root} [] = $temp;
							}
						}
					}
				}
			}
			
			// =================== รวมท้ายรายงาน =================== //
			if(@$sum["sum0"]) { // sum
				$temp = array ();
					
				$temp ["i_type"]	= 20;
				$temp ["c_name"]	= "รวมบัญชีทั้งสิ้น 	(ก่อน)";
				foreach ( $sum["sum0"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
				${$root} [] = $temp;
			}
			
			$chk	= false;
			foreach ($ArrD AS $kk => $vv) {
				if($kk > 0) { //0 => "ผังบัญชี", 1 => "หักส่งคืน", 2 => "ปรับปรุง", 3 => "ไม่ระบุ"
					if(@$sum["sum".$kk]) {
						$chk	= true;
						$temp = array ();
							
						$temp ["i_type"]	= 21;
						$temp ["c_name"]	= "รวม ".$vv;
						foreach ( $sum["sum".$kk] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
						${$root} [] = $temp;
					}
					if($kk == 3 && $chk == true) {
						// เงินรวม
						$temp = array ();
					
						$temp ["i_type"]	= 22;
						$temp ["c_name"]	= "รวมบัญชีทั้งสิ้น (หลัง)";
						foreach ( $sum["sum_total"] as $bb_id => $obj_bb ) { $temp["data"]["budget_id"][$bb_id] = $obj_bb; }
						${$root} [] = $temp;
					}
				}
			}
		}
	}
	return json_encode ( array ("debug" => true, "totalCount" => $totalCount,$root => ${$root} ) );
}
?>
