/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 *
 * http://extjs.com/license
 */

/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * English Translations
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">กำลังโหลด...</div>';

if (Ext.View) {
  Ext.View.prototype.emptyText = "";
}

if (Ext.grid.Grid) {
  Ext.grid.Grid.prototype.ddText = "{0} selected row(s)";
}

if (Ext.TabPanelItem) {
  Ext.TabPanelItem.prototype.closeText = "ปิดแท็บนี้";
}

if (Ext.form.Field) {
  Ext.form.Field.prototype.invalidText = "ค่าในฟิลด์นี้ไม่ถูกต้อง";
}

if (Ext.LoadMask) {
  Ext.LoadMask.prototype.msg = "กำลังโหลด...";
}

Date.monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

Date.monthshortName = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

Date.getShortMonthName = function(month) {
  return Date.monthshortName[month].substring(0, 5);
};

Date.getLongMonthName = function(month) {
  return Date.monthNames[month].substring(0, 5);
};

Date.monthNumbers = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
};

Date.getMonthNumber = function(name) {
  return Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Date.dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

Date.getShortDayName = function(day) {
  return Date.dayNames[day].substring(0, 3);
};

if (Ext.MessageBox) {
  Ext.MessageBox.buttonText = {
    ok: "ตกลง",
    cancel: "ยกเลิก",
    yes: "ใช่",
    no: "ไม่ใช่"
  };
}

if (Ext.util.Format) {
  Ext.util.Format.date = function(v, format) {
    if (!v) return "";
    if (!(v instanceof Date)) v = new Date(Date.parse(v));
    return v.dateFormat(format || "d-m-Y");
  };
}

if (Ext.DatePicker) {
  Ext.apply(Ext.DatePicker.prototype, {
    todayText: "วันนี้",
    minText: "This date is before the minimum date",
    maxText: "This date is after the maximum date",
    disabledDaysText: "",
    disabledDatesText: "",
    monthNames: Date.monthNames,
    dayNames: Date.dayNames,
    nextText: "เดือนถัดไป (Control+Right)",
    prevText: "เดือนก่อน (Control+Left)",
    monthYearText: "เลือกเดือน (Control+Up/Down เพื่อเลื่อนปี)",
    todayTip: "{0} (Spacebar)",
    format: "d-m-Y",
    okText: "&#160;ตกลง&#160;",
    cancelText: "ยกเลิก",
    startDay: 0
  });
}

if (Ext.PagingToolbar) {
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText: "หน้า",
    afterPageText: "จาก {0}",
    firstText: "หน้าแรก",
    prevText: "หน้าก่อน",
    nextText: "หน้าถัดไป",
    lastText: "หน้าสุดท้าย",
    refreshText: "Refresh",
    displayMsg: "แสดงผล {0} - {1} จาก {2}",
    emptyMsg: "ไม่มีข้อมูล"
  });
}

if (Ext.form.TextField) {
  Ext.apply(Ext.form.TextField.prototype, {
    minLengthText: "The minimum length for this field is {0}",
    maxLengthText: "The maximum length for this field is {0}",
    blankText: "จำเป็นต้องระบุ",
    regexText: "",
    emptyText: null
  });
}

if (Ext.form.NumberField) {
  Ext.apply(Ext.form.NumberField.prototype, {
    minText: "The minimum value for this field is {0}",
    maxText: "The maximum value for this field is {0}",
    nanText: "{0} ไม่ใช่ตัวเลขที่ถูกต้อง"
  });
}

if (Ext.form.DateField) {
  Ext.apply(Ext.form.DateField.prototype, {
    disabledDaysText: "ใช้งานไม่ได้",
    disabledDatesText: "ใช้งานไม่ได้",
    minText: "The date in this field must be after {0}",
    maxText: "The date in this field must be before {0}",
    invalidText: "{0} is not a valid date - it must be in the format {1}",
    format: "d-m-Y",
    altFormats: "d/m/Y|d-m-Y|d-m-Y|d/m|d-m|dm|dmY|dmY|d|d-m-Y"
  });
}

if (Ext.form.ComboBox) {
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText: "กำลังโหลด...",
    valueNotFoundText: undefined
  });
}

if (Ext.form.VTypes) {
  Ext.apply(Ext.form.VTypes, {
    emailText: 'ต้องกรอกในรูปแบบที่อยู่อีเมล์ ตัวอย่าง "user@domain.com"',
    urlText: 'ต้องกรอกในรูปแบบ URL ตัวอย่าง "http:/' + '/www.domain.com"',
    alphaText: "กรอกได้เฉพาะตัวอักษร และ _ เท่านั้น",
    alphanumText: "กรอกได้เฉพาะตัวอักษร, ตัวเลข และ _ เท่านั้น"
  });
}

if (Ext.form.HtmlEditor) {
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText: "กรุณาระบุ URL สำหรับลิ้งค์:",
    buttonTips: {
      bold: {
        title: "ตัวหนา (Ctrl+B)",
        text: "กำหนดข้อความที่เลือกให้เป็นตัวหนา.",
        cls: "x-html-editor-tip"
      },
      italic: {
        title: "ตัวเอียง (Ctrl+I)",
        text: "กำหนดข้อความที่เลือกให้เป็นตัวเอียง.",
        cls: "x-html-editor-tip"
      },
      underline: {
        title: "ขีดเส้นใต้ (Ctrl+U)",
        text: "กำหนดข้อความที่เลือกให้ขีดเส้นใต้.",
        cls: "x-html-editor-tip"
      },
      increasefontsize: {
        title: "เพิ่มขนาดตัวอักษร",
        text: "เพิ่มขนาดตัวอักษร.",
        cls: "x-html-editor-tip"
      },
      decreasefontsize: {
        title: "ลดขนาดตัวอักษร",
        text: "ลดขนาดตัวอักษร.",
        cls: "x-html-editor-tip"
      },
      backcolor: {
        title: "เน้นสีข้อความ",
        text: "เปลี่ยนสีพื้นหลังของข้อความที่เลือกไว้.",
        cls: "x-html-editor-tip"
      },
      forecolor: {
        title: "สีข้อความ",
        text: "เปลี่ยนสีข้อความที่เลือกไว้.",
        cls: "x-html-editor-tip"
      },
      justifyleft: {
        title: "ชิดซ้าย",
        text: "จัดเรียงข้อความชิดซ้าย.",
        cls: "x-html-editor-tip"
      },
      justifycenter: {
        title: "กึ่งกลาง",
        text: "จัดเรียงข้อความกึ่งกลาง.",
        cls: "x-html-editor-tip"
      },
      justifyright: {
        title: "ชิดขวา",
        text: "จัดเรียงข้อความชิดขวา.",
        cls: "x-html-editor-tip"
      },
      insertunorderedlist: {
        title: "ลำดับ",
        text: "เริ่มตัวแสดงลำดับ.",
        cls: "x-html-editor-tip"
      },
      insertorderedlist: {
        title: "หมายเลขลำดับ",
        text: "เริ่มตัวเลขแสดงลำดับ.",
        cls: "x-html-editor-tip"
      },
      createlink: {
        title: "ลิ้งค์",
        text: "กำหนดลิ้งค์ให้กับข้อความที่เลือกไว้.",
        cls: "x-html-editor-tip"
      },
      sourceedit: {
        title: "แก้ไขโค้ด",
        text: "เป็นไปยังโหมดแก้ไขโค้ด.",
        cls: "x-html-editor-tip"
      }
    }
  });
}

if (Ext.grid.GridView) {
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText: "เรียงจากน้อยไปหามาก",
    sortDescText: "เรียงจากมากไปหาน้อย",
    lockText: "ล็อกคอลัมน์",
    unlockText: "ปลดล็อกคอลัมน์",
    columnsText: "คอลัมน์"
  });
}

if (Ext.grid.GroupingView) {
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText: "(ไม่มี)",
    groupByText: "จัดกลุ่มด้วยฟิลด์นี้",
    showGroupsText: "แสดงในกลุ่ม"
  });
}

if (Ext.grid.PropertyColumnModel) {
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText: "ชื่อ",
    valueText: "ค่า",
    dateFormat: "d-m-Y"
  });
}

if (Ext.layout.BorderLayout.SplitRegion) {
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip: "ลากเพื่อปรับขนาด.",
    collapsibleSplitTip: "ลากเพื่อปรับขนาด. ดับเบิ้ลคลิ๊กเพื่อซ่อน."
  });
}
