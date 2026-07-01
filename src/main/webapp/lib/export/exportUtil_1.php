<?php
class exportUtil
{
	public function __construct()
	{
	}

	public function headerExcel($filename = "download")
	{
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: inline; filename="' . $filename . '.xls"');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
	}
}
