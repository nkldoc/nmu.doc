// เรียกใช้: openReportPopup();

function openReportPopup() {
  // --- สร้างสไตล์สำหรับการ์ด (ครั้งเดียว) ---
  if (!openReportPopup._styled) {
    Ext.util.CSS.createStyleSheet(
      [
        ".report-grid{display:flex;flex-wrap:wrap;gap:12px;padding:6px;}",
        ".report-card{width:240px;border:1px solid #d9d9d9;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);cursor:pointer;transition:all .15s;}",
        ".report-card:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.12);}",
        ".report-head{display:flex;align-items:center;gap:10px;padding:12px 12px 4px 12px;}",
        ".report-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;}",
        ".report-icon img{max-width:100%;max-height:100%;}",
        ".report-title{font-weight:bold;font-size:14px;}",
        ".report-desc{color:#666;font-size:12px;padding:0 12px 10px 12px;min-height:32px;}",
        ".report-foot{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f7f7f7;border-top:1px solid #eee;}",
        ".report-btn{background:#3f51b5;color:#fff;border:none;border-radius:6px;padding:6px 10px;font-size:12px;}",
        ".report-btn:hover{opacity:.9;}",
        ".report-tag{font-size:11px;color:#3f51b5;}",
        ".report-empty{padding:30px;color:#999;text-align:center;}",
        ".search-wrap{padding:10px 10px 0 10px;}",
        ".search-wrap .x-form-field{height:24px;}",
      ].join("\n"),
      "report-tile-style",
    );
    openReportPopup._styled = true;
  }

  // --- ข้อมูลรายการรายงาน (แก้ url ได้ตามจริง) ---
  var reportStore = new Ext.data.JsonStore({
    fields: ["id", "title", "desc", "icon", "url", "tag"],
    data: [
      { id: "budget", title: "กราฟงบประมาณ", desc: "ภาพรวมงบ รายได้/กทม./อุดหนุน", icon: "dc/images/icons/billing-icon-baht.png", url: "bi/reports/Budget_Monitoring_Dashboard.php", tag: "งบประมาณ" },
      // { id:'budget2',  title:'กราฟงบประมาณ',        desc:'ภาพรวมงบ ', icon:'dc/images/icons/billing-icon.png', url:'bi/reports/Rep_RepBIBg_Expense.php',  tag:'งบประมาณ' },
      { id: "status", title: "สถานะการดำเนินงาน", desc: "รอดำเนินการ → เบิกจ่ายแล้ว", icon: "images/management.png", url: "bi/reports/Report_ChartStatus.php", tag: "สถานะ" },
      {
        id: "tortype",
        title: "วิธีการดำเนินงาน",
        desc: "e-Bidding / คัดเลือก / เฉพาะเจาะจง",
        icon: "dc/images/default/tree/folder-open.gif",
        url: "bi/reports/Report_ChartTorType_New.php",
        tag: "วิธีดำเนินงาน",
      },
      { id: "dept", title: "รายงานตามหน่วยงาน", desc: "เปรียบเทียบผลงานแต่ละภาควิชา", icon: "dc/images/folder.gif", url: "Report_ChartByDept.html", tag: "แผนก" },
      { id: "emp", title: "รายงานตามผู้รับผิดชอบ", desc: "โหลดเฉพาะผู้รับผิดชอบแต่ละคน", icon: "dc/images/default/tree/leaf.gif", url: "Report_ChartByEmp.html", tag: "บุคลากร" },
      { id: "empKPI", title: "รายงาน KPI", desc: "โหลดรายงาน KPI", icon: "images/kpi.png", url: "bi/reports/Key_Performance_Indicator.php", tag: "บุคลากร" },
      { id: "torstart", title: "สรุปข้อมูลรายปี", desc: "ตารางสรุปข้อมูลรายปี", icon: "images/Performance.jpg", url: "bi/reports/Yearly_PR_Performance_Summary.php", tag: "ฝ่าย" },
      { id: "Reply", title: "รายการทักท้วง", desc: "รายการทักท้วง", icon: "images/reply.png", url: "bi/reports/Report_StatusReply.php", tag: "ฝ่าย" },
    ],
  });

  // --- แม่แบบการ์ด ---
  var tpl = new Ext.XTemplate(
    '<div class="report-grid">',
    '<tpl for=".">',
    '<div class="report-card" data-id="{id}">',
    '<div class="report-head">',
    '<div class="report-icon"><img src="{icon}" border="0" /></div>',
    '<div class="report-title">{title}</div>',
    "</div>",
    '<div class="report-desc">{desc}</div>',
    '<div class="report-foot">',
    '<span class="report-tag">{tag}</span>',
    '<button class="report-btn">เปิดรายงาน</button>',
    "</div>",
    "</div>",
    "</tpl>",
    '<tpl if="values.length === 0">',
    '<div class="report-empty">ไม่พบรายการที่ค้นหา</div>',
    "</tpl>",
    "</div>",
  );

  // --- DataView แสดงการ์ด ---
  var dv = new Ext.DataView({
    store: reportStore,
    tpl: tpl,
    autoHeight: true,
    itemSelector: ".report-card",
    overClass: "x-view-over",
    emptyText: '<div class="report-empty">ไม่พบรายการ</div>',
    listeners: {
      click: function (view, index, node, e) {
        var rec = view.getRecord(node);
        var target = e.getTarget("button.report-btn", 3, true); // ถ้ากดปุ่ม
        // กดตรงไหนของการ์ดก็ไปเหมือนกัน
        if (rec) {
          window.open(rec.get("url"), "_blank");
        }
      },
      dblclick: function (view, index, node) {
        var rec = view.getRecord(node);
        if (rec) window.open(rec.get("url"), "_blank");
      },
    },
  });

  // --- ฟิลด์ค้นหา ---
  var searchField = new Ext.form.TextField({
    emptyText: "ค้นหาชื่อ/ป้ายกำกับ…",
    width: 260,
    listeners: {
      change: doFilter,
      keyup: doFilter,
    },
  });

  function doFilter() {
    var q = (searchField.getValue() || "").toLowerCase();
    reportStore.filterBy(function (r) {
      var t = (r.get("title") + " " + r.get("desc") + " " + r.get("tag")).toLowerCase();
      return t.indexOf(q) !== -1;
    });
  }

  var win = new Ext.Window({
    id: "winReportSelector",
    title: "เข้าหน้ารายงาน (เลือกกราฟที่ต้องการ)",
    width: 780,
    height: 700,
    modal: true,
    layout: "fit",
    items: [
      {
        xtype: "panel",
        border: false,
        autoScroll: true,
        layout: "anchor",
        items: [
          {
            xtype: "panel",
            border: false,
            cls: "search-wrap",
            items: [searchField],
          },
          dv,
        ],
      },
    ],
    buttons: [
      {
        text: "ปิด",
        handler: function () {
          win.close();
        },
      },
    ],
  });

  win.show();
}
