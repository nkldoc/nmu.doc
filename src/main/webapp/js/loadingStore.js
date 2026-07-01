chkLoadingStore = function (sto, name /*ชื่อ id form ที่ต้องการแสดง loading*/, Func, Parameter = "") {
  Ext.getCmp(name).getEl().mask("Please wait...", "x-mask-loading");
  Ext.each(sto, function (stores) {
    this.chkMask = false;
    stores.load({
      callback: function (records, operation, success) {
        this.chkMask = true;
        var chkLoading = true;
        if (success == true) {
          Ext.each(sto, function (storesChk) {
            if (storesChk.chkMask == false) {
              chkLoading = false;
            }
          });
          if (chkLoading == true) {
            Ext.getCmp(name).getEl().unmask();
            Func(Parameter);
          }
        }
      },
    });
  });
};

getStoreItems = function (store, value, itemName) {
  var index_id = store.findExact("id", "" + value + "");
  var rec = store.data.items[index_id];
  try {
    return rec.get(itemName) != undefined ? rec.get(itemName) : "";
  } catch (err) {
    return "";
  }
};
