let Obj = [];

const alertSystem = function() {
  Ext.Ajax.request({
    url: "api/list_AlertSystem.php",
    method: "POST",
    params: {
      type: "get_alert_system"
    },
    success: function(result, request) {
      let jsonData = Ext.util.JSON.decode(result.responseText); //decode json
      if (jsonData.success == true) {
        Obj = jsonData.data;
        let path = Obj.find((success, index) => index === 0);
        popMsgSystem(path);
      }
    },
    failure: function(result, request) {
      Ext.MessageBox.alert("Failed", result.responseText); // connect error
    }
  });
};

const popMsgSystem = function(arr) {
  if (arr !== undefined) {
    if (localStorage.getItem("tmpPage[" + arr.file + "]") != 1) {
      new Ext.Window({
        title: "ระบบแจ้งเตือน",
        modal: true,
        border: true,
        height: Ext.getBody().getViewSize().height * 0.8,
        width: Ext.getBody().getViewSize().width * 0.8,
        html: "<iframe src='tmpUpdateVersion/pages/" + arr.file + "." + arr.type + "' style='background: #fff;' frameborder='0' width='100%' height='100%'></iframe>",
        listeners: {
          afterrender: function() {
            Obj.shift();
          },
          close: function() {
            if (Ext.getCmp("i_close[" + arr.file + "]").checked == true) {
              localStorage.setItem("tmpPage[" + arr.file + "]", 1);
            }

            let path = Obj.find((success, index) => index === 0);
            popMsgSystem(path);
          }
        },
        bbar: [
          new Ext.form.Checkbox({
            id: "i_close[" + arr.file + "]",
            boxLabel: "ไม่แสดงการแจ้งเตือนอีก",
            inputValue: 1,
            checked: false
          })
        ]
      }).show();
    } else {
      Obj.shift();
      let path = Obj.find((success, index) => index === 0);
      popMsgSystem(path);
    }
  }
};
