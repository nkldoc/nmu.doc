Ext.onReady(function() {
	Ext.QuickTips.init();
	
	/*===============================================*/
	var title_panel		= "ทะเบียนคุมค่าใช้จ่ายคณะแพทยศาสตร์วชิรพยาบาล (บัญชี)";
	/*===============================================*/
	
	var store_month = new Ext.data.JsonStore({
		fields : [ "id", "c_name" ],
		data : [
		  { id : "01", c_name : "มกราคม" },
		  { id : "02", c_name : "กุมภาพันธ์" },
		  { id : "03", c_name : "มีนาคม" },
		  { id : "04", c_name : "เมษายน" },
		  { id : "05", c_name : "พฤษภาคม" },
		  { id : "06", c_name : "มิถุนายน" },
		  { id : "07", c_name : "กรกฎาคม" },
		  { id : "08", c_name : "สิงหาคม" },
		  { id : "09", c_name : "กันยายน" },
		  { id : "10", c_name : "ตุลาคม" },
		  { id : "11", c_name : "พฤศจิกายน" },
		  { id : "12", c_name : "ธันวาคม" }
		]
	});

	vw_dc_expense_budget_type = new Ext.data.JsonStore({
		autoDestroy : false,
		autoLoad : true,
		url : "api/All_GlRep00008.php",
		baseParams : {
			type : "vw_dc_expense_budget_type",
			all : "all"
		},
		root : "data",
		idProperty : "id",
		fields : [ "id", "c_name" ],
	});
	
	store_acc_s_parent = new Ext.data.JsonStore({
		autoLoad : true,
		url : "api/All_GlRep00008.php",
		baseParams : { type : "dc_acc_main", show : "all" },
		root : "data",
		idProperty : "id",
		fields : [ "id", "c_name", "cut_name" ],
		listeners: {
	        load: function(t, records, options) {
//	        	Ext.getCmp("gl_dc_book_type_id").setValue(records[0].id);
	        }
		}
	});
	
	store_acc_s_parent_lv5 = new Ext.data.JsonStore({
		autoLoad : true,
		url : "api/All_GlRep00008.php",
		baseParams : { type : "dc_acc_main_lv5", show : "all" },
		root : "data",
		idProperty : "id",
		fields : [ "id", "c_name", "cut_name" ]
	});

	store_acc_s = new Ext.data.JsonStore({
		autoLoad : true,
		url : "api/All_GlRep00008.php",
		baseParams : { type : "dc_acc", show : "all" },
		root : "data",
		idProperty : "id",
		fields : [ "id", "c_name", "cut_name" ]
	});

	// storeYear
	var years = [];
	var currentTime = new Date();
	var now = currentTime.getFullYear() + 1;
	var yy_en = Ext.START_YEAR_ACC;
	while (yy_en <= now) {
		years.push({ id : yy_en, c_name : yy_en + 543 });
		yy_en++;
	};

	store_year = new Ext.data.JsonStore({
		fields : [ "id", "c_name" ],
		data : years
	});
	
	LookReport = function( type ) {
		
		var msg = "";
		
		var s_dc_acc_id_parent = "";
		var s_dc_acc_id_parent_lv5 = "";
		var s_dc_acc_id = "";

		if (Ext.getCmp("dc_expense_budget_type_id").getValue() == "") {
			msg += "- กรุณาเลือก แหล่งเงิน<br>";
		}
		
		if (Ext.getCmp("i_show_acc").getValue().inputValue == 1) {
			if (Ext.getCmp("s_dc_acc_id_parent").getValue() == "") {
				msg += "- กรุณาเลือก บัญชีคุม Lv4 อย่างน้อย 1 รายการ<br>";
			} else {
				s_dc_acc_id_parent = Ext.getCmp("s_dc_acc_id_parent").getValue();
			}
		} else if (Ext.getCmp("i_show_acc").getValue().inputValue == 3) {
			if (Ext.getCmp("s_dc_acc_id_parent_lv5").getValue() == "") {
				msg += "- กรุณาเลือก บัญชีคุม Lv5 อย่างน้อย 1 รายการ<br>";
			} else {
				s_dc_acc_id_parent_lv5 = Ext.getCmp("s_dc_acc_id_parent_lv5").getValue();
			}
		} else {
			if (Ext.getCmp("s_dc_acc_id").getValue() == "") {
				msg += "- กรุณาเลือก บัญชีย่อยอย่างน้อย 1 รายการ<br>";
			} else {
				s_dc_acc_id = Ext.getCmp("s_dc_acc_id").getValue();
			}
		}

		if (msg == "") {

			var href		= "report/Rep_GlRep00010.php";
			var resultUrl	= "";

			resultUrl += "&type=" + type;
			resultUrl += "&year=" + Ext.getCmp("year").getValue();
			resultUrl += "&date_start=" + Ext.util.Format.date(Ext.getCmp('date_start').getValue(), 'Y-m-d');
			resultUrl += "&date_end=" + Ext.util.Format.date(Ext.getCmp('date_end').getValue(), 'Y-m-d');
			resultUrl += "&dc_expense_budget_type_id=" + Ext.getCmp("dc_expense_budget_type_id").getValue();
			resultUrl += "&i_show_acc="+ Ext.getCmp("i_show_acc").getValue().inputValue;
			resultUrl += "&dc_acc_id_parent=" + s_dc_acc_id_parent;
			resultUrl += "&dc_acc_id_parent_lv5=" + s_dc_acc_id_parent_lv5;
			resultUrl += "&dc_acc_id=" + s_dc_acc_id;

			resultUrl = (resultUrl != "") ? "?" + resultUrl.substring(1) : "";

			window.open(href + resultUrl, href);
			window.focus();

		} else { Ext.MessageBox.alert("แจ้งเตือน", msg); }
	};
	
	var panelForm = new Ext.Panel({
		region : "center",
		title : title_panel,
		border : false,
		stripeRows : true,
		loadMask : true,
		items : [{
			xtype : "form",
			frame : true,
			labelAlign : "right",
			labelWidth : 200,
			bodyStyle : { padding : "10px 20px" },
			defaults : {
				anchor : "100%",
				msgTarget : "side",
				allowBlank : false
			},
			items : [ {
				xtype : "container",
				layout : "hbox",
				align : "stretch",
				RemoveHeight : true,
				defaults : {
					xtype : "fieldset",
					flex : 1,
					margins : "0px 3px",
					autoHeight : true
				},
				items : [ {
					title : "เมนู " + title_panel,
					RemoveCls : "x-box-item",
					defaults : {
						labelStyle : "width:200px;",
						allowBlank : true
					},
					items : [
						new Ext.form.ComboBox({
							id : "year",
							fieldLabel : "ปีงบประมาณ",
							width : 262,
							mode : "local",
							store : store_year,
							valueField : "id",
							displayField : "c_name",
							triggerAction : "all",
							forceSelection : true,
							selectOnFocus : true,
							typeAhead : false,
							emptyText : "กรุณาเลือก...",
							value : new Date().getFullYear(),
							listeners : {
								"change" : function(combo,newValue) {
									if (newValue == "") { combo.reset(); }
								},
								beforequery : function(q) {
									if (q.query) {
										var length = q.query.length;
										q.query = new RegExp( Ext.escapeRe(q.query));
										q.query.length = length;
									}
								},
								blur : function() { this.getStore().clearFilter();}
							}
						}),new Ext.ux.form.LovCombo({
							id : "dc_expense_budget_type_id",
							fieldLabel : "แหล่งเงิน",
							width : 262,
							mode : "local",
							store : vw_dc_expense_budget_type,
							valueField : "id",
							displayField : "c_name",
							triggerAction : "all",
							forceSelection : true,
							selectOnFocus : true,
							typeAhead : false,
							emptyText : "กรุณาเลือก..."
						}), {
							xtype : 'compositefield',
							fieldLabel : 'วันที่บันทึกบัญชี',
							anchor : '100%',
							msgTarget : 'under',
							items : [ {
								xtype : 'datefield',
								id : 'date_start',
								value : addY(543)
							}, {
								xtype : 'displayfield',
								value : 'ถึงวันที่',
								width : 36,
								align : 'center'
							}, {
								xtype : 'datefield',
								id : 'date_end',
								value : addY(543)
							}]
						}, {
							xtype : "radiogroup",
							id : "i_show_acc",
							fieldLabel : "รายการบัญชี",
							columns : [ 90, 90, 100 ],
							items : [ {
								boxLabel : "บัญชีคุม Lv4",
								name : "i_show_acc",
								inputValue : 1,
								checked : true
							}, {
								boxLabel : "บัญชีคุม Lv5",
								name : "i_show_acc",
								inputValue : 3
							}, {
								boxLabel : "บัญชีย่อย",
								name : "i_show_acc",
								inputValue : 2
							} ],
							listeners : {
								change : function(obj, value) {
									if (value.inputValue == 1) {
										Ext.getCmp("s_dc_acc_id").hide();
										Ext.getCmp("s_dc_acc_id_parent").show();
										Ext.getCmp("s_dc_acc_id_parent_lv5").hide();
									} else if (value.inputValue == 3) {
										Ext.getCmp("s_dc_acc_id").hide();
										Ext.getCmp("s_dc_acc_id_parent").hide();
										Ext.getCmp("s_dc_acc_id_parent_lv5").show();
									} else {
										Ext.getCmp("s_dc_acc_id").show();
										Ext.getCmp("s_dc_acc_id_parent").hide();
										Ext.getCmp("s_dc_acc_id_parent_lv5").hide();
									}
								}
							}
						}, new Ext.ux.form.LovCombo({
							id : "s_dc_acc_id_parent",
							fieldLabel : "รายการบัญชีคุม Lv4",
							width : 300,
							mode : "local",
							store : store_acc_s_parent,
							valueField : "id",
							displayField : "c_name",
							triggerAction : "all",
							forceSelection : true,
							selectOnFocus : true,
							typeAhead : false,
							emptyText : "กรุณาเลือก..."
						}), new Ext.ux.form.LovCombo({
							id : "s_dc_acc_id_parent_lv5",
							fieldLabel : "รายการบัญชีคุม Lv5",
							width : 300,
							mode : "local",
							store : store_acc_s_parent_lv5,
							valueField : "id",
							displayField : "c_name",
							triggerAction : "all",
							forceSelection : true,
							selectOnFocus : true,
							typeAhead : false,
							hidden : true,
							emptyText : "กรุณาเลือก..."
						}), new Ext.ux.form.LovCombo({
							id : "s_dc_acc_id",
							fieldLabel : "รายการบัญชีย่อย",
							width : 300,
							mode : "local",
							store : store_acc_s,
							valueField : "id",
							displayField : "c_name",
							triggerAction : "all",
							forceSelection : true,
							selectOnFocus : true,
							typeAhead : false,
							hidden : true,
							emptyText : "กรุณาเลือก..."
						})]
					}]
			}],
			buttonAlign : "left",
			buttons : [ {
				text : Ext.GLOBAL_BU_SHOW_TH + "สำหรับ HTML",
				iconCls : "page_magnify",
				handler : function() { LookReport("html"); } // End Handle
			}, {
				text : Ext.GLOBAL_BU_SHOW_TH + "สำหรับ Excel",
				iconCls : "icon-excel",
				handler : function() { LookReport("excel"); } // End Handle
			} ]
		} ]
	}); // panelForm

	/*====================== CENTER ======================*/
	var center = new Ext.TabPanel({
		region: "center",
		border: false,
		activeTab: 0, //default Tab
		id: "contenterCenter",
		defaults: { autoScroll: true },
		items: [ panelForm ]
	});
	
	/*====================== RENDER ======================*/
	new Ext.Viewport({
		layout: "border",
		items: [ center ]
	});
});