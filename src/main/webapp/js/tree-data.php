<?PHP
echo "[{
    text:'ข้อมูลหลัก',
    expanded: true,
    children:[ {
        text:'ข้อมูลหน่วยเงิน',
        id: 'dc-DcMonUnit',
        leaf:true
    },{
        text:'ข้อมูลหน่วยธุรกิจ',
        id: 'dc-DcArea',
        leaf:true
    },{
        text:'ข้อมูลลูกค้า',
        id: 'dc-DcDebtor',
        leaf:true
    },{
        text:'สมุดรายวัน',
        id: 'gl-GlTranhdr',
        leaf:true
    }]
},{
    text:'UI ข้อมูลหลัก',
    children:[{
        text:'ข้อมูลหลักผู้ขายผู้/รับจ้าง',
        id: 'TabPanel',
        leaf:true
    },{
        text:'ข้อมูลหน่วยเงิน',
        id:'DC_MON_UNIT',
        leaf:true
    },{
        text:'ข้อมูลหน่วยธุรกิจ',
        id:'DC_AREA',
        leaf:true
    },{
        text:'ข้อมูลพนักงาน',
        id:'DC_EMP',
        leaf:true
    }]
},{
    text:'ตัวอย่าง',
    children:[{
        text:'GridPanel',
        id: 'examples-DcMonUnit',
        leaf:true
    }]
}]";
exit;
?>