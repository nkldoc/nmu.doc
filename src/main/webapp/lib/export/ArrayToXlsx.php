<?php
require(__DIR__ . "/PHPExcel/vendor/autoload.php");
class ArrToXlsx
{
	public function __construct()
	{
	}

	public function ArrToXlsx($data = array(), $filename = 'filename')
	{
		// $objPHPExcel = new PHPExcel();
		// $objPHPExcel->getActiveSheet()->fromArray($data, null, 'A1');
		// header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		// header('Content-Disposition: attachment;filename="' . $filename . '.xlsx"');
		// header("Cache-Control: max-age=0");
		// $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		// ob_end_clean();
		// $objWriter->save('php://output');


		$objPHPExcel = new PHPExcel();
		$objPHPExcel->getActiveSheet()->fromArray($data, null, 'A1');
		header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
		header('Content-Disposition: attachment;filename="' . $filename . '.xlsx"');
		header("Cache-Control: max-age=0");
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		ob_end_clean();
		$objWriter->save('php://output');
		exit;
	}
}
