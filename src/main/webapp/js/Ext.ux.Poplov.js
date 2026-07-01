
 Ext.ns('Ext.ux.Button');
 Ext.ns('Ext.ux.Grid');
 Ext.ns('Ext.Window');

 Ext.ux.Poplov = Ext.extend(Ext.Button, {
     config: {
//    	   		mini 		: null,  
//    	   		widthText	: 0,
//    	   		headerGrid	: [], 	//json

     }
     , initComponent: function () {
         this.mini = this.Minipop();
         this.isCellClickGrid = false;
         this.isSetFilter = false;
         this.setReset();

     },

     setReset: function (t) {
         if (t) {
             Ext.getCmp(this.id + '_Name').setValue();
             Ext.getCmp(this.id).setValue();
         }
     },
     afterrender: function () {},
     uiSearch: function (id) {
         var store = this.store;
         var headerGrid = this.headerGrid;
         var id = id;

         var setDefaultFilter = [['c_code', "รหัส"], ['c_name', "ชื่อ"]];
         var setFilter = [['c_name', "ชื่อ"]];

         var filterGrid = new Ext.data.SimpleStore({
             fields: ["value", "text"],
             data: this.isSetFilter ? setFilter : setDefaultFilter,
         });
         var store = this.store;

         var filterGrid = Ext.isEmpty(this.filterGrid) ? filterGrid : this.filterGrid; //comb&store filter
         var defFilter = this.defFilter; //default filter

         return [{
                 id: "filter" + id,
                 xtype: 'combo',
                 width: 130,
                 mode: 'local',
                 store: filterGrid,
                 valueField: "value",
                 displayField: "text",
                 allowBlank: false,
                 editable: false,
                 triggerAction: "all",
                 typeAhead: false,
                 value: Ext.isEmpty(defFilter) ? 'c_name' : defFilter,
             }, '-', {
                 id: "value-box" + id,
                 xtype: "textfield",
                 width: 130,
                 fieldLabel: "fieldLabel",
                 emptyText: 'คำที่ต้องการค้นหา',
                 listeners: {
                     specialkey: function (f, e) {
                         if (e.getKey() == e.ENTER) {
                             store.setBaseParam("mode", "SEARCH");
                             store.setBaseParam("filter", Ext.getCmp("filter" + id).getValue());
                             store.setBaseParam("value", Ext.getCmp("value-box" + id).getValue());
                             Ext.getCmp('win-pop-lov-modal-' + id).getStore().load();
                         }
                     }
                 },
             }];
     }

     , Minipop: function () {
         /******/
         var store = this.store;
         var headerGrid = this.headerGrid;
         var id = this.id;
         var nameID = this.id + '_Name';
         var widthText = isNaN(this.widthText) ? 198 : this.widthText;
         var uiSearch = this.uiSearch(id);

         /*****/
         function SearchGrid(store, id) {

             if (Ext.getCmp("value-box" + id).getValue() != "")
             {
                 store.setBaseParam("mode", "SEARCH");
                 store.setBaseParam("filter", Ext.getCmp("filter" + id).getValue());
                 store.setBaseParam("value", Ext.getCmp("value-box" + id).getValue());
                 Ext.getCmp('win-pop-lov-modal-' + id).getStore().load();
             } else {

                 store.setBaseParam("mode", "");
                 Ext.getCmp('win-pop-lov-modal-' + id).getStore().load();
             }
         }
         ;

         var cellClick_lov = function (grid, rowIndex, columnIndex, e) {

             var record = grid.getStore().getAt(rowIndex);
             var TextShow = record.data.c_code + ' ' + record.data.c_name;

             Ext.getCmp(id).setValue(record.data.id);
             Ext.getCmp(nameID).setValue(TextShow);

             Ext.getCmp("win-pop-lov" + id).hide();
             Ext.getCmp("win-pop-lov" + id).destroy();

         };

         cellClick_lov = (this.isCellClickGrid) ? this.cellClickGrid : cellClick_lov;

         return {
             fieldLabel: this.fieldLabel,
             xtype: 'radiogroup',
             id: 'pop_' + this.id,
             columns: [0, widthText, 40],
             hidden: (this.hidden == true) ? true : false,
             listeners: {
                 afterrender: this.afterrender,
             },
             items: [{
                     xtype: 'hidden',
                     name: this.valueHidden,
                     id: id,
                     value: this.value,
                 }, {
                     xtype: 'textfield',
                     name: 'txt' + this.id,
                     emptyText: this.text,
                     id: nameID,
                     readOnly: true,

                 }, {
                     xtype: 'button',
                     id: 'Bu' + this.id,
                     name: 'Bu' + this.id,
                     iconCls: this.iconCls,
                     handler: function () {
                         /* //Load Store Begin SearchGrid */
                         store.setBaseParam("mode", "");
                         store.load();

                         var win = new Ext.Window({
                             id: "win-pop-lov" + id,
                             title: "เลือกข้อมูล",
                             modal: true,
                             plain: true,
                             layout: "fit",
                             maximizable: true,
                             constrainHeader: true,
                             closable: true,
                             listeners: {
                                 afterrender: function (obj, eOpts)
                                 {
                                     this.fn = function (widht, height) { //percentage
                                         var width = Ext.getBody().getViewSize().width * widht;
                                         var height = Ext.getBody().getViewSize().height * height;
                                         this.setSize(width, height);
                                     }
                                     this.fn(.80, .85);
                                 },
                                 "maximize": function (window, opts) { //when property minimizable
                                     window.setWidth(Ext.getBody().getViewSize().width * .99);
                                     window.expand('', false);
                                     window.center();
                                 }
                             },
                             items: [{
                                     xtype: 'grid',
                                     id: 'win-pop-lov-modal-' + id,
                                     border: false,
                                     stripeRows: true,
                                     loadMask: true,
                                     store: store,
                                     tbar: [uiSearch
                                                 , ' ', '-', {
                                                     text: "ค้นหา",
                                                     id: 'magnifier_' + id,
                                                     iconCls: 'icon-magnifier',
                                                     handler: function () {
                                                         SearchGrid(store, id);/*SearchEngin(store,id);*/
                                                     }
                                                 }/* ,' ',{
                                                  text : "เคลียร์ค่า",
                                                  id:'clearValue_'+id,
                                                  iconCls: 'icon-clear',
                                                  handler : function() {
                                                  Ext.getCmp(id).setValue('');
                                                  Ext.getCmp(nameID).setValue('');
                                                  Ext.getCmp("win-pop-lov"+id).hide();
                                                  Ext.getCmp("win-pop-lov"+id).destroy();

                                                  }
                                                  } */],
                                     columns: headerGrid,
                                     listeners: {
                                         afterrender: function (obj, eOpts)
                                         {
                                             this.fn = function (widht, height) { //percentage

                                                 var width = Ext.getBody().getViewSize().width * widht;
                                                 var height = Ext.getBody().getViewSize().height * height;
                                                 this.setSize(width, height);
                                             }
                                             this.fn(.5, .4);
                                         },

                                     },
                                     autoExpandColumn: 'c_name',
                                     bbar: new Ext.PagingToolbar({
                                         pageSize: 15,
                                         store: store,
                                         displayInfo: true,
                                         displayMsg: 'Displaying topics {0} - {1} of {2}'
                                     })
                                 }],

                         });

                         win.show();
                         Ext.getCmp('win-pop-lov-modal-' + id).on('cellclick', cellClick_lov, this);
                     },

                 }],

         };
     }, //Mini

 });

