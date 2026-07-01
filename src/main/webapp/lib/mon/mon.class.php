<?php
//convertTxtBath แปลง ตัวเลขเป็นตัวหนังสือไทย (ส่งจำนวนเงินบาทไม่มีทศนิยม)
//convertTxtSatang แปลง ตัวเลขเป็นสตางค์ไทย (ส่งจำนวนสตางค์อย่างเดียว)
//convertTxtEng แปลง ตัวเลขเป็นตัวหนังสืออังกฤษ
class mon{
	
	public $txt_number  =array();
	public $txt_unit    =array();
	public $counter;
	public $str;
	public $digit;      // ตัวอักษร
	public $len;
	public $temp;
	public $position;
	public $number;
	public $last;
	
	function __CONSTRUCT()
	{ 
		$this->txt_unit     =array("", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน" );
		$this->txt_number   =array("","หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า" );
		$this->str          ="";
		$this->counter      =0;
		$this->temp         =0;
	} 
	
	function __DESTRUCT()
	{ } 
	
	public function convertTxtBath($num){
		$this->str  ="";
		$this->last="";
		$this->position=0;
		$this->temp=0;
		// ==== คืนค่าจำนวนเต็ม
		$dis         = substr($num,-2);                 // ตัวเลขหลังจุดทศนิยม
		$len_dis     = strlen($dis);                    // ความยาวตัวเลขหลังจุดทศนิยม
		$dec         = str_replace(",","",$num);        // ตัวเลขที่ยังไม่ได้ตัดจุดทศนิยมออก
		$len         = strlen(str_replace(".","",$dec));// ความยาวตัวเลขที่ตัดจุดทศนิยมออก
		$decimal     = str_replace(".","",$dec);        // ตัวเลขทที่ตัดจุดทศนิยมออก
	
		$this->number= substr($decimal,0,$len-$len_dis);// เลขจำนวนเต็มที่ตัดเลขหลังจุดทศนิยมออกแล้ว
		$this->len   = strlen($this->number);           // ความยาวเลขจำนวนเต็มที่ตัดเลขหลังจุดทศนิยมออกแล้ว
	
		for ($ii = $this->len-1; $ii > -1; $ii--){
			// increment counter by 1 (เพิ่มค่าตัวนับในตำแหน่งที่วนลูป)
			$this->counter++;
			if ($this->temp == 7 ) $this->temp =1;          // เมื่อตำแหน่งตัวเลขมากกว่าหลักล้าน ให้ย้อนกลับเป็นหลักสิบ (ทำไมไม่เป็นหลักหน่วย? เนื่องจากเลขจากหลักล้านไปแล้ว ตัวต่อไปจะเหมือนกับหลักสิบ เช่น 10,000,000 เราจะเห็นว่าเลข 1 คือหลักสิบ)
			$this->ch             =$this->number[$ii];      // ดึงตัวเลขออกจากตำแหน่งที่เจอ
	
			$this->digit    =$this->txt_number[$this->ch];  // แปลงเป็นตัวอักษร
	
			$this->position =$this->temp+1;                 // หาตำแหน่งที่จริงของตัวเลข
	
			if ($this->position ==2 && $this->ch==1)
				$this->digit ="";                           // หากเป็นหลักสิบ และตัวเลขที่เจอเป็น 1 ไม่ให้แสดงตัวอักษร คำว่า หนึ่ง เนื่องจากเราจะไม่อ่านว่า หนึ่งสิบ
			else if ($this->position == 2 && $this->ch==2)
				$this->digit ="ยี่";                        // หากเป็นหลักสิบ และตัวเลขที่เจอเป็น 2 ให้แสดงตัวอักษร คำว่า ยี่สิบ
			else if (($this->position ==1 || $this->position ==7) && ($this->ch==1 && $this->len > $this->counter) )
				$this->digit ="เอ็ด";
	
			$this->last   = $this->txt_unit[$this->temp];
	
			if ($this->ch ==0 && $this->position != 7)  $this->last ="";    // ถ้าตัวเลขที่พบเป็น 0 และไม่ใช่หลักล้าน ไม่ให้แสดงอักษรของหลัก
	
			$this->str = $this->digit.$this->last.$this->str;               // เอาค่าที่หาได้มาต่อกับ str โดยต่อจากข้างหน้าไปเรื่อยๆ
	
			$this->temp++; // เพิ่มค่าหลักเลขที่เริ่มจากหน่วย(0) ถึง ล้าน(6)
	
		} // === end for ii
	
		return $this->str;
	} // === end convert
	
	public function convertTxtSatang($num){
		// === คืนค่าสตางค์
		$this->temp =0;
		$this->position=0;
		$this->str  ="";
		$this->last="";
	
		$this->num =substr($num,-2);
		$this->len =strlen($this->num);
		for ($index = $this->len-1; $index > -1; $index--){
	
			//echo "<br>index=$index /num->$num";
			$this->counter++;
			$this->ch   =$this->num[$index];
			$this->digit=$this->txt_number[$this->ch];
			$this->position=$this->temp+1;
	
			if ($this->position ==2 && ($this->ch==1)){
				$this->digit  ="";
			}elseif ($this->position==2 && $this->ch==2){
				$this->digit  ="ยี่";
			}elseif ($this->position==1 && $this->ch==1){
				//$this->digit  ="เอ็ด";		//tong edit 06-01-2009
	
				$first =substr($num,0,1);
				if($first==0) $this->digit  ="หนึ่ง";
				else $this->digit  ="เอ็ด";
			}
	
			if ($this->position==2 && $this->ch==0) $this->last="";
			else $this->last = $this->txt_unit[$this->temp];
	
			$this->str  = $this->digit.$this->last.$this->str;
			$this->temp++;
		}
		return $this->str;
	} // === end convert_num
	
	public function convertTxtEng($iNum)
	{
		$sNumAsPhrase="";
		$iNum =str_replace(',','',$iNum);
		//echo "<br> ==$iNum"; exit;
	
		if ( $iNum == 0 ) return "zero";
	
		$arQuantifiers	= array(1=>'one', 2=>'two', 3=>'three', 4=>'four', 5=>'five', 6=>'six', 7=>'seven', 8=>'eight', 9=>'nine');
		$arQuantiTens	= array(2=>'twenty', 3=>'thirty', 4=>'forty', 5=>'fifty', 6=>'sixty', 7=>'seventy', 8=>'eighty', 9=>'ninety');
		$arQuantiTeens	= array(10=>'ten', 11=>'eleven', 12=>'twelve', 13=>'thirteen', 14=>'fourteen', 15=>'fifteen', 16=>'sixteen',17=>'seventeen', 18=>'eighteen', 19=>'nineteen');
		$sNumAsPhrase   = "";
	
		list ($baht, $satang) = explode (".", $iNum);
		$iNum = $baht;
		if ($satang > 0)
			$satang = substr($satang."0", 0,2);
	
		// baht;
		while (($iNumLen = strlen($iNum)) > 0)
		{
			$iFirstNum = substr($iNum,0,1);
	
			if ( $iNumLen == 11 && $iFirstNum > 0){
				$has = true;
				if ( $iFirstNum == 1 ) // Special treatment needed here
				{
					$sNumAsPhrase .= $arQuantiTeens[substr($iNum,0,2)] . " billion, ";
					$iNum = substr($iNum,2); // Remove the last two numbers essentially
					continue;
				}
				else
				{
					if ( substr($iNum,1,1) == 0 ) $sNumAsPhrase .= $arQuantiTens[$iFirstNum];
					else $sNumAsPhrase .= $arQuantiTens[$iFirstNum] . "-";
				}
			}
			else if ( $iNumLen == 10 && ($iFirstNum > 0 || $has == true))
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " billion, ";
				$has = false;
			}
			else if ( $iNumLen == 9 && $iFirstNum > 0)
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " hundred ";
				$has = true;
			}
			else if ( $iNumLen == 8 && $iFirstNum > 0)
			{
				if ( $iFirstNum == 1 )
				{
					$sNumAsPhrase .= $arQuantiTeens[substr($iNum,0,2)] . " million, ";
					$iNum = substr($iNum,2);
					continue;
				}
				else
				{
					if ( substr($iNum,1,1) == 0)
						$sNumAsPhrase .= $arQuantiTens[$iFirstNum] . " million, ";
					else
						$sNumAsPhrase .= $arQuantiTens[$iFirstNum] . "-" . $arQuantifiers[substr($iNum,1,1)] . " million, ";
					$iNum = substr($iNum,2);
					continue;
				}
				$has = true;
			}
			else if ( $iNumLen == 7 && ($iFirstNum > 0 || $has == true))
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " million, ";
				$has = false;
			}
			else if ( $iNumLen == 6 && $iFirstNum > 0)
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " hundred ";
				$has = true;
			}
			else if ( $iNumLen == 5 && $iFirstNum > 0)
			{
				$has = true;
				if ( $iFirstNum == 1 )
				{
					$sNumAsPhrase .= $arQuantiTeens[substr($iNum,0,2)] . " thousand, ";
					$iNum = substr($iNum,2);
					continue;
				}
				else
				{
					if ( substr($iNum,1,1) == 0)
						$sNumAsPhrase .= $arQuantiTens[$iFirstNum] . " thousand, ";
					else
						$sNumAsPhrase .= $arQuantiTens[$iFirstNum] . "-" . $arQuantifiers[substr($iNum,1,1)] . " thousand, ";
					$iNum = substr($iNum,2);
					continue;
				}
			}
			else if ( $iNumLen == 4 && ($iFirstNum > 0 || $has == true))
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " thousand, ";
				$has = false;
			}
			else if ( $iNumLen == 3 && $iFirstNum > 0)
			{
				$sNumAsPhrase .= $arQuantifiers[$iFirstNum] . " hundred ";
			}
			else if ( $iNumLen == 2 && $iFirstNum > 0)
			{
				if ( $iFirstNum == 1 ) // Special treatment needed here
				{
					$sNumAsPhrase .= $arQuantiTeens[substr($iNum,0,2)];
					$iNum = substr($iNum,2); // Remove the last two numbers essentially
					continue;
				}
				else
				{
					if ( substr($iNum,1,1) == 0 ) $sNumAsPhrase .= $arQuantiTens[$iFirstNum];
					else $sNumAsPhrase .= $arQuantiTens[$iFirstNum] . "-";
				}
			}
			else if ( $iNumLen == 1 )
			{
				if ( $iFirstNum != 0 ) $sNumAsPhrase .= $arQuantifiers[$iFirstNum];
			}
	
			$iNum = substr($iNum,1); //Remove the first number
		}
		if ($sNumAsPhrase != "")
			$sNumAsPhrase.= " baht";
	
		// satang
		while (($istLen = strlen($satang)) > 0)
		{
			$iFirstNum = substr($satang,0,1);
			if ( $istLen == 2 && $iFirstNum > 0)
			{
				if ( $iFirstNum == 1 ) // Special treatment needed here
				{
					$stAsPhrase .= "  " . $arQuantiTeens[substr($satang,0,2)];
					$satang = substr($satang,2); // Remove the last two numbers essentially
					continue;
				}
				else
				{
					if ( substr($satang,1,1) == 0 ) $stAsPhrase .= "  " . $arQuantiTens[$iFirstNum];
					else $stAsPhrase .= "  " . $arQuantiTens[$iFirstNum] . "-";
				}
			}
			else if ( $istLen == 1 )
			{
				if ( $iFirstNum != 0 ) $stAsPhrase .= $arQuantifiers[$iFirstNum];
			}
			$satang = substr($satang,1); //Remove the first number
		}
		if ($stAsPhrase != "")
			$sNumAsPhrase .= " and ".$stAsPhrase." satang";
	
		return $sNumAsPhrase;
			
	}	//end convertNum_txt_Eng
	
	public function round54($float, $digit)
	{
		
		$strF = str_replace(",","",$float);
		
		if(strpos($strF,'.')===false) $strF .= '.0';
		
		list($a, $b) = explode(".", $strF);
		$b = $b.sprintf("%0".($digit+1)."d", "0");
		
		$b = substr($b, 0, ($digit+1));
		$chkDigit = $b[$digit];
	
		$a = $a.sprintf(".%0{$digit}d", "0");
		if ($chkDigit > 4)
		{
			$v = "0.";
			for($i=1; $i <= $digit; $i++)
			{
				if ($i == $digit)
					$v .= "1";
				else
					$v .= "0";
			}
			$nb = "0.".substr($b,0,$digit);
			$b = $nb+$v;
		}
		else
			$b = "0.".substr($b,0,$digit);
	
		$float = $a+$b;
		return sprintf("%01.{$digit}f", $float);
	}
	
	public function parseFloat($ptString) { 
            if (strlen($ptString) == 0) { 
                    return false; 
            } 
            
            $pString = str_replace(" ", "", $ptString); 
            
            if (substr_count($pString, ",") > 1) 
                $pString = str_replace(",", "", $pString); 
            
            if (substr_count($pString, ".") > 1) 
                $pString = str_replace(".", "", $pString); 
            
            $pregResult = array(); 
        
            $commaset = strpos($pString,','); 
            if ($commaset === false) {$commaset = -1;} 
        
            $pointset = strpos($pString,'.'); 
            if ($pointset === false) {$pointset = -1;} 
        
            $pregResultA = array(); 
            $pregResultB = array(); 
        
            if ($pointset < $commaset) { 
                preg_match('#(([-]?[0-9]+(\.[0-9])?)+(,[0-9]+)?)#', $pString, $pregResultA); 
            } 
            preg_match('#(([-]?[0-9]+(,[0-9])?)+(\.[0-9]+)?)#', $pString, $pregResultB); 
            if ((isset($pregResultA[0]) && (!isset($pregResultB[0]) 
                    || strstr($preResultA[0],$pregResultB[0]) == 0 
                    || !$pointset))) { 
                $numberString = $pregResultA[0]; 
                $numberString = str_replace('.','',$numberString); 
                $numberString = str_replace(',','.',$numberString); 
            } 
            elseif (isset($pregResultB[0]) && (!isset($pregResultA[0]) 
                    || strstr($pregResultB[0],$preResultA[0]) == 0 
                    || !$commaset)) { 
                $numberString = $pregResultB[0]; 
                $numberString = str_replace(',','',$numberString); 
            } 
            else { 
                return false; 
            } 
            $result = (float)$numberString; 
            return $result; 
	}
}
?>