Ext.ns("Ext.ux.Button");
/********************************************
/************** Examples of use *************
/********************************************

*********** 1. Create component *************
  new Ext.ux.FileUpload({
    id: "upload_pdf",
    constructorForm: "frm-Add",
    uploadLabel: "เอกสาร (PDF)",
    uploadEmptyText: "กรุณาเลือกไฟล์ (.pdf)",
    buttonText: "ดาวน์โหลดเอกสาร",
    fileExt: "pdf", //for excel : "xlsx, xls"
    iconCls: "icon-pdf",
    editForm: Ext.i_status <= Ext.I_STATUS_BEFORE ? false : true,
    hideCheckbox: false,
    width: 300,
    // hidden: true,
    btnViewClick: function () {
      var path_file = Ext.PATH_EIS_BG_OVERLAP_PROVE_PDF + Ext.c_file_pdf;
      var ext = "." + path_file.split(".").pop();
      OpenPdf(path_file, "ชื่อไฟล์เอกสาร");
      // Download_File(path_file, "ชื่อไฟล์" + ext);
    },
    fileSelecte: function () {},
  }).mini, 

*********** 2. set in Ext.Ajax.request ***********
  isUpload: true, //set upload file
  form: Ext.getCmp("upload_pdf").formUpload.getForm().getEl().dom, //set from have fileuploadfield
  params: {
    i_upload_pdf: Ext.getCmp("upload_pdf").canSendFile ? 1 : 0,
  }

*********** 3. set in Msg Checker ****************
  if (Ext.getCmp("upload_pdf").canSumit == false) {
    msg += "<span style='white-space: nowrap;'>- กรุณาเลือกไฟล์ (.pdf)</span><br>";
  }

*********** 4. php code ***************************

  if ($_REQUEST['i_upload_pdf']) {
    $id = $_REQUEST["id"];
    $uploaddir = PATH_EIS_BG_OVERLAP_PROVE_PDF . date("Y-m-d") . "/";
    $fileExt = pathinfo($_FILES['upload_pdf']['name'], PATHINFO_EXTENSION);
    if (!file_exists($uploaddir)) !mkdir($uploaddir, 0777, true);
    if (!is_dir($uploaddir)) mkdir($uploaddir);

    $fileName = $id . "_bgOverProve." . $fileExt; //Set a file name for saving.
    $uploadfile = $uploaddir . $fileName;
    if (move_uploaded_file($_FILES['upload_pdf']['tmp_name'], $uploadfile) == false) {
      $re = array("reval" => 1, "success" => "Error", "msg" => "check statement : ไม่สามารถอัพโหลดไฟล์");
      //$arr_stmt[] = array('status' => 0, 'stmt' => $re);
    } else {
      $sql = "
        DECLARE @id BIGINT = ?;
        UPDATE " . DB_NMU_EIS . "dc_table
        SET c_file_pdf = '" . date("Y-m-d") . "/" . $fileName . "'
        WHERE dc_table_id = @id;
      ";
      $para = sqlsrv_query($db->conn, $sql, array($_REQUEST["id"]));
      //$arr_stmt[] = array('status' => 1, 'stmt' => $para);
    }
  }

**********************************************/

Ext.ux.FileUpload = Ext.extend(Ext.Button, {
  config: {},
  initComponent: function () {
    this.mini = this.Minipop();
    this.setReset();
    this.isUpload = true;
  },
  setReset: function (t) {},
  afterrender: function () {},
  Minipop: function () {
    var me = this;
    /******/

    var id = this.id;
    var constructorForm = this.constructorForm;

    var upload_field_temp_id = id + "_temp";
    var container_id = "con_" + id;
    var checkbox_id = "i_edit_" + id;
    var title_id = "title_" + id;
    var upload_field_id = "upload_field_" + id;
    var button_id = "btn_view_" + id;
    var form_upload_id = "form_upload_" + constructorForm;

    var title_text = this.title;
    var fileExt = this.fileExt ? this.fileExt : "";
    var editForm = this.editForm ? this.editForm : false;
    var hideCheckbox = this.hideCheckbox ? this.hideCheckbox : false;
    var upload_Label = this.uploadLabel ? this.uploadLabel : "เอกสาร (" + fileExt.toUpperCase() + ")";
    var button_text = this.buttonText ? this.buttonText : "ดาวน์โหลด";
    var hidden = this.hidden ? this.hidden : false;
    var width = this.width ? this.width : 250;
    var iconCls = this.iconCls ? this.iconCls : "icon-pdf";

    var btnViewClick = function () {};
    btnViewClick = this.btnViewClick ? this.btnViewClick : btnViewClick;

    var fileSelecte = function () {};
    fileSelecte = this.fileSelecte ? this.fileSelecte : fileSelecte;

    me.canSumit = editForm ? true : false;
    me.canSendFile = false;

    /*****/
    return {
      xtype: "container",
      id: container_id,
      layout: "hbox",
      align: "stretch",
      RemoveHeight: true,
      hidden: hidden,
      defaults: {
        xtype: "fieldset",
        flex: 1,
        margins: "0",
        padding: 0,
        autoHeight: true,
      },
      listeners: {
        afterrender: function () {
          if (!Ext.getCmp(form_upload_id)) {
            var form_upload_file = [
              {
                xtype: "form",
                id: form_upload_id,
                listeners: {
                  afterrender: function () {
                    document.getElementById(this.bodyCfg.id).style.display = "none"; // set hidden form
                    me.formUpload = this;
                  },
                },
                items: [
                  {
                    xtype: "fileuploadfield",
                    id: upload_field_temp_id,
                    name: id,
                  },
                ],
              },
            ];
            Ext.getCmp(constructorForm).add(form_upload_file);
            Ext.getCmp(constructorForm).doLayout();
          } else {
            var file_upload_field = [
              {
                xtype: "fileuploadfield",
                id: upload_field_temp_id,
                name: id,
              },
            ];
            Ext.getCmp(form_upload_id).add(file_upload_field);
            Ext.getCmp(form_upload_id).doLayout();
          }
        },
      },
      items: [
        {
          // title: title_text,
          id: title_id,
          RemoveCls: "x-box-item",
          collapsible: false,
          collapsed: false,
          border: false,
          style: {
            margin: "3px",
            padding: 0,
          },
          // hidden: hidden,
          items: [
            {
              xtype: "buttongroup",
              frame: false,
              items: [
                { xtype: "tbspacer", width: 120 },
                {
                  xtype: "checkboxgroup",
                  fieldLabel: "",
                  hidden: hideCheckbox,
                  columns: 1,
                  items: [
                    {
                      boxLabel: "",
                      id: checkbox_id,
                      inputValue: 1,
                    },
                  ],
                  listeners: {
                    render: function (c) {
                      var text_ToolTip = "<span style='white-space:nowrap;'>แก้ไขไฟล์</span>";
                      new Ext.ToolTip({
                        target: c.container.id,
                        anchor: "right",
                        html: text_ToolTip,
                      });
                    },
                    afterrender: function () {
                      if (!editForm) this.hide();
                    },
                    change: function (combo, newValue) {
                      if (newValue[0]) {
                        Ext.getCmp(upload_field_id).show();
                        if (Ext.get(Ext.getCmp(upload_field_id).fileInput.id).dom.files[0]) {
                          Ext.get(upload_field_temp_id + "-file").dom.files = Ext.get(Ext.getCmp(upload_field_id).fileInput.id).dom.files;
                        } else {
                          Ext.getCmp(upload_field_temp_id).reset();
                        }
                        if (Ext.get(upload_field_temp_id + "-file").dom.files[0]) {
                          me.canSumit = true;
                          me.canSendFile = true;
                        } else {
                          me.canSumit = false;
                          me.canSendFile = false;
                        }
                      } else {
                        Ext.getCmp(upload_field_id).hide();
                        me.canSumit = true;
                        me.canSendFile = false;
                        Ext.getCmp(upload_field_temp_id).reset();
                      }
                    },
                  },
                },
                { xtype: "tbspacer", width: 5 },
                {
                  xtype: "button",
                  id: button_id,
                  iconCls: iconCls,
                  fieldLabel: " ",
                  text: "&nbsp;" + button_text + "&nbsp;",
                  handler: function () {
                    btnViewClick();
                  },
                  listeners: {
                    afterrender: function () {
                      if (!editForm) this.hide();
                    },
                  },
                },
              ],
            },
            { xtype: "container", height: 1 },
            {
              xtype: "fileuploadfield",
              id: upload_field_id,
              // anchor: "100%",
              width: width,
              emptyText: "กรุณาเลือกไฟล์ (" + fileExt + ")",
              fieldLabel: upload_Label,
              buttonText: "",
              buttonCfg: {
                iconCls: iconCls,
              },
              listeners: {
                afterrender: function () {
                  if (editForm) this.hide();
                },
                render: function (c) {
                  if (fileExt) {
                    var fileExt_set = fileExt
                      .replace(/\s/g, "")
                      .split(",")
                      .map((ext) => `.${ext.trim()}`)
                      .join(", ");
                    document.getElementById(this.fileInput.id).accept = fileExt_set;
                  }
                  var text_ToolTip = "<span style='white-space:nowrap;'>กรุณาเลือกไฟล์ (" + fileExt + ") ขนาดไม่เกิน 500,000 (KB)</span>";
                  new Ext.ToolTip({
                    target: c.positionEl.id,
                    anchor: "top",
                    html: text_ToolTip,
                  });
                },
                fileselected: function (field, value) {
                  let file = Ext.get(this.fileInput.id).dom.files[0];
                  var file_ext = file.name.split(".").pop();
                  var file_ext_arr = fileExt
                    .replace(/\s/g, "")
                    .split(",")
                    .map((ext) => ext.toUpperCase());

                  var msg = "";
                  if (!file_ext_arr.includes(file_ext.toUpperCase())) {
                    msg = "<span style='white-space: nowrap;'>- กรุณาเลือกไฟล์ (" + fileExt + ")</span>";
                  } else if (file.size > 512000000) {
                    msg = "<span style='white-space:nowrap;'>-กรุณาเลือกไฟล์ (" + fileExt + ") ขนาดไม่เกิน 500,000 (KB)</span>";
                  }
                  if (msg == "") {
                    Ext.get(upload_field_temp_id + "-file").dom.files = Ext.get(this.fileInput.id).dom.files;
                    fileSelecte();
                  } else {
                    Ext.Msg.alert("นำเข้าไฟล์ไม่สำเร็จ!", msg);

                    this.setValue("");
                    this.fileInput.dom.value = "";
                    this.reset();

                    Ext.getCmp(upload_field_temp_id).reset();
                  }
                  if (Ext.get(upload_field_temp_id + "-file").dom.files[0]) {
                    me.canSumit = true;
                    me.canSendFile = true;
                  } else {
                    me.canSumit = false;
                    me.canSendFile = false;
                  }
                },
              },
            },
          ],
        },
      ],
    };
  }, //Mini
  show: function () {
    Ext.get("con_" + this.id).show();
  },
  hide: function () {
    Ext.get("con_" + this.id).hide();
  },
});
