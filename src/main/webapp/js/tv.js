
Ext.onReady(function () {
    Ext.QuickTips.init();


    Ext.intervalSet = 15000; // 10 วินาที
    Ext.pageSizing = 9;
    Ext.setHeightDefalut = 305; //318
    Ext.setWidthDefalut = 600;
    let main = document.getElementById('mainGroup');
    let sub = document.getElementById('subGroup');
    let current = 'sub';

    if (window.location.protocol == 'http:') {
        Ext.websocket = new WebSocket('ws://' + window.location.host + '/supplies/websocket/chat');
    } else {
        Ext.websocket = new WebSocket('wss://' + window.location.host + '/supplies/websocket/chat');
    }

    var el = document.body;
    var xg = Ext.grid;
    Ext.desktop = Ext.get('x-desktop');
    Ext.msgAlert = function (msg, st, et, news) {
        var welcome = new Ext.Window({
            collapsible: true,
            maximizable: true,
            title: "แจ้งเตือนหน้าจอ",
            id: "winMain",
            width: Ext.setWidthDefalut,
            height: 200,
            layout: "fit",
            modal: true,
            plain: true,
            bodyStyle: "padding:1px;",
            html: '<div id="msgID">' + msg + '</div>',
            listeners: {
                afterrender: function () {
//                    Ext.get('msgID').dom.style['color'] = 'red';
                    Ext.get('msgID').dom.style['fontSize'] = '2em';
                    Ext.get('msgID').dom.style['fontWeight'] = "bold";

                }
            }
        });
        setTimeout(function () {
            welcome.show();
            welcome.getEl().fadeIn();

        }, st);
        setTimeout(function () {
            welcome.getEl().fadeOut();
            welcome.destroy();

        }, et);
    };

    function reload() {
        window.location.reload();
    }
    Ext.swopDisplay = () => {
        if (current === 'main') {
            main.classList.remove('active');
            sub.classList.add('active');
            current = 'sub';
            newFn2(false, true);
        } else {
            sub.classList.remove('active');
            main.classList.add('active');
            current = 'main';
            newFn(false, true);
        }
    };
    Ext.desktop.on('click', function () {
//        Ext.swopDisplay();
//        Ext.msgAlert('เริ่มต้นหน้าจอใหม่ ' + current, 0, 3000);

    }, this);

    Ext.grid5 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid15ID';
        Ext.store5 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline1",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid1"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid5ID',
            store: Ext.store5,
            stripeRows: true,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
//                    sm2,
//                    {header: "No.", width: 50, dataIndex: 'no'},
                    // {header: "ลำดับ", dataIndex: 'no',align: "center",width: 50 },
                    {header: "PR", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 260},
                    // {id: 'id', width: 50, header: "รหัสพนักงาน", dataIndex: 'id'},
                    {header: "ชื่อพนักงาน", width: 150, dataIndex: 'sp_emp'},
                    {header: "วัน", dataIndex: 'day', width: 50},
//                    {header: "วันที่", dataIndex: 'd_status'},
                            // {header: "เวลา", width: 150, dataIndex: 'datetime'},
                            // {id: 'id', width: 50, header: "รหัสพนักงาน", dataIndex: 'id'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: ' หลังทำสัญญา 1',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.store5,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid5ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });
    };
    Ext.grid6 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid16ID';
        Ext.userOnline6 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline6",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid2"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid6ID',
            store: Ext.userOnline6,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขสัญญา", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'แสดงข้อมูลก่อนสิ้นสุดสัญญาก่อน 15',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline6,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid6ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });
    };
    Ext.grid7 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid17ID';
        Ext.userOnline7 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline7",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid3"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid7ID',
            store: Ext.userOnline7,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขสัญญา", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'แสดงข้อมูลก่อนสิ้นสุดสัญญาก่อน 5',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline7,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid7ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);
                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;
                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });
    };
    Ext.grid8 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid18ID';
        Ext.userOnline8 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline8",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid4"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid8ID',
            store: Ext.userOnline8,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขตรวจรับ", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'แสดงข้อมูลหลังจากวางบิลเกิน 7 วัน',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline8,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid8ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);
                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;
                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส 
        });
    };

    ////////////////////////////////////////////////////////////////////////////////////////
    // Grid 1
    ////////////////////////////////////////////////////////////////////////////////////////    
    Ext.grid1 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid11ID';

        Ext.store1 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline1",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid1"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });

        return new xg.GridPanel({
            id: 'grid1ID',
            store: Ext.store1,
            stripeRows: true,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "PR", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 260},
                    {header: "ชื่อพนักงาน", width: 150, dataIndex: 'sp_emp'},
                    {header: "วัน", dataIndex: 'day', width: 50},
                ]
            }),
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'นับจากวันจ่ายงาน ถึงวัน kpi (7 วันไม่ขยับ)',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.store1,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid1ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส

        });
    };
//    ////////////////////////////////////////////////////////////////////////////////////////
//    // Grid 2
//    ////////////////////////////////////////////////////////////////////////////////////////      
    Ext.grid2 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid12ID';
        Ext.userOnline2 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline2",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid2"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid2ID',
            store: Ext.userOnline2,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขสัญญา", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'นักจาก KPI เจาะจง คัดเลือก ใบสั่ง (60) วัน',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline2,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid2ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });
    };
//    ////////////////////////////////////////////////////////////////////////////////////////
//    // Grid 3
//    //////////////////////////////////////////////////////////////////////////////////////// 
    Ext.grid3 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid13ID';
        Ext.userOnline3 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline2",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid3"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid3ID',
            store: Ext.userOnline3,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขสัญญา", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'นักจาก KPI เจาะจง คัดเลือก สัญญา เกิน (75) วัน',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline3,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid3ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });

    };
//    ////////////////////////////////////////////////////////////////////////////////////////
//    // Grid 4
//    ////////////////////////////////////////////////////////////////////////////////////////     
    Ext.grid4 = function (f, a, ranTo, hf) {
        var wf = f ? f : Ext.setWidthDefalut;
        var hf = f ? hf : Ext.setHeightDefalut;
        var al = a ? a : false;
        var rdt = ranTo ? ranTo : 'grid14ID';
        Ext.userOnline4 = new Ext.data.JsonStore({
            autoLoad: al, autoDestroy: true,
            storeId: "myuserOnline2",
            url: "./alert/api/listTv.php",
            baseParams: {mode: "grid4"},
            root: "data",
            idProperty: "socket",
            totalProperty: "totalCount",
            fields: [
                "no",
                "id",
                "c_code",
                "c_name",
                "sp_emp",
                "day"
            ]
        });
        return new xg.GridPanel({
            id: 'grid4ID',
            store: Ext.userOnline4,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    return (record.get('no') % 2) ? 'child-row' : 'adult-row';
                },
                stripeRows: false
            },
            cm: new xg.ColumnModel({
                defaults: {
                    width: 110,
                    sortable: true
                },
                columns: [
                    {header: "เลขตรวจรับ", dataIndex: 'c_code', width: 120},
                    {header: "ชื่อรายการ", dataIndex: 'c_name', width: 200},
                    {header: "ชื่อพนักงาน", dataIndex: 'sp_emp', width: 190},
                    {header: "จำนวนวัน", width: 50, dataIndex: 'day'},
                ]
            }),
//            sm: sm2,
            columnLines: true,
            width: wf,
            height: hf,
            frame: true,
            title: 'นักจาก KPI ebidding เกิน 100 วัน',
            iconCls: 'icon-grid',
            renderTo: rdt,
            bbar: new Ext.PagingToolbar({
                pageSize: Ext.pageSizing,
                store: Ext.userOnline4,
                displayInfo: false,
                displayMsg: "Displaying topics {0} - {1} of {2}",
            }),
            listeners: {
                afterrender: function () {
                    var grid2 = Ext.getCmp('grid4ID');
                    var store = grid2.getStore();
                    var toolbar = grid2.getBottomToolbar();

                    var interval = Ext.intervalSet; // 10 วินาที

                    setInterval(function () {
                        var pageSize = store.pageSize || Ext.pageSizing;
                        var totalCount = store.getTotalCount();
                        var totalPages = Math.ceil(totalCount / pageSize);

                        // คำนวณหน้าปัจจุบัน
                        var currentPage = Math.floor((store.lastOptions?.params?.start || 0) / pageSize) + 1;

                        if (currentPage < totalPages) {
                            toolbar.moveNext(); // ถ้ามีหน้าถัดไป
                        } else {
                            toolbar.moveFirst(); // กลับหน้าแรก
                        }
                    }, interval);
                }, //End
            }//ลิส
        });
    };

    var newFn = function (n, a) {
        destroyFn();
        var grid1 = Ext.grid1(n, a);
        var grid2 = Ext.grid2(n, a);
        var grid3 = Ext.grid3(n, a);
        var grid4 = Ext.grid4(n, a);

        grid1.getEl().fadeIn();
        grid2.getEl().fadeIn();
        grid3.getEl().fadeIn();
        grid4.getEl().fadeIn();


    };


    var newFn2 = function (n, a) {
        destroyFn();
        var grid5 = Ext.grid5(n, a);
        var grid6 = Ext.grid6(n, a);
        var grid7 = Ext.grid7(n, a);
        var grid8 = Ext.grid8(n, a);

        grid5.getEl().fadeIn();
        grid6.getEl().fadeIn();
        grid7.getEl().fadeIn();
        grid8.getEl().fadeIn();

    };

    var newFnDouble = function (n, a) {
        var grid1 = Ext.grid1(1260, true, 'grid11ID', 300);
        var grid2 = Ext.grid2(1260, true, 'grid12ID', 300);

        // var grid4 = Ext.grid4(n, a);

        grid1.getEl().fadeIn();
        // grid2.getEl().fadeIn();
        grid2.getEl().fadeIn();
        // grid4.getEl().fadeIn();
    };
    var destroyFn = function () {
        if (!Ext.isEmpty(Ext.getCmp('grid1ID')))
            Ext.getCmp('grid1ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid2ID')))
            Ext.getCmp('grid2ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid3ID')))
            Ext.getCmp('grid3ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid4ID')))
            Ext.getCmp('grid4ID').hide();

        if (!Ext.isEmpty(Ext.getCmp('grid5ID')))
            Ext.getCmp('grid5ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid6ID')))
            Ext.getCmp('grid6ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid7ID')))
            Ext.getCmp('grid7ID').hide();
        if (!Ext.isEmpty(Ext.getCmp('grid8ID')))
            Ext.getCmp('grid8ID').hide();
    };

//    setInterval(() => { 
//        Ext.swopDisplay();
//        Ext.msgAlert('เริ่มต้นหน้าจอใหม่ ' + current, 0, 3000);
//    }, 200000); // สลับทุก 10 วินาที   

    Ext.websocket.onmessage = function (ev) {
//        var ev = '{ "type": "users", "status": "disconnect", "socket": 0,  "id": null,  "name": null,  "message": null, "msgText": null, "datetime": "2025-01-18 15:50:45", "totalCount": null}';   

        var response = JSON.parse(ev.data);
        var status = response.status; //message text
        var message = response.message; //message text
        var msgText = response.msgText; //message text
        //      

        if (status === "scriptTv") {
            Ext.get("player").dom.play();
            if (message === 'g1-full') {
                destroyFn();
                var grid1 = Ext.grid1(1250, true, 'grid11ID', 500);
                grid1.getEl().fadeIn();
            } else if (message === 'swop') {
                Ext.swopDisplay();
                Ext.msgAlert('เริ่มต้นหน้าจอใหม่ ' + current, 0, 3000);
            } else if (message === 'g2-full') {
                destroyFn();
                var grid1 = Ext.grid2(1250, true, 'grid11ID', 500);
                grid1.getEl().fadeIn();
            } else if (message === 'g3-full') {
                destroyFn();
                var grid1 = Ext.grid3(1250, true, 'grid11ID', 500);
                grid1.getEl().fadeIn();
            } else if (message === 'g4-full') {
                destroyFn();
                var grid1 = Ext.grid4(1250, true, 'grid11ID', 500);
                grid1.getEl().fadeIn();
            } else if (message === 'g-full') {
                Ext.get("player").dom.src = "./sound/notifications-sound.mp3";
                destroyFn();
                newFn(false, true);
            } else if (message === 'g12-full') {
                Ext.get("player").dom.src = "./sound/notifications-sound.mp3";
                destroyFn();
                newFnDouble(true, true);
            } else {
                Ext.get("player").dom.src = "./sound/success-trumpets.mp3";
                if (message === "reload-g1" || message === "reload-all") {
                    var idCmp = 'grid1ID';
//                            new Audio('./sound/success-trumpets.mp3').play();
                    Ext.getCmp(idCmp).getEl().mask("ที่เรียกดู ณ ขณะนี้...", "x-mask-loading");
                    Ext.getCmp(idCmp).store.reload({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.getCmp(idCmp).getEl().unmask();
                            }
                        }
                    });
                }
                if (message === "reload-g2" || message === "reload-all") {
                    var idCmp2 = 'grid2ID';
                    Ext.getCmp(idCmp2).getEl().mask("ที่เรียกดู ณ ขณะนี้...", "x-mask-loading");
                    Ext.getCmp(idCmp2).store.reload({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.getCmp(idCmp2).getEl().unmask();
                            }
                        }
                    });
                }
                if (message === "reload-g3" || message === "reload-all") {
                    var idCmp3 = 'grid3ID';
                    Ext.getCmp(idCmp3).getEl().mask("ที่เรียกดู ณ ขณะนี้...", "x-mask-loading");
                    Ext.getCmp(idCmp3).store.reload({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.getCmp(idCmp3).getEl().unmask();
                            }
                        }
                    });
                }
                if (message === "reload-g4" || message === "reload-all") {
                    var idCmp4 = 'grid4ID';
                    Ext.getCmp(idCmp4).getEl().mask("ที่เรียกดู ณ ขณะนี้...", "x-mask-loading");
                    Ext.getCmp(idCmp4).store.reload({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.getCmp(idCmp4).getEl().unmask();
                            }
                        }
                    });
                }


                if (message === "msg") {
                    Ext.get('top').dom.innerHTML = msgText;
//                    Ext.get('top').dom.style['color'] = 'red';
                    Ext.msgAlert(msgText, 0, 0);

                } else if (message === "close") {
                } else if (message === "reload") {
                    reload();
                }
            }



        }
    };
    Ext.websocket.onclose = function () {
        Ext.Msg.alert("แจ้งเตือนทั้งหมดจากแอดมิน", "Socket Close ,Press Ok Connect", function (form, action) {
            window.location.reload();
//            if (window.location.protocol == 'http:') {
//                Ext.websocket = new WebSocket('ws://' + window.location.host + '/supplies/websocket/chat');
//            } else {
//                Ext.websocket = new WebSocket('wss://' + window.location.host + '/supplies/websocket/chat');
//            }
        });
    };
    Ext.swopDisplay();
    Ext.msgAlert('เริ่มต้นหน้าจอใหม่ ' + current, 0, 3000);
//    Ext.swopDisplay();
});