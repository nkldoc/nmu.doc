Ext.monthStore = new Ext.data.JsonStore({
  fields: [{ name: "id" }, { name: "c_name" }],
  data: [
    { id: "01", c_name: "มกราคม" },
    { id: "02", c_name: "กุมภาพันธ์" },
    { id: "03", c_name: "มีนาคม" },
    { id: "04", c_name: "เมษายน" },
    { id: "05", c_name: "พฤษภาคม" },
    { id: "06", c_name: "มิถุนายน" },
    { id: "07", c_name: "กรกฎาคม" },
    { id: "08", c_name: "สิงหาคม" },
    { id: "09", c_name: "กันยายน" },
    { id: "10", c_name: "ตุลาคม" },
    { id: "11", c_name: "พฤศจิกายน" },
    { id: "12", c_name: "ธันวาคม" },
  ],
});
Ext.monthNumericStore = new Ext.data.JsonStore({
  fields: [{ name: "id" }, { name: "c_name" }],
  data: [
    { id: 1, c_name: "มกราคม" },
    { id: 2, c_name: "กุมภาพันธ์" },
    { id: 3, c_name: "มีนาคม" },
    { id: 4, c_name: "เมษายน" },
    { id: 5, c_name: "พฤษภาคม" },
    { id: 6, c_name: "มิถุนายน" },
    { id: 7, c_name: "กรกฎาคม" },
    { id: 8, c_name: "สิงหาคม" },
    { id: 9, c_name: "กันยายน" },
    { id: 10, c_name: "ตุลาคม" },
    { id: 11, c_name: "พฤศจิกายน" },
    { id: 12, c_name: "ธันวาคม" },
  ],
});

Ext.monthStoreAll = new Ext.data.JsonStore({
  fields: [{ name: "id" }, { name: "c_name" }],
  data: [
    { id: "-1", c_name: "ทั้งหมด" },
    { id: "01", c_name: "มกราคม" },
    { id: "02", c_name: "กุมภาพันธ์" },
    { id: "03", c_name: "มีนาคม" },
    { id: "04", c_name: "เมษายน" },
    { id: "05", c_name: "พฤษภาคม" },
    { id: "06", c_name: "มิถุนายน" },
    { id: "07", c_name: "กรกฎาคม" },
    { id: "08", c_name: "สิงหาคม" },
    { id: "09", c_name: "กันยายน" },
    { id: "10", c_name: "ตุลาคม" },
    { id: "11", c_name: "พฤศจิกายน" },
    { id: "12", c_name: "ธันวาคม" },
  ],
  sortInfo: {
    field: "id",
    direction: "ASC",
  },
});
btn_set_color = function (ele, color_name) {
  var fullUrl = window.location.href;
  var path = window.location.pathname;
  var secondSlashIndex = path.indexOf("/", 1 + path.indexOf("/"));
  var baseUrl = fullUrl.substring(0, fullUrl.indexOf(path) + secondSlashIndex + 1);
  var imagePath = baseUrl + "dc/images/default/button/btn_color/btn-" + color_name + ".gif";

  var containerElement = document.getElementById(ele.el.id);
  var targetElement = containerElement.querySelector(".x-btn-ml");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-6px -24px";

  var targetElement = containerElement.querySelector(".x-btn-mc");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "0 -2168px";

  var targetElement = containerElement.querySelector(".x-btn-mr");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-9px -24px";

  var targetElement = containerElement.querySelector(".x-btn-tl");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-6px 0";

  var targetElement = containerElement.querySelector(".x-btn-tc");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "0 -9px";

  var targetElement = containerElement.querySelector(".x-btn-tr");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-9px 0";

  var targetElement = containerElement.querySelector(".x-btn-bl");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-6px -3px";

  var targetElement = containerElement.querySelector(".x-btn-bc");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "0 -18px";

  var targetElement = containerElement.querySelector(".x-btn-br");
  targetElement.style.backgroundImage = "url(" + imagePath + ")";
  targetElement.style.backgroundPosition = "-9px -3px";
};
Ext.Text_Encode = function (str) {
  var encoded = "";
  for (i = 0; i < str.length; i++) {
    var a = str.charCodeAt(i);
    var b = a ^ 123; // bitwise XOR with any number, e.g. 123
    encoded = encoded + String.fromCharCode(b);
  }
  return encoded;
};

Ext.Text_Decode = function (encoded) {
  var decoded = "";
  for (i = 0; i < encoded.length; i++) {
    var a = encoded.charCodeAt(i);
    var b = a ^ 123; // <-- must be same number used to encode the character
    decoded = decoded + String.fromCharCode(b);
  }
  return decoded;
};

DateNow = function () {
  var now = new Date();

  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString().padStart(2, "0");
  var day = now.getDate().toString().padStart(2, "0");
  var dateString = `${year}-${month}-${day}`;

  return dateString;
};

DateTimeNow = function () {
  var now = new Date();

  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString().padStart(2, "0");
  var day = now.getDate().toString().padStart(2, "0");
  var hour = now.getHours().toString().padStart(2, "0");
  var minute = now.getMinutes().toString().padStart(2, "0");
  var second = now.getSeconds().toString().padStart(2, "0");
  var dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return dateString;
};

error_json = function (json, par = []) {
  /********* COPY TO (success, failure)  FOR USE *****************
  Ajax [function (result, request)] :
    if (error_json(result.responseText, request.params)) return;
    
  Submit [function (form, action)] : 
    if (error_json(action.response.responseText, action.options.params)) return;
  *************************************************************/
  var error = false;
  try {
    Ext.util.JSON.decode(json);
  } catch (err) {
    error = true;
    Ext.MessageBox.alert("เกิดความผิดพลาด", "<span style='white-space:nowrap; color:red'>เกิดความผิดพลาดกรุณาติดต่อผู้ดูแลระบบ</span>");
    var par = Object.entries(par);
    params_list = "";
    par.forEach(function (v, index) {
      params_list += "\t" + par[index][0] + ": " + par[index][1] + "\n";
    });
    var error_text = "ERROR\n";
    error_text += "Time : " + new Date().toLocaleString("en-ZA") + "\n";
    error_text += "Host : " + location.host + "\n";
    error_text += "File : " + location.pathname + "\n";
    error_text += "dc_user_id : " + Ext.session.user_id + "\n";
    error_text += "dc_user_name : " + Ext.session.user_name + "\n";
    error_text += "Statement : เกิดความผิดพลาด [JSON.decode]\n";
    error_text += "params : [\n" + params_list + "];\n";
    error_text += "ErrorMsg :\n" + json + "\n";
    error_text = error_text.replaceAll("%", "");
    if (location.host == "localhost") {
      console.log(error_text);
    } else {
      Ext.Ajax.request({
        url: "https://" + location.hostname + "/nmu/lib/send_line_dev.php",
        method: "POST",
        params: {
          msg: String(error_text.substring(0, 1005)),
        },
      });
    }
  }
  return error;
};

function OpenPdf(file_id, file_name) {
  file_name = file_name.replaceAll("/", "-");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  var tap_random = "Tap_" + Math.floor(Math.random() * 100000);
  function enc(str) {
    var encoded = "";
    for (i = 0; i < str.length; i++) {
      var a = str.charCodeAt(i);
      var b = a ^ 123; // bitwise XOR with any number, e.g. 123
      encoded = encoded + String.fromCharCode(b);
    }
    return encoded;
  }
  // var Url = "https://" + location.host + "/NMU_EIS/lib/Open_Pdf.php/" + file_name + ".pdf?code_F=" + encodeURIComponent(Ext.Text_Encode(file_id.slice(0, -4))) + "&file_name=" + file_name;
  // window.open(Url);
  // return;
  var mapForm = document.createElement("form");
  mapForm.target = tap_random;
  mapForm.method = "GET"; //GET & POST
  mapForm.action = "https://" + location.host + "/NMU_EIS/lib/Open_Pdf.php/" + file_name + ".pdf?T=" + tap_random;

  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "code_F";
  // console.log(encodeURI(Ext.Text_Encode(file_id.slice(0, -4))));
  mapInput.value = encodeURIComponent(Ext.Text_Encode(file_id.slice(0, -4)));
  mapForm.appendChild(mapInput);

  var mapInput2 = document.createElement("input");
  mapInput2.type = "text";
  mapInput2.name = "file_name";
  mapInput2.value = file_name;
  mapForm.appendChild(mapInput2);

  var mapInput3 = document.createElement("input");
  mapInput3.type = "text";
  mapInput3.name = "T";
  mapInput3.value = tap_random;
  mapForm.appendChild(mapInput3);

  document.body.appendChild(mapForm);
  map = window.open("", tap_random);
  if (map) {
    mapForm.submit();
  } else {
    alert("ไฟล์ PDF มีปัญหา");
  }
}

function Progress_Default_Step(type, callback, msg_text) {
  if (type == "start" && callback) {
    var title = callback;
    Ext.progressValueDefault_34 = 0;
    Ext.progressBarDefault_34 = Ext.MessageBox.show({
      title: title,
      msg: msg_text,
      progressText: "loading...",
      width: 500,
      progress: true,
      closable: false,
    });
  }
  var timeoutId = null;
  Ext.progressValueDefault_34 += 0.01;
  Ext.progressBarDefault_34.updateProgress(Ext.progressValueDefault_34, "Status: " + Math.round(Ext.progressValueDefault_34 * 100) + "%...");
  if (type == "start") {
    if (Ext.progressValueDefault_34 <= 0.52) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 1000), "start");
    } else if (Ext.progressValueDefault_34 <= 0.61) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 1500), "start");
    } else if (Ext.progressValueDefault_34 <= 0.71) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 2000), "start");
    } else if (Ext.progressValueDefault_34 <= 0.81) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 3000), "start");
    } else if (Ext.progressValueDefault_34 <= 0.91) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 5000), "start");
    } else if (Ext.progressValueDefault_34 <= 0.94) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 30000), "start");
    } else if (Ext.progressValueDefault_34 <= 0.99) {
      timeoutId = setTimeout(Progress_Default_Step, 50 + parseInt(Ext.progressValueDefault_34 * 70000), "start");
    }
  } else if (type == "success") {
    if (Ext.progressValueDefault_34 <= 1) {
      timeoutId = setTimeout(Progress_Default_Step, 10, "success", callback);
    } else {
      Ext.progressValueDefault_34 = 0;
      Ext.progressBarDefault_34.hide();
      clearTimeout(timeoutId);
      callback();
    }
  } else if (type == "stop") {
    Ext.progressValueDefault_34 = 0;
    Ext.progressBarDefault_34.hide();
    clearTimeout(timeoutId);
    callback();
  }
}

json_FormatChack = function (json, callback_false) {
  var error = true;
  try {
    Ext.util.JSON.decode(json);
  } catch (err) {
    error = false;
    callback_false();
  }
  return error;
};

tooltip_ComboBox = function (combo, field) {
  var tooltip = new Ext.ToolTip({
    target: combo.getEl(),
    delegate: ".x-combo-list-item",
    trackMouse: true,
    renderTo: document.body,
    listeners: {
      beforeshow: function (tip) {
        var hoveredItem = tip.triggerElement;
        if (hoveredItem && combo.view && combo.getStore()) {
          var storeIndex = combo.view.indexOf(hoveredItem);
          if (storeIndex !== -1) {
            var record = combo.getStore().getAt(storeIndex);
            if (record) {
              tip.update(record.get(field));
            } else {
              tip.update("ไม่มีข้อมูลที่เลือก");
            }
          } else {
            tip.update("ไม่พบรายการใน Store");
          }
        } else {
          tip.update("กรุณาเลือกข้อมูล");
        }
      },
    },
  });

  combo.on("expand", function () {
    if (combo.view) {
      tooltip.initTarget(combo.view.getEl());
    }
  });
};

tooltip_TextField = function (textfield) {
  var tooltip = new Ext.ToolTip({
    target: textfield.getEl(),
    trackMouse: true,
    renderTo: document.body,
    dismissDelay: 0, // Tooltip ไม่หายไปเอง
    hidden: true, // ซ่อน Tooltip ก่อนเริ่มใช้งาน
    maxWidth: 300, // กำหนดขนาด Tooltip ให้แสดงข้อความยาวขึ้น
  });

  textfield.on("render", function () {
    var el = textfield.getEl();
    el.setStyle("cursor", "pointer"); // ป้องกันเมาส์กลายเป็นตัวเลือกข้อความ

    // เมื่อเมาส์ไปวางบน TextField
    el.on("mouseover", function () {
      var fieldValue = textfield.getValue();
      if (!Ext.isEmpty(fieldValue)) {
        tooltip.update(fieldValue);
        var position = el.getXY(); // ดึงพิกัดของ TextField
        tooltip.showAt([position[0] + 10, position[1] + 25]); // ปรับตำแหน่ง Tooltip
      }
    });

    // เมื่อเมาส์ออกจาก TextField
    el.on("mouseout", function () {
      tooltip.hide();
    });
  });
};

Ext.part_file_pdf = window.location.protocol + "//" + window.location.hostname;
function Po_OpenPdf(file_id, file_name) {
  file_name = file_name.replaceAll("/", "-");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  var tap_random = "Tap_" + Math.floor(Math.random() * 100000);
  if (file_id.indexOf("hdr") > 0) {
    file_name = file_name + "_" + "เอกสารใบเบิก_" + today;
  } else if (file_id.indexOf("dtl") > 0) {
    file_name = file_name + "_" + "เอกสารประกอบใบเบิก_" + today;
  } else if (file_id.indexOf("pay") > 0) {
    file_name = file_name + "_" + "เอกสารการจ่ายเงิน_" + today;
  } else if (file_id.indexOf("all") > 0) {
    file_name = file_name + "_" + "เอกสาร_" + today;
  }
  function enc(str) {
    var encoded = "";
    for (i = 0; i < str.length; i++) {
      var a = str.charCodeAt(i);
      var b = a ^ 123; // bitwise XOR with any number, e.g. 123
      encoded = encoded + String.fromCharCode(b);
    }
    return encoded;
  }
  // var Url = "http://" + location.host + "/nmu/po/api/PDF_View.php/" + file_name + ".pdf?code_F=" + enc(file_id.slice(0, -4)) + "&file_name=" + file_name;
  // window.open(Url);
  // return;
  var mapForm = document.createElement("form");
  mapForm.target = tap_random;
  mapForm.method = "GET"; //GET & POST
  mapForm.action = Ext.part_file_pdf + "/NMU_EIS/po/api/PDF_View.php/" + file_name + ".pdf?T=" + tap_random;

  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "code_F";
  mapInput.value = enc(file_id.slice(0, -4));
  mapForm.appendChild(mapInput);

  var mapInput2 = document.createElement("input");
  mapInput2.type = "text";
  mapInput2.name = "file_name";
  mapInput2.value = file_name;
  mapForm.appendChild(mapInput2);

  var mapInput3 = document.createElement("input");
  mapInput3.type = "text";
  mapInput3.name = "T";
  mapInput3.value = tap_random;
  mapForm.appendChild(mapInput3);

  document.body.appendChild(mapForm);
  map = window.open("", tap_random);
  if (map) {
    mapForm.submit();
  } else {
    alert("ไฟล์ PDF มีปัญหา");
  }
}

function getCheckedLabelsAsJson() {
  var chkContainer = Ext.getCmp("chkContainer");
  var result = [];

  Ext.each(chkContainer.items.items, function (item, index) {
    if (item.xtype === "checkbox" && item.checked) {
      // checkbox ปกติ
      result.push({
        id: index + 1,
        label: item.boxLabel,
      });
    } else if (item.xtype === "container") {
      // container ย่อย เช่น container ที่มี checkbox "อื่น ๆ" กับ textfield
      Ext.each(item.items.items, function (subItem) {
        if (subItem.xtype === "checkbox" && subItem.checked) {
          if (subItem.boxLabel.trim() === "อื่น ๆ") {
            var otherField = Ext.getCmp("otherReasonField");
            var val = "อื่น ๆ : " + otherField.getValue();
            if (val && val.trim() !== "") {
              // ใช้ id ตามตำแหน่งของ container หลัก + 1 (หรือปรับได้ตามต้องการ)
              result.push({
                id: index + 1,
                label: val,
              });
            }
          } else {
            // checkbox ปกติใน container ย่อย (ถ้ามี)
            result.push({
              id: index + 1,
              label: subItem.boxLabel,
            });
          }
        }
      });
    }
  });
  return Ext.encode(result);
}
function navigateToPage(codeStatus) {
  let basePath = "/supplies/sp/pageStatus.php?st="; // กำหนดโครงสร้าง URL หลัก
  let targetUrl = window.location.origin + basePath + codeStatus;

  console.log("🔗 Target URL:", targetUrl);

  // เปลี่ยน URL โดยไม่รีโหลดหน้า
  if (window.history.pushState) {
    window.history.pushState({ path: targetUrl }, "", targetUrl);
    console.log("✅ pushState สำเร็จ:", window.location.href);
  } else {
    console.warn("⚠️ pushState ไม่รองรับ รีเฟรชหน้าแทน...");
    window.location.href = targetUrl;
  }

  // โหลดเนื้อหาใหม่
  loadPageContent(targetUrl, codeStatus);
}

// ฟังก์ชันโหลดเนื้อหา UI โดยไม่ต้องรีเฟรช
function loadPageContent(targetUrl, codeStatus) {
  console.warn("⚠️ ไม่พบ contentPanel รีเฟรชหน้าแทน...");
  // window.location.href = targetUrl;
  Ext.Ajax.request({
    url: "../access/setST.php",
    method: "POST",
    params: { st: codeStatus },
    success: function (response) {
      window.top.location.href = " https://eis.nmu.ac.th:8443/supplies#sp/pageStatus";
    },
  });
  // https://eis.vajira.ac.th:8443/supplies#sp/pageStatus?st=ST1006
  // index.php#sp/pageStatus
  // window.parent.location.reload();
}

function copyToClipboardCode(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  var selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  Ext.example.msg("Copied to Clipboard.&nbsp;", "- คัดลอกไปยังคลิปบอร์ดสำเร็จ", 1);
  $(this).next("text copied");
  setTimeout(function () {
    $(this).next().remove();
  }, 2000);
}

/* ========= Ext.ux.attachRowTooltip v1.2 (ExtJS 3.4) ========= */
Ext.namespace("Ext.ux");

Ext.ux.attachRowTooltip = function (grid, opts) {
  opts = opts || {};
  var view = grid.getView();
  if (!view) return;

  if (grid.__rowTip) {
    grid.__rowTip.destroy();
    grid.__rowTip = null;
  }

  var tip = new Ext.ToolTip({
    renderTo: Ext.getBody(),
    target: view.mainBody,
    delegate: ".x-grid3-row",
    trackMouse: opts.trackMouse !== false,
    showDelay: opts.showDelay || 120,
    hideDelay: opts.hideDelay || 150,
    dismissDelay: 0,
    autoHide: true,
    maxWidth: 550,
    shadow: true,
    cls: "grid-row-qtip",
    style: "padding:8px 10px;",
    // สำคัญ: บังคับให้ header/body ถูกประกอบตั้งแต่แรก
    title: "&nbsp;",
    html: " ",
  });

  function applyTpl(tpl, rec) {
    try {
      if (!tpl) return "";
      if (tpl.apply) return tpl.apply(rec.data);
      if (Ext.isFunction(tpl)) return tpl(rec);
      if (Ext.isString(tpl)) return new Ext.XTemplate(tpl).apply(rec.data);
    } catch (e) {}
    return "";
  }
  view.mainBody.on("mouseleave", function () {
    if (tip.isVisible()) tip.hide();
  });
  tip.on("beforeshow", function (t) {
    var rowEl = t.triggerElement;
    if (!rowEl) return false;

    var rowIndex = view.findRowIndex(rowEl);
    if (rowIndex === false || rowIndex == null) return false;

    var rec = grid.getStore().getAt(rowIndex);
    if (!rec) return false;

    var titleHtml = applyTpl(opts.titleTpl, rec);
    var bodyHtml = opts.bodyFn ? opts.bodyFn(rec) : applyTpl(opts.bodyTpl, rec);

    if (!titleHtml && !bodyHtml) return false;

    // header ถูกสร้างแน่นอนแล้วเพราะเราตั้ง title ตั้งแต่แรก
    if (titleHtml) {
      t.setTitle(String(titleHtml));
      if (t.header) t.header.show();
    } else {
      // ซ่อน header แต่ยังคง element ไว้ ป้องกัน doAutoWidth crash
      t.setTitle("&nbsp;");
      if (t.header) t.header.hide();
    }

    t.update(String(bodyHtml || " "));
    return true;
  });

  grid.__rowTip = tip;
  grid.on("beforedestroy", function () {
    if (grid.__rowTip) {
      grid.__rowTip.destroy();
      grid.__rowTip = null;
    }
  });

  return tip;
};
