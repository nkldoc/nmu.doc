InfoMainGridChkCode = function (tabpanel1, hid1, hid2, hid3, hid4, hid5, hid6, idCode) {
  //info
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "ผู้ที่สร้าง",
    hidden: hid1,
    sortable: true,
    dataIndex: "dc_user_create_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "วันที่สร้าง",
    hidden: hid2,
    sortable: true,
    dataIndex: "d_create",
    renderer: shortThaiDate
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "หน่วยงานผู้สร้าง",
    hidden: hid3,
    sortable: true,
    dataIndex: "dc_user_create_cost_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "ผู้แก้ไข",
    hidden: hid4,
    sortable: true,
    dataIndex: "dc_user_create_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "วันที่แก้ไข",
    hidden: hid5,
    sortable: true,
    dataIndex: "d_update",
    renderer: shortThaiDate
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "หน่วยงานผู้แก้ไข",
    hidden: hid6,
    sortable: true,
    dataIndex: "dc_user_update_cost_id"
  }));
  //view

  Ext.getCmp(tabpanel1).addColumn(
    new Ext.grid.Column({
      header: "แสดง",
      align: "center",
      id: "view",
      sortable: false,
      width: 50,
      dataIndex: "id",
      renderer: function (value, metaData, record, row, col, store, gridView) {
        var i_enable = record.get("i_enable");
        return '<img src="../images/icons/magnifier2.png"); style="cursor:pointer"/>';
      }
    })
  );

  if (user_right_add) {
    Ext.getCmp("buAdd").setDisabled(false);
  } else {
    Ext.getCmp("buAdd").setDisabled(true);
  }
     if (user_right_add) {
    //all
    // if(!Ext.isEmpty(Ext.getCmp("role-form-mode")))Ext.getCmp("role-form-mode").setValue('EDIT');
    Ext.getCmp(tabpanel1).addColumn(
      new Ext.grid.Column({
        header: "แก้ไข",
        sortable: false,
        align: "center",
        id: "edit",
        width: 50,
        dataIndex: "id",
        renderer: function (value, metaData, record, row, col, store, gridView) {
          if (record.get(idCode) != "0") return "";
          else return '<img src="../images/icons/document_edit.gif"); style="cursor:pointer"/>';
        }
      })
    );
  }
  if (user_right_delete) {
    //edit
    Ext.getCmp(tabpanel1).addColumn(
      new Ext.grid.Column({
        header: "ลบ",
        align: "center",
        id: "remove",
        sortable: false,
        width: 50,
        dataIndex: "id",
        renderer: function (value, metaData, record, row, col, store, gridView) {
          if (record.get(idCode) != "0") return "";
          else return '<img src="../images/icons/document_delete.gif"); style="cursor:pointer"/>';
        }
      })
    );
  }
}; //End Function

InfoMainGrid = function (tabpanel1, hid1, hid2, hid3, hid4, hid5, hid6) {
  //info
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "ผู้ที่สร้าง",
    hidden: hid1,
    sortable: true,
    dataIndex: "dc_user_create_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "วันที่สร้าง",
    hidden: hid2,
    sortable: true,
    dataIndex: "d_create",
    renderer: shortThaiDate
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "หน่วยงานผู้สร้าง",
    hidden: hid3,
    sortable: true,
    dataIndex: "dc_user_create_cost_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "ผู้แก้ไข",
    hidden: hid4,
    sortable: true,
    dataIndex: "dc_user_create_id"
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "วันที่แก้ไข",
    hidden: hid5,
    sortable: true,
    dataIndex: "d_update",
    renderer: shortThaiDate
  }));
  Ext.getCmp(tabpanel1).addColumn(new Ext.grid.Column({
    header: "หน่วยงานผู้แก้ไข",
    hidden: hid6,
    sortable: true,
    dataIndex: "dc_user_update_cost_id"
  }));
  //view

  Ext.getCmp(tabpanel1).addColumn(
    new Ext.grid.Column({
      header: "แสดง",
      align: "center",
      id: "view",
      sortable: false,
      width: 50,
      dataIndex: "id",
      renderer: function (value, metaData, record, row, col, store, gridView) {
        var i_enable = record.get("i_enable");
        return '<img src="../images/icons/magnifier2.png"); style="cursor:pointer"/>';
      }
    })
  );

  if (user_right_add) {
    if (!Ext.isEmpty(Ext.getCmp("buAdd"))) Ext.getCmp("buAdd").setDisabled(false);
  } else {
    if (!Ext.isEmpty(Ext.getCmp("buAdd"))) Ext.getCmp("buAdd").setDisabled(true);
  }
  if (user_right_edit) {
    //all
    if (!Ext.isEmpty(Ext.getCmp("role-form-mode"))) Ext.getCmp("role-form-mode").setValue("EDIT");
    Ext.getCmp(tabpanel1).addColumn(
      new Ext.grid.Column({
        header: "แก้ไข",
        sortable: false,
        align: "center",
        id: "edit",
        width: 50,
        dataIndex: "id",
        renderer: function (value, metaData, record, row, col, store, gridView) {
          return '<img src="../images/icons/document_edit.gif"); style="cursor:pointer"/>';
        }
      })
    );
  }
  if (user_right_delete) {
    //edit
    Ext.getCmp(tabpanel1).addColumn(
      new Ext.grid.Column({
        header: "ลบ",
        align: "center",
        id: "remove",
        sortable: false,
        width: 80,
        dataIndex: "id",
        renderer: function (value, metaData, record, row, col, store, gridView) {
          var i_enable = record.get("i_enable");
          return '<img src="../images/icons/document_delete.gif"); style="cursor:pointer"/>';
        }
      })
    );
  }
}; //End Function

shortThaiDate = function (value, metaData, record, row, col, store, gridView) {
  return DategetShortDateMonthName(value);
}; //userCarlendarOverride
longThaiDate = function (value, metaData, record, row, col, store, gridView) {
  return DategetLongDateMonthName(value);
}; //userCarlendarOverride
renderShow = function (value, metaData, record, rowIndex, colIndex, store) {
  var isRegistered = store.getAt(rowIndex).data["i_show"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderReadSelf = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_read_self"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderReadCost = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_read_cost"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderReadAll = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_read_all"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderAdd = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_per_add"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderUpdate = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_per_update"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};
renderDelete = function (value, metaData, record, rowIndex, colIndex, store) {
  var isLeaf = store.getAt(rowIndex).data["_is_leaf"];
  if (!isLeaf) return "";
  var isRegistered = store.getAt(rowIndex).data["i_per_delete"];
  return isRegistered ? '<center><input type="checkbox" checked="yes" id="chk_is_leaf' + rowIndex + '" />' : '<center><input type="checkbox" id="chk_is_leaf' + rowIndex + '" />';
};