


Ext.onReady(function () {
    Ext.QuickTips.init();
//    Ext.showLoadingMask();
    var root = new Ext.tree.AsyncTreeNode();
    var loader = new Ext.tree.TreeLoader({
        dataUrl: "api/userMenu/userTree.php",
        requestMethod: "get",
        baseParams: {url: window.location.href, parent_id: localStorage.getItem("parentId")}
    });
    Ext.urlEIS =
            location.protocol + '//' +
            location.hostname +
            '/NMU_permission/entrance';


    var TreePanel1 = new Ext.tree.TreePanel({
        // title: "USER MENU",upplies/websocket/msg'
        border: false,
        iconCls: 'icon-folder-user',
        id: "TreePanel1ID",
        autoScroll: true,
        rootVisible: false, // show Root Node
        lines: false,
        singleExpand: false,
        useArrows: true,
        tools: [{
                id: 'refresh',
                on: {
                    click: function () {
                        var tree = Ext.getCmp('TreePanel1ID');
                        tree.body.mask('Loading', 'x-mask-loading');
                        tree.root.reload();
                        tree.root.collapse(true, false);
                        setTimeout(function () { // mimic a server call
                            tree.body.unmask();
                            tree.root.expand(false, false);
                        }, 1000);
                    }
                }
            }, /*{
             id: 'search', on: {
             click: function () {
             alert();
             }
             }
             }, */{
                id: 'down',
                on: {
                    click: function () {
                        var tree = Ext.getCmp('TreePanel1ID');
                        tree.root.expand(true, true);
                    }
                }
            }, {
                id: 'up',
                on: {
                    click: function () {
                        var tree = Ext.getCmp('TreePanel1ID');
                        tree.root.collapse(true, false);
//                        console.log(this);
                    }
                }


            }],
        shim: true,
        animCollapse: true,
        constrainHeader: true,
        layout: 'accordion',
        layoutConfig: {
            animate: true
        },
        /**/
        loader: loader,
        root: root,
        listeners: {
            beforerender: function () {
                new Ext.KeyMap(Ext.getBody(), [{
                        key: "f",
                        ctrl: true,
                        fn: function (e, ele) {
                            ele.preventDefault();
                            alert('Clrt+f');
                        }
                    }]);
            },
            click: function (node, e) {
                if (node.isLeaf()) {
                } else if (node.isExpanded()) {
                    node.collapse();
                } else {
                    node.expand();
                }
            }
        }
    });
    var getBrowsers = function () {
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = "" + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;
        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "Microsoft Internet Explorer";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "Chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "Safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
            browserName = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() == browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        majorVersion = parseInt("" + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = "" + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        return browserName + "  = " + fullVersion + ",Major version = " + majorVersion + ",navigator.appName = " + navigator.appName + ",navigator.userAgent = " + navigator.userAgent;
    };
    localStorage.textMemories = localStorage.getItem("textMemories") || {};
    TreePanel1.on("click", function (n) {
        var sn = this.selModel.selNode || {}; // selNode is null on initial selection
        if (n.leaf && n.id != sn.id) {
            // ignore clicks on folders and currently selected node



            var url = n.id.replace(new RegExp("-", "g"), "/");
            var fullURL = url;
            var fullNameSplit = fullURL.split("?");
            var uri = fullNameSplit[0];
            var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
            Ext.page = Ext.apply({uri: uri, method: method});
            Ext.History.add(uri);
            if (n.leaf) {

                let accessManu = {menuID: n.id, menuTxt: n.text, browser: getBrowsers()};
                let accessinfo = Ext.apply({sysUserId: Ext.session.user_id}, accessManu);
                Ext.session = Ext.apply({adminMunu: false});
//                Ext.getCmp('north').fnNotifBe('menuname', n.text);
                Ext.Ajax.request({
                    url: "./access/logAccess.php",
                    method: "POST",
                    params: accessinfo,
                    success: function (response) {
                        //Ext.get('userInfo').update(response.responseText);
                    }
                });


                Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
            }
        }
    });
    // WEST
    var widthWest = isNaN(parseFloat(localStorage.getItem("widthWest")) == true) || parseFloat(localStorage.getItem("widthWest")) > 1200 ? 400 : parseFloat(localStorage.getItem("widthWest"));
    var collapsed = localStorage.getItem("collapsed") == null || localStorage.getItem("collapsed") == "1" ? false : true;
    if (isNaN(widthWest)) {
        widthWest = 400;
        collapsed = true;
        if (localStorage.getItem("parentId") === null) {
            localStorage.setItem("parentId", 10646);
            location.reload();
        }
    }
    var textHistory = function (items, posion) {

        if (!Ext.isEmpty(Ext.getCmp('winMsgHisID'))) {
            Ext.getCmp('winMsgHisID').destroy();
        } else {
            new Ext.Window({
                title: 'Log แจ้งเตือน',
                width: 600,
                id: 'winMsgHisID',
                height: 300,
                modal: false,
                plain: true,
                layout: "fit",
                x: (posion[0] + 10),
                y: (posion[1] + 10),
                maximizable: true,
                collapsible: true,
                closable: true,
                frame: true,
                items: [{
                        xtype: 'textarea',
                        fieldLabel: 'textareafield',
                        name: 'textMemoriesHis',
                        readOnly: true,
                        id: 'textMemoriesHisID',
                        listeners: {
                            blur: function () {

                            }, afterrender: function () {
                                var it = '';
                                items.forEach(function (v) {

//                                    console.log(v);
                                    it += v.sent_name + ' : ' + v.client_datetime + ' : ' + v.message + '\n';
                                });
                                Ext.getCmp('textMemoriesHisID').setValue(Ext.msgAllLoad + '\n' + it);
                            }
                        }
                    }],
                buttonAlign: "right",
                buttons: [{
                        text: 'ปิด',
                        handler: function () {
                            Ext.getCmp('winMsgHisID').destroy();
                        }

                    }, {
                        text: 'ปิดข้อความที่การแจ้งเตือน ไม่ต้องแสดงอีกแล้ว',
                        handler: function () {
                            Ext.Ajax.request({
                                url: "./php-notic/insertLoger.php",
                                method: "POST",
                                params: {mode: 'CLOSE_NOTIF', user_id: Ext.session.user_id},
                                success: function (response) {
                                    Ext.localHistoryUserID = [];
                                    Ext.msgAllLoad = '';
                                    Ext.get('cuvID').dom.innerHTML = 0;
                                    Ext.get('cuvID').dom.style['background'] = 'blue';
                                    Ext.get('cuvID').dom.style['color'] = '#fff';
                                    Ext.getCmp('textMemoriesHisID').setValue('');
                                    Ext.getCmp('winMsgHisID').destroy();
                                }
                            });
                        }
                    }],
                listeners: {
                    close: function (win) { },
                    beforeclose: function (win) { },
                    afterrender: function (win) { }
                }
            });
            Ext.getCmp('winMsgHisID').show();
        }
    };
    Ext.WestGlo = new Ext.Panel({
        id: "west",
        region: "west",
        title: "&nbsp;",
        layout: "accordion",
        collapsible: true,
        autoScroll: true,
        split: true,
        collapsed: collapsed,
        width: widthWest,
        activeItem: 0,
        listeners: {

            afterrender: async function () {

                await $.ajax({
                    url: "api/userMenu/List_parentTree.php",
                    data: {
                        type: "GET_PARENT_MENU",
                        parent_id: localStorage.getItem("parentId"),
                    },
                    success: function (result) {
                        let obj = $.parseJSON(result);
                        if (obj.success == true) {
                            Ext.getCmp("txt-system").setIconClass("icon-report-start");
                            Ext.getCmp("txt-system").setText("<span style='font-weight: bold; font-size: 12px; margin: 0px 1px;'>" + obj.c_name + "</span>");
                            localStorage.setItem("parentId", obj.parent_id);

                            $.each(obj.data, function (index, v) {
                                Ext.getCmp("menu-system").add({
                                    text: v.c_name,
                                    iconCls: "icon-report",
                                    handler: function () {
                                        localStorage.setItem("parentId", v.id);
                                        location.reload();
                                    },
                                });
                            });
                            Ext.getCmp("menu-system").doLayout();
                            Ext.getCmp("west").add(TreePanel1);
                            Ext.getCmp("west").update();
                            Ext.getCmp("west").doLayout();
                        }
                    },
                });
            },
            collapse: function () {
                localStorage.setItem("collapsed", "0");
            },
            expand: function () {
                localStorage.setItem("collapsed", "1");
            },
            resize: function () {
                localStorage.setItem("widthWest", this.getWidth());
            },
        },
        margins: '0 0 5 5',
        cmargins: '0 5 5 5',
        layoutConfig: {animate: true},
        tbar: [{
                id: "txt-system",
                text: "<img style='animation-name: spin; animation-duration: 500ms; animation-iteration-count: infinite; animation-timing-function: linear;' src='./images/icons/hourglass.png' />&nbsp;&nbsp;<span style='position: relative; top: -4px; left: 0px;'>Loading...</span>",
                menu: new Ext.menu.Menu({id: "menu-system"})
            }]
    });
    var hdr = '';
    hdr += '';
    // hdr += '<div id="headerx"><div id="header" align="right"><div id="divID" style="margin:0px 0px 0px 0px;"><span id="message-box"></span></div></div></div>';
    hdr += '<div id="headerx"><div id="header" align="right"><div id="divID" style="margin:0px 0px 0px 0px;"></div></div></div><a href="'+Ext.urlEIS+'"><div class="clickable-box" ></div></a>';

    var west = Ext.WestGlo;
    var collapsedNorth = localStorage.getItem("collapsedNorth") == null || localStorage.getItem("collapsedNorth") == "1" ? false : true;
    var north = new Ext.Panel({
        id: "north",
        region: "north",
        split: false,
        collapseMode: 'mini',
        collapsible: false,
        height: 68,
        border: false,
        collapsed: collapsedNorth,
        items: [
            new Ext.Panel({
                border: true,
                html: '<div id="headerx"><div id="header" align="right"><div id="divID" style="margin:0px 0px 0px 0px;"></div></div></div><a href="'+Ext.urlEIS+'"><div class="clickable-box"></div></a>'
                ,
            }),
            new Ext.Panel({
                id: "favoriteMenu",
                border: false,
                tbar: [],
            }),
        ],
        listeners: {
            collapse: function () {
                localStorage.setItem("collapsedNorth", "0");
            },
            expand: function () {
                localStorage.setItem("collapsedNorth", "1");
            },

            afterrender: function () {

                Ext.MessageBox.minWidth = 300;
                Ext.userOnline = null;
                Ext.receiveJson = function (obj) {

                    Ext.Ajax.request({
                        url: "./php-notic/insertLoger.php",
                        method: "POST",
                        params: jsonApplay,
                        success: function (response) {
                            let Date_now = new Date();
                            let jsonApplay = Ext.apply(obj, {client_datetime: Date_now.format('Y-m-d H:i:s'), user_id: Ext.session.user_id});
                            Ext.localHistoryUserID.push(jsonApplay);
                        }
                    });
                };
            }
        }
    });
    ;    // CENTER
    Ext.winscore = function () {
        Ext.torScores = new Ext.data.JsonStore({
            autoDestroy: false,
            autoLoad: false,
            url: "sp/api/All_spAlert.php",
            baseParams: {type: "sp_tor_emp"},
            root: "data",
            idProperty: "id",
            fields: ["id", "c_name", "dc_department_id", "score", "c_tor_id"]
        });
        new Ext.Window({
            //labelAlign: 'top',
            title: "การให้ภาระงาน",
            id: "tabPanelID",
            bodyStyle: "padding:10px",
            layout: "fit",
            width: 600,
            items: [
                {
                    height: 200,
                    layout: "form",
                    border: false,
                    id: "colID",
                    listeners: {
                        beforerender: function () {
                            this.fnInsert = function (i, rec) {

                                let pr_about = i;
                                let pr_aboutRs = rec;

                                buttonGroup = new Ext.ButtonGroup({
                                    frame: false,
                                    border: false,
                                    style: "border-bottom:1px solid #ccc;  font:bold 12px \'Mitr\', sans-serif; padding:5px;",
                                    id: 'buttonGroup' + pr_about,
                                    items: [
                                        {
                                            xtype: "label",
                                            id: 'labelID' + pr_about,
                                            style: "margin-right:5px;",
                                            text: (i + 1) + ". "
                                        },
                                        {
                                            xtype: 'displayfield',
                                            width: 200,
                                            name: "c_name[" + pr_about + "]",
                                            value: pr_aboutRs.get('c_name')
                                        }, {
                                            xtype: "tbspacer",
                                            width: 9
                                        }, {
                                            xtype: 'displayfield',
                                            name: 'score[' + pr_about + "]",
                                            value: pr_aboutRs.get('c_tor_id'),
                                            readOnly: true,
                                            width: 80
                                        }, {
                                            xtype: 'displayfield',
                                            name: 'score[' + pr_about + "]",
                                            value: parseFloat(pr_aboutRs.get('score')).toFixed(2),
                                            readOnly: true,
                                            width: 80
                                        }, {
                                            xtype: "label",
                                            style: {
                                                color: "blue",
                                                width: "200px"
                                            },
                                            text: " คะแนน"
                                        }, {
                                            xtype: "tbspacer",
                                            width: 9,

                                        }
                                    ]

                                });
                                Ext.getCmp('colID').insert((pr_about + 2), buttonGroup);
                                Ext.getCmp('colID').doLayout();
                            };
                        },
                        afterrender: function () {


                            Ext.torScores.reload({
                                callback: function (record, operation, success) {
                                    //end left    
                                    var i = 0;
                                    record.forEach(function (v) {

                                        Ext.getCmp('colID').fnInsert(i++, v);
                                        if (Ext.torScores.data.length == i) {
                                            buttonGroup0 = new Ext.ButtonGroup({
                                                frame: false,
                                                border: false,
                                                style: "border-bottom:1px solid #000;  font:bold 12px \'Mitr\', sans-serif; padding-left:5px;",
                                                id: 'buttonGroup0',
                                                items: [
                                                    {
                                                        xtype: "label",
                                                        style: "margin-right:5px;",
                                                        text: "no"
                                                    },
                                                    {
                                                        xtype: 'displayfield',
                                                        width: 200,
                                                        value: "สายงาน"
                                                    }, {
                                                        xtype: "tbspacer",
                                                        width: 9
                                                    }, {
                                                        xtype: 'displayfield',
                                                        value: "จำนวนงาน",
                                                        readOnly: true,
                                                        width: 80
                                                    }, {
                                                        xtype: 'displayfield',
                                                        value: "คะแนน",
                                                        width: 80
                                                    }, {
                                                        xtype: "tbspacer",
                                                        width: 9,

                                                    }
                                                ]

                                            });
                                            Ext.getCmp('colID').insert(0, buttonGroup0);
                                            Ext.getCmp('colID').doLayout();
                                        }
                                    });

                                }
                            });


                        }
                    },
                    items: [
                    ],
                    buttonAlign: "left",
                    buttons: [
                        {
                            text: "ปิด",
                            handler: function () {
                                console.log(Ext.getCmp('contenterCenter'));
                                Ext.getCmp('contenterCenter').remove(Ext.getCmp('tabPanelID'));
                            }
                        }
                    ]
                }
            ]
        }).show();



        // Ext.torScores.reload({
        //     callback: function (record, operation, success) {
        //         //end left    
        //         // var i = 0;
        //         // record.forEach(function (v) {

        //             // Ext.getCmp('colID').fnInsert(i++, v);
        // // if (Ext.torScores.data.length == i) {
        //     new Ext.Window({
        //     title: 'score',
        //     width: 450,
        //     id: 'scoreID',
        //     height: 200,
        //     x: (2),
        //     y: (3),
        //     modal: false,
        //     plain: true,
        //     layout: "fit",
        //     maximizable: true,
        //     collapsible: true,
        //     closable: true,
        //     frame: true,
        //     items: [{
        //             xtype: 'textarea',
        //             fieldLabel: 'textareafield',
        //             name: 'textUser',
        //             readOnly: true,
        //             id: 'textscoreID',
        //             listeners: {
        //                 afterrender: function(){

        //                 }
        //             }
        //         },]
        //     }).show();
        //                 // }
        //             // })
        //         }
        //     });
        // Ext.getCmp('scoreID').show();
        // alert(123);
    };
    Ext.winUserOnline = function () {

        if (!Ext.isEmpty(Ext.getCmp('winUserOnlineID'))) {
            Ext.getCmp('winUserOnlineID').destroy();
        } else {
            new Ext.Window({
                title: 'User Online',
                width: 450,
                id: 'winUserOnlineID',
                height: 200,
                x: (2),
                y: (3),
                modal: false,
                plain: true,
                layout: "fit",
                maximizable: true,
                collapsible: true,
                closable: true,
                frame: true,
                items: [{
                        xtype: 'textarea',
                        fieldLabel: 'textareafield',
                        name: 'textUser',
                        readOnly: true,
                        id: 'textUserID',
                        listeners: {
                            blur: function () {

                            }, beforerender: function () {

                                this.fnOnline = function (dataOnline) {
                                    var dataln = dataOnline;


                                    if (!Ext.isEmpty(dataln)) {

                                        var userOnlineText = '';

                                        for (const property in dataln.OnlineUsers) {
                                            var rsObj = dataln.OnlineUsers[property];
                                            if (rsObj['user_id'] > 0)
                                                userOnlineText += rsObj['datime'] + '>'
                                                        + rsObj['user_id'] + '>'
                                                        + rsObj['user_name'] + '\n';

                                        }
                                        Ext.getCmp('winUserOnlineID').setTitle('User Online (' + dataln.totalUser + ')');
                                        this.setValue(userOnlineText);
                                        Ext.get('textUserID').dom.scrollTop = Ext.get('textUserID').dom.scrollHeight;
                                    } else {

                                    }
                                };
                            }, afterrender: function () {

                                this.fnOnline(Ext.userOnline);

                            }
                        }
                    }],
                listeners: {
                    close: function (win) {

                    },
                    beforeclose: function (win) { },
                    afterrender: function (win) { }
                }
            });
            Ext.getCmp('winUserOnlineID').show();
        }

    };
// กำหนดสิทธิ์ครั้งเดียว (กัน undefined ด้วย)
    var adminMenu = (function () {
        try {
            return localStorage.getItem('tg.last.adminMenu') || false;
        } catch (e) {
            return false;
        }
    })();
    var isAdmin = (!!(Ext.session && String(Ext.session.user_id) === '1') || adminMenu);

    Ext.toogleTemp = new Ext.Button({
        text: (north.collapsed) ? 'ย่อ' : 'ขยาย',
        icon: "./images/icons/arrow_in.png",
        style: 'margin-left:20px',
        handler: function () {


            console.log(Ext.WestGlo.collapsed);
            console.log(north.collapsed);

            this.setText((Ext.WestGlo.collapsed) ? 'ย่อ' : 'ขยาย');
            north.toggleCollapse(north.collapsed);
            Ext.WestGlo.toggleCollapse(Ext.WestGlo.collapsed);

        },
    });
    function safeShowNotifyList() {
        if (!window.NOTIFY_STORE.getCount()) {
            Ext.Msg.alert('แจ้งเตือน', 'กำลังโหลดข้อมูลแจ้งเตือน...');
            return;
        }
//    showNotifyList();
        Ext.showNotifList();
    }
   Ext.showNotifList = function () {

    var store = window.NOTIFY_STORE;
    if (!store || store.getCount() === 0) {
        Ext.Msg.alert('แจ้งเตือน', 'ไม่มีรายการแจ้งเตือน');
        return;
    }

    var cnt = store.getCount();
    var list = store.getRange().map(function (rec) {
        return Ext.apply({}, rec.data);
    });

    // =========================
    // Grid factory (ใช้ร่วมทุก tab)
    // =========================
    function createGrid(rows) {
        var gridStore = new Ext.data.JsonStore({
            data: { rows: rows || [] },
            root: 'rows',
            fields: ['id', 'title', 'time', 'status', 'link']
        });

        return new Ext.grid.GridPanel({
            store: gridStore,
            stripeRows: true,
            autoExpandColumn: 'colTitle',
            columns: [
                new Ext.grid.RowNumberer(),
                { id: 'colTitle', header: 'หัวข้อ', dataIndex: 'title' },
                { header: 'เวลา', width: 140, dataIndex: 'time' },
                { header: 'สถานะ', width: 110, dataIndex: 'status' }
            ],

            // ⭐ listener นี้จะมีผลกับทุก tab
            listeners: {
                rowdblclick: function (g, rowIdx) {
                    var r = g.getStore().getAt(rowIdx);
                    if (r && r.get('link')) {
                        window.open(
                            './sp/app/list_pdf.php?path=' + r.get('link'),
                            '_blank'
                        );
                    }
                }
            }
        });
    }

    // =========================
    // Dynamic Tabs
    // =========================
    var tabsArr = [];

    var statusMap = {};
    list.forEach(function (rec) {
        var st = rec.status || 'อื่น ๆ';
        if (!statusMap[st]) statusMap[st] = [];
        statusMap[st].push(rec);
    });

    Ext.iterate(statusMap, function (status, rows) {
        tabsArr.push({
            title: status + ' (' + rows.length + ')',
            layout: 'fit',
            items: createGrid(rows) // 👈 grid ที่มี rowdblclick อยู่แล้ว
        });
    });

    tabsArr.push({
        title: 'ทั้งหมด (' + cnt + ')',
        layout: 'fit',
        items: createGrid(list)
    });

    new Ext.Window({
        title: 'รายการแจ้งเตือน (' + cnt + ')',
        width: 650,
        height: 420,
        modal: true,
        layout: 'fit',
        items: new Ext.TabPanel({
            border: false,
            activeTab: 0,
            items: tabsArr
        }),
        bbar: ['->', {
            text: 'ปิด',
            handler: function (btn) {
                btn.ownerCt.ownerCt.close();
            }
        }]
    }).show();
};

    // ฟังก์ชันเปิดหน้ารายการ 
 
    const btnNotify = new Ext.Button({
        text: '🔔 แจ้งเตือน <span id="notify-badge" style="background:#d00;color:#fff;border-radius:10px;padding:2px 6px;margin-left:6px;">0</span>',
        handler: safeShowNotifyList
    });
    
//    const onlineCountLabel = new Ext.Button({
//    id:'onlineCountLabel',    
//    text: '🔔 แจ้งเตือน <span id="online-badge" style="background:#d00;color:#fff;border-radius:10px;padding:2px 6px;margin-left:6px;">0</span>', 
//    });

//function isUserOnline(userId) {
//    return (window.ONLINE_USERS || []).indexOf(userId) !== -1;
//}

    var center = {
        region: "center",
        id: "content-panel",
        tbar: new Ext.Panel({
            border: false,
            items: [new Ext.Toolbar({
                    border: false,
                    id: 'topToolBarID',
                    items: [btnNotify, /*onlineCountLabel,*/ Ext.toogleTemp, {
                            xtype: 'displayfield',
                            width: 50,
                            id: 'disNumberID',
                            listeners: {
                                beforerender: function () {

                                }, afterrender: function () { // onClick="Ext.cuvfn()"
                                    Ext.shwHistory = function () {
                                        textHistory(Ext.localHistoryUserID, Ext.EventObject.getXY());
                                    };
                                    Ext.cuvfn = function () {
                                        var node = Ext.get('cuvID').dom;
                                        var text = (node.textContent || node.innerText) / 1;
                                        var result = parseInt(text) + 1;
                                        Ext.get('cuvID').dom.innerHTML = result;
                                        Ext.get('cuvID').dom.style['background'] = 'red';
                                        Ext.get('cuvID').dom.style['color'] = '#fff';
                                    };
                                }
                            }
                        }, '->', {
                            xtype: 'button',
                            text: 'ตรวจสอบข้อมูลและลงนาม/อนุมัติเอกสาร PDF',
                            iconCls: 'icon-user-home',
                            handler: function () {
//						  Ext.getCmp('TreePanel1ID').root.reload();
                                var fullURL = 'sp/appAuditDoc01?st=ST9001';
//						  var fullURL = 'sp/dashBoard?st=ST0000';
                                var fullNameSplit = fullURL.split("?");
                                var uri = fullNameSplit[0];
                                var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                Ext.page = Ext.apply({uri: uri, method: method});
                                Ext.History.add(uri);
                                Ext.getCmp("content-panel").update('<iframe id="iframecontentID" src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-user-menu', icon: "./images/icons/text_list_bullets.png",
                            text: 'ข้อมูลซื้อจ้าง',
                            // กันกรณี session เปลี่ยน runtime (ถ้าจำเป็น)
                            listeners: {
                                beforeshow: function (m) {
                                    var adminMenu = (function () {
                                        try {
                                            return localStorage.getItem('tg.last.adminMenu') || false;
                                        } catch (e) {
                                            return false;
                                        }
                                    })();
                                    isAdmin = !!(Ext.session && String(Ext.session.user_id) === '1') || adminMenu;
                                    // สลับซ่อน/แสดงตามสิทธิ์
                                    m.getComponent('mnPdfID').setVisible(isAdmin);
                                    m.getComponent('signPdfID').setVisible(isAdmin);
                                    m.getComponent('mnInsertPdfID').setVisible(isAdmin); //'mnRightID','mnPdfID','signPdfID', 'mnInsertPdfID',
                                }
                            },
                            menu: [{
                                    text: 'หน้าแรก',
                                    handler: function () {
//								Ext.getCmp('TreePanel1ID').root.reload();
                                        var fullURL = 'bi/dashBoard?st=ST0000';
                                        var fullNameSplit = fullURL.split("?");
                                        var uri = fullNameSplit[0];
                                        var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                        Ext.page = Ext.apply({uri: uri, method: method});
                                        Ext.History.add(uri);
                                        Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'Ai ถามตอบ',
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./ai/index.html" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'จัดการเล่ม',
                                    id: 'mnBookMarksID', hidden: !isAdmin,
                                    handler: function () {

                                    }
                                }, {
                                    text: 'เปลี่ยนสิทธิ์',
                                    id: 'mnRightID', hidden: !isAdmin,
                                    handler: function () {
//                                        Ext.getCmp("content-panel").update('<iframe src="./sp/app/mnRight.php" frameborder="0" width="100%" height="100%"></iframe>');
                                        new Ext.Window({
                                            collapsible: true,
                                            maximizable: true,
                                            id: 'WinRightID',
                                            title: "เปลี่ยนสิทธิ์",
                                            bodyStyle: "padding:-10px",
                                            layout: "form",
                                            width: 550,
                                            height: 250,
                                            tbar: [{
                                                    text: 'เปลี่ยนสิทธิ์ Administrator',
                                                    handler: function () {
                                                        // อ่านค่าจาก displayfields ที่มีอยู่ใน window
                                                        var user = Ext.getCmp("userGrandId").getValue();
                                                        var pass = Ext.getCmp("passGrandId").getValue();
                                                        Ext.session.adminMunu = Ext.getCmp("adminMenuId").getValue() || '';
                                                        var adminMenu = (function () {
                                                            try {
                                                                localStorage.setItem('tg.last.adminMenu', Ext.session.adminMunu);
                                                            } catch (e) {
                                                            }
                                                        })();

                                                        // ถ้า user ว่าง -> แจ้ง
                                                        if (!user || user === '*****') {
                                                            Ext.Msg.alert('Error', 'กรุณาเลือกชื่อพนักงานก่อน');
                                                            return;
                                                        }

                                                        // ถ้า pass ถูกมาร์ค (เช่น "****") ให้ถามผู้ใช้กรอกรหัสจริงก่อนส่ง
                                                        var askAndProceed = function (passValue) {
                                                            if (!passValue) {
                                                                Ext.Msg.alert('Error', 'กรุณากรอกรหัสผ่านเพื่อยืนยัน');
                                                                return;
                                                            }

                                                            // ถ้าต้องการส่งรหัสผ่านเป็น MD5 ให้ uncomment ส่วน loadSparkMd5 และใช้ hashedPass แทน passValue
                                                            var sendLogin = function (finalPass) {
                                                                Ext.Ajax.request({
                                                                    url: './access/login_3.php', // เปลี่ยนเป็น endpoint จริงของคุณ
                                                                    method: 'POST',
                                                                    params: {
                                                                        username: user,
                                                                        password: finalPass
                                                                    },
                                                                    success: function (response) {
                                                                        var text = response.responseText;
                                                                        // สมมติว่า server ส่ง JSON { success: true, msg: "..." }
                                                                        try {
                                                                            var o = Ext.decode(text);
                                                                            if (o.success) {
                                                                                Ext.Msg.alert('สำเร็จ' + Ext.session.adminMunu, o.msg || 'ล็อกอินสำเร็จ', function () {
                                                                                    // reload หน้าเว็บเพื่อให้สิทธิ์ใหม่มีผล
                                                                                    window.location.reload();
                                                                                });
                                                                            } else {
                                                                                Ext.Msg.alert('ล้มเหลว', o.msg || 'ล็อกอินไม่สำเร็จ');
                                                                            }
                                                                        } catch (e) {
                                                                            // ถ้าไม่ใช่ JSON ให้แสดง raw response
                                                                            Ext.Msg.alert('Response', text);
                                                                        }
                                                                    },
                                                                    failure: function (resp) {
                                                                        Ext.Msg.alert('Error', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
                                                                    }
                                                                });
                                                            };
                                                            // ======= ถ้าไม่ต้องการ MD5 ให้ส่ง plaintext =======
                                                            sendLogin(passValue);
                                                        };

                                                        if (!pass || pass.indexOf('*') === 0) {
                                                            // ถ้า pass เป็น '****' ให้ prompt รับรหัสจริงจากผู้ใช้
                                                            Ext.Msg.prompt('ยืนยันรหัสผ่าน', 'กรุณากรอกรหัสผ่านของผู้ใช้เพื่อยืนยันการเปลี่ยนสิทธิ์:', function (btn, text) {
                                                                if (btn === 'ok') {
                                                                    askAndProceed(text);
                                                                }
                                                            });
                                                        } else {
                                                            // pass มีค่า (อาจเป็นรหัสจริง) -> ส่งเลย
                                                            askAndProceed(pass);
                                                        }
                                                    }
                                                }
                                            ],
                                            buttons: [{
                                                    text: 'ปิด',
                                                    handler: function () {
                                                        Ext.getCmp('WinRightID').destroy();
                                                    }
                                                }],
                                            items: [new Ext.form.ComboBox({
                                                    id: "sp_emp_idID",
                                                    fieldLabel: "ชื่อพนักงาน",
                                                    width: 300,
                                                    mode: "local",
                                                    store: new Ext.data.JsonStore({
                                                        autoDestroy: false,
                                                        autoLoad: true,
                                                        url: "./bi/api/All_empUserRight.php",
//                                                        url: "./bi/api/All_empUser.php",
                                                        baseParams: {type: "sp_emp", all: "all"},
                                                        root: "data",
                                                        idProperty: "id",
                                                        fields: ["id", "dc_user_id", "c_user_name", "c_password", "dc_emp_id", "c_name"],
                                                        listeners: {
                                                            load: function (t, records, options) {
//                                 
                                                            }
                                                        }
                                                    }),
                                                    valueField: "id",
                                                    displayField: "c_name",
                                                    triggerAction: "all",
                                                    forceSelection: true,
                                                    selectOnFocus: true,
                                                    typeAhead: false,
                                                    emptyText: "เลือกเปลี่ยนสิทธิ์ User",
                                                    listeners: {
                                                        select: function (combo, record, index) {
                                                            // อัปเดตค่าของ displayfield
//                                                            record.set("userGrand","dc_user_id");
//                                                            record.set("passGrand",11111);
                                                            Ext.getCmp("userGrandId").setValue(record.get("c_user_name") || record.get("c_user_name"));
                                                            Ext.getCmp("passGrandId").setValue(record.get("c_password") || "****");
                                                        }
                                                    }
                                                }), {
                                                    xtype: 'displayfield',
                                                    fieldLabel: "User",
                                                    value: '*****',
                                                    id: 'userGrandId',
                                                }, {
                                                    xtype: 'displayfield',
                                                    fieldLabel: "Pass",
                                                    value: '****',
                                                    id: 'passGrandId',
                                                }, new Ext.form.Checkbox({
                                                    id: "adminMenuId",
                                                    fieldLabel: "เมนูแอดมิน",
                                                    boxLabel: "",
                                                    inputValue: 1,
                                                    checked: adminMenu,

                                                })]
                                        }).show();
                                    }
                                }, {
                                    text: 'ตัวอย่างและการแสดงข้อมูลเอกสาร PDF',
                                    id: 'mnTabPdfID', hidden: !isAdmin,
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/app/tab.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'รายการส่งตรวจก่อนลงนาม',
                                    id: 'mnAuditPdfID', hidden: !isAdmin,
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/appAuditDoc01.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'จัดการเอกสารเล่ม PDF',
                                    id: 'mnPdfID', hidden: !isAdmin,
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/app/mnBookmark.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'ลงนามลายเซนต์ ทดสอบ',
                                    id: 'signPdfID', hidden: !isAdmin,
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/app/signDigitGrid.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'เข้าเล่ม /แยกเล่ม ทดสอบ',
                                    id: 'mnInsertPdfID', hidden: !isAdmin,
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/app/bookmark.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
//                                    iconCls: 'icon-tv',
                                    id: 'mnTvID',
                                    icon: "./images/icons/monitor.png", //application_cascade.png
                                    text: 'ทีวี',
                                    handler: function () {
                                        new Ext.Window({
                                            //labelAlign: 'top',
                                            collapsible: true,
                                            maximizable: true,
                                            title: "แจ้งเตือนทีวี",
                                            id: "winTVID",
                                            bodyStyle: "padding:-10px",
                                            layout: "fit",
                                            width: 1250,
                                            html: '',
                                            listeners: {
                                                beforerender: function () {
                                                }, afterrender: function () {
//                                                    this.mask('Loading', 'x-mask-loading');
                                                    Ext.getCmp("winTVID").update('<iframe id="iTvID" src="./tv.php" frameborder="0" width="100%" height="100%"></iframe>');
//                                                    this.unmask();
                                                }
                                            }

                                        }).show();
                                    }
                                }, {
//                                    iconCls: 'icon-user-home',
                                    icon: "./images/icons/monitor.png", //application_cascade.png
                                    text: 'ควบคุมหน้าจอทีวี',
                                    handler: function () {
                                        win = new Ext.Window({
                                            collapsible: false,
                                            maximizable: false,
                                            title: "ควบคุมหน้าจอที่วี",
                                            id: "control-tvID",
                                            iconCls: "icon-folder-user",
                                            layout: "form",
                                            modal: true,
                                            plain: true,
                                            frame: true,
                                            autoScroll: false,
                                            x: 200,
                                            y: 80,
                                            labelWidth: 220,
                                            padding: 10,
                                            width: Ext.getCmp("content-panel").getWidth() - 250,
                                            height: Ext.getCmp("content-panel").getHeight() - 100,

                                            items: [{
                                                    xtype: 'label',
                                                    style: 'font-weight:bold; ',

                                                    html: '<div style="margin-bottom:10px;"><h1>เป็นการความควมการแสดงของทีวี และส่งข้อความพร้อมเลือกแจ้งเตือนพนักงานได้ทั้งหมด-เฉพาะพนักงานที่ต้องการส่งหา</h1></div>'
//                                                    html: '<div style="margin:10px 0px 10px 0px;">\n\
//                                                        reload ,reload-g1,reload-g2,reload-g3,reload-g4 ,reload-all\n\
//                                                        <br> g-full,g1,2,3,4-full\n\
//                                                        <br> msg + ช่อง พิมพ์ข้อความ Run TV msg\n\
//                                                        <br> <p>msg + &lt;marquee&gt;text&lt;/marquee&gt;</p>\n\
//                                                        <br> <p>msg + &lt;blink&gt;text&lt;/blink&gt;</p>\n\
//                                                        </div>'
                                                },
                                                new Ext.form.ComboBox({
                                                    id: "tv_idID",
                                                    fieldLabel: "คำส่งควบคุมทีวีและแจ้งพนักงาน",
                                                    width: 300,
                                                    mode: "local",
                                                    store: new Ext.data.JsonStore({
                                                        fields: ["id", "c_name"],
                                                        data: [
                                                            {id: "reload", c_name: "เริ่มหน้าจอใหม่"},
                                                            {id: "swop", c_name: "เปลี่ยนกลุ่มแสดงข้อมูล(ก่อนทำสัญญา/หลังทำสัญญา)"},
//                                                            {id: "reload-all", c_name: "เรียกข้อมูลทั้งหมด"},
//                                                            {id: "g12-full", c_name: "แสดงข้อมูล Grid1-2"},
//                                                            {id: "g34-full", c_name: "แสดงข้อมูล Grid3-4"},
                                                            {id: "msg", c_name: "แสดงข้อความตัวหน้าสือขึ้นทีวี หรือแจ้งพนักงาน"},
                                                        ]
                                                    }),
                                                    valueField: "id",
                                                    displayField: "c_name",
                                                    triggerAction: "all",
                                                    forceSelection: true,
                                                    selectOnFocus: true,
                                                    typeAhead: false,
                                                    emptyText: "เลือกคำสั่งรีโมทย์ผ่านทีวี",
                                                    listeners: {
                                                        select: function (t, records, options) {
//                                                        console.log(this.store.data.items[this.selectedIndex].id);
//                                                            console.log(records.get('id'));
                                                            var sc = this.store.data.items[this.selectedIndex].id;
                                                            Ext.getCmp('scriptTvID').setValue(sc);
                                                            if (sc == 'msg') {
                                                                Ext.getCmp('textTvID').show();
                                                                Ext.getCmp('sp_emp_idID').show();


                                                            } else {
                                                                Ext.getCmp('textTvID').hide();
                                                                Ext.getCmp('sp_emp_idID').hide();
                                                            }

                                                        }
                                                    }
                                                })
                                                        , {
                                                            xtype: "textfield",
                                                            fieldLabel: "คำสั่ง Run TV",
                                                            name: "scriptTv",
                                                            readOnly: true,
                                                            width: 100,
                                                            id: "scriptTvID",
                                                            listeners: {
                                                                specialkey: function (f, e) {
                                                                    if (e.getKey() == e.ENTER) {
                                                                        var sc = Ext.getCmp('scriptTvID').getValue().trim();
                                                                        Ext.getCmp('buttonSendTvID').fnTv("scriptTv", sc, Ext.getCmp('textTvID').getValue());
                                                                    }
                                                                }
                                                            }
                                                        }, {
                                                    xtype: "textarea",
                                                    fieldLabel: "พิมพ์ข้อความ Run TV msg",
                                                    name: "textTv",
                                                    width: 600,
                                                    value: "<marquee style='font-size:1em;'> แจ้งพนักงาน * ด่วน กรุณาส่งรายงานการเงินภายในวันพรุ่งนี้ </marquee>",
                                                    id: "textTvID",
                                                    listeners: {
                                                        render: function () {
                                                            this.hide();
                                                        },
                                                        specialkey: function (f, e) {
                                                            if (e.getKey() == e.ENTER) {
                                                                var sc = Ext.getCmp('scriptTvID').getValue().trim();
                                                                Ext.getCmp('buttonSendTvID').fnTv("scriptTv", sc, Ext.getCmp('textTvID').getValue());
                                                            }
                                                        }
                                                    }
                                                }, new Ext.form.ComboBox({
                                                    id: "sp_emp_idID",
                                                    fieldLabel: "ชื่อพนักงาน",
                                                    width: 300,
                                                    mode: "local",
                                                    store: new Ext.data.JsonStore({
                                                        autoDestroy: false,
                                                        autoLoad: true,
                                                        url: "./bi/api/All_empUser.php",
                                                        baseParams: {type: "sp_emp", all: "all"},
                                                        root: "data",
                                                        idProperty: "id",
                                                        fields: ["id", "dc_user_id", "c_name"],
                                                        listeners: {
                                                            load: function (t, records, options) {
//                                 
                                                            }
                                                        }
                                                    }),
                                                    valueField: "id",
                                                    displayField: "c_name",
                                                    triggerAction: "all",
                                                    forceSelection: true,
                                                    selectOnFocus: true,
                                                    typeAhead: false,
                                                    emptyText: "ไม่แจ้งพนักงาน",
                                                    listeners: {
                                                        render: function () {
                                                            this.hide();
                                                        }, select: function (t, records, options) {
//                                                            console.log(' ส่งแจ้งเตือน :: ' + records.get('dc_user_id') + ' >> ' + records.get('c_name'));
                                                        }, change: function (t, records, options) {
                                                            if (Ext.isEmpty(records)) {
                                                                Ext.getCmp('textEmpID').hide();
                                                            } else {
                                                                Ext.getCmp('textEmpID').show();
                                                            }

                                                        }
                                                    }
                                                }), {
                                                    xtype: "textarea",
                                                    fieldLabel: "พิมพ์ข้อความแจ้งพนักงาน",
                                                    name: "textEmp",
                                                    width: 600,
                                                    value: "แจ้งพนักงาน * ด่วน กรุณาส่งรายงานการเงินภายในวันพรุ่งนี้",
                                                    id: "textEmpID",
                                                    listeners: {
                                                        render: function () {
                                                            this.hide();
                                                        }
                                                    }
                                                }, {
                                                    xtype: "button",
                                                    fieldLabel: "กดส่ง",
                                                    text: "Run Script Display TV",
                                                    id: 'buttonSendTvID',
                                                    handler: function () {
//                                                        console.log(Ext.getCmp('sp_emp_idID'));
//                                                        console.log(Ext.getCmp('sp_emp_idID').store.data.items[Ext.getCmp('sp_emp_idID').selectedIndex].get('dc_user_id'));
//                                                        return false;

                                                        var sc = Ext.getCmp('scriptTvID').getValue().trim();
                                                        this.fnTv("scriptTv", sc, Ext.getCmp('textTvID').getValue());
//                                                        if (sc == 'msg') {
//                                                            if (Ext.getCmp('sp_emp_idID').getValue() == '01') { //ทั้งหมด
////                                                            console.log(Ext.getCmp('sp_emp_idID').getValue());
//                                                                Ext.realTimeSentMsgTv('0', Ext.getCmp('textEmpID').getValue());
//                                                            } else if ((Ext.getCmp('sp_emp_idID').getValue() / 1) > 0) { // พนักงาน
//                                                                let user_id = Ext.getCmp('sp_emp_idID').store.data.items[Ext.getCmp('sp_emp_idID').selectedIndex].get('dc_user_id');
//                                                                Ext.realTimeSentMsgTv(user_id, Ext.getCmp('textEmpID').getValue());
//                                                            }
//                                                        }
                                                        //

                                                    },
                                                    listeners: {
                                                        beforerender: function () {
//                                                            
                                                            if (location.protocol == 'https:') //wss://localhost:443
                                                                var wsUri = 'wss://' + window.location.host + '/supplies/websocket/chat';
                                                            else
                                                                var wsUri = 'ws://' + window.location.host + '/supplies/websocket/chat';
                                                            var websocket = new WebSocket(wsUri);
                                                            this.fnTv = function (status, sc, textTvID) {
                                                                var msg = {
                                                                    sessId: '',
                                                                    user_id: Ext.session.user_id,
                                                                    user_chat_id: 0,
                                                                    sp_emp_id: Ext.session.sp_emp_id,
                                                                    cost_id: Ext.session.dc_cost_id,
                                                                    typemsg: 'tv',
                                                                    user_name: Ext.session.user_name,
                                                                    msg: 'tv',
                                                                    type: 'user',
                                                                    sockid: (Ext.socketid || {}),
                                                                    id: Ext.session.user_id,
                                                                    name: Ext.session.user_name,
                                                                    status: status,
                                                                    message: sc, msgText: textTvID
                                                                };
                                                                websocket.send(JSON.stringify(msg));
                                                            }; //End Function fnNotifBe 
//                Run                                           
                                                        }, afterrender: function () {
//Ext.receiveJsonTvc 
                                                            Ext.receiveJsonTv = function (obj, id) {
                                                                let Date_now = new Date();
                                                                let jsonApplay = Ext.apply(obj, {
                                                                    client_datetime: Date_now.format('Y-m-d H:i:s'),
                                                                    user_sent_id: Ext.session.user_id,
                                                                    user_id: id,
                                                                    user_sent_name: Ext.session.user_name,
                                                                    c_menu: 'checking',
                                                                    typemsg: 'chat',
                                                                    dc_department_id: 0,
                                                                    dc_cost_id: 32,
                                                                    datetime: '',
                                                                    i_status: 1
                                                                });
                                                                if (id != 0)//sent all
                                                                    Ext.Ajax.request({
                                                                        url: "./php-notic/insertLoger.php",
                                                                        method: "POST",
                                                                        params: jsonApplay,
                                                                        success: function (response) {

                                                                        }
                                                                    });
                                                            };


                                                            Ext.realTimeSentMsgTv = function (id, textSent) {

                                                                if (location.protocol == 'https:') //wss://localhost:443
                                                                    var wsUri = 'wss://' + window.location.host + '/supplies/websocket/chat';
                                                                else
                                                                    var wsUri = 'ws://' + window.location.host + '/supplies/websocket/chat';
                                                                websocket = new WebSocket(wsUri);
                                                                websocket.onopen = function (ev) { // connection is open   
                                                                    var msg = {
                                                                        message: textSent,
                                                                        name: id,
                                                                        typemsg: 'chat',
                                                                        datetime: '',
                                                                        sent_name: Ext.session.user_name,
                                                                        color: '#007AFF'
                                                                    };
                                                                    websocket.send(JSON.stringify(msg));
                                                                };
                                                                var obj = {
                                                                    "type": "usermsg",
                                                                    "typemsg": 'chat',
                                                                    "name": id,
                                                                    "sent_name": Ext.session.user_name,
                                                                    "message": "วางบิล " + textSent,
                                                                    "msg": "วางบิล " + textSent,
                                                                    "color": "#007AFF"
                                                                };

                                                                Ext.receiveJsonTv(obj, id);
                                                                //End Sent 
                                                            };

                                                        }
                                                    }
                                                }],
                                            buttonAlign: "left",
                                            buttons: [{
//                                                    text: "submit",
//                                                    handler: function () {
//
//                                                    }
//                                                }, {
                                                    text: "ปิด",
                                                    handler: function () {
                                                        Ext.getCmp('control-tvID').destroy();
                                                    }
                                                }]
                                        });
                                        win.show();
                                    },
                                    listeners: {

                                        render: function () {
//                                            if (Ext.session.user_id == 1 || Ext.session.user_id == 40050 || Ext.session.user_id == 30047 || Ext.session.user_id == 40048)
                                            this.show();
//                                            else
//                                                this.hide();
                                        }
                                    }

                                }, {

                                    text: "Users Online",
                                    icon: "./images/icons/user_mature.png",
                                    handler: function (e) {
                                        Ext.winUserOnline(Ext.userOnline);
                                    },
                                    scope: this,
                                }, {
                                    text: "ข้อมูลภาระงาน",
                                    icon: "./images/icons/disk_edit.png",
                                    handler: function (e) {
                                        Ext.winscore();
                                    },
                                    scope: this,
                                }, {
                                    text: "Graph",
                                    icon: "./images/icons/chart_pie.png",
                                    handler: function (e) {
                                        openReportPopup();
                                    },
                                    scope: this,
                                }, {

                                    text: 'ข้อมูล PR ซื้อจ้าง',
                                    handler: function (e) {
//								Ext.getCmp('TreePanel1ID').root.reload();
                                        var fullURL = 'alert/st0001';
                                        var fullNameSplit = fullURL.split("?");
                                        var uri = fullNameSplit[0];
                                        var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                        Ext.page = Ext.apply({uri: uri, method: method});
                                        Ext.History.add(uri);
                                        Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');

                                    }
                                }, {
                                    text: 'ข้อมูลสัญญาซื้อจ้าง',
                                    handler: function (e) {
//								Ext.getCmp('TreePanel1ID').root.reload();
                                        var fullURL = 'alert/period'; //alert/period.php
                                        var fullNameSplit = fullURL.split("?");
                                        var uri = fullNameSplit[0];
                                        var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                        Ext.page = Ext.apply({uri: uri, method: method});
                                        Ext.History.add(uri);
                                        Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');

                                    }

                                }, {
                                    text: "ค้นหา PR",
                                    icon: "./images/icons/report_magnify.png",
                                    handler: function (e) {
//								Ext.getCmp('TreePanel1ID').root.reload();
                                        var fullURL = 'sp/find?st=st9000';
                                        var fullNameSplit = fullURL.split("?");
                                        var uri = fullNameSplit[0];
                                        var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                        Ext.page = Ext.apply({uri: uri, method: method});
                                        Ext.History.add(uri);
                                        Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
                                    },
                                    scope: this
                                }, {
                                    text: 'รายการแจ้งเตือน',
                                    iconCls: 'icon-user-edit',
                                    listeners: {
                                        beforerender: function () {
                                            this.afterLoad = function () {
                                                // alert();
                                                //wsChat();
                                            };
                                        },
                                        afterrender: function () {
                                            this.afterLoad();
                                        }
                                    },
                                    handler: function () {

//								Ext.getCmp('TreePanel1ID').root.reload();
                                        var fullURL = 'alert/st0001';
                                        var fullNameSplit = fullURL.split("?");
                                        var uri = fullNameSplit[0];
                                        var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                                        Ext.page = Ext.apply({uri: uri, method: method});
                                        Ext.History.add(uri);
                                        Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');

                                    }
                                }, {

                                    text: "Reload",
                                    icon: "./images/icons/page_white_refresh.png",
                                    handler: function (e) {
                                        window.location.reload();
                                    },
                                    scope: this,
                                }, {
                                    text: "เปิด Text Memories",
                                    icon: "./images/icons/text_columns.png",
                                    handler: function (e) {
                                        Ext.textEditor();
                                    },
                                    scope: this,
                                }, {
                                    text: "Remove Text Memories",
                                    icon: "./images/icons/database_delete.png",
                                    handler: function (e) {
//                            localStorage.clear();
                                        localStorage.removeItem('textMemories');
                                    },
                                    scope: this,
                                }, {
                                    text: "Remove All Memories",
                                    icon: "./images/icons/database_delete.png",
                                    handler: function (e) {
                                        localStorage.clear();
                                    },
                                    scope: this,

                                }],
                            reorderable: true
                        },
                        {
                            xtype: 'button',
                            text: 'ข้อมูลส่วนตัว',
                            icon: "./images/icons/user_key.png",
                            menu: [
                                {
                                    text: 'กลับสู่ระบบ EIS',
                                    icon: "./images/icons/bullet_home.png",
                                    handler: function () {
                                        window.location.href = Ext.urlEIS;
                                    }
                                }, {
                                    text: 'แก้ไขรหัสส่วนตัว',
                                    handler: function () {
                                        Ext.getCmp("content-panel").update('<iframe src="./sp/info.php" frameborder="0" width="100%" height="100%"></iframe>');
                                    }
                                }, {
                                    text: 'ตั้งค่าส่วนตัว'

                                }, {
                                    text: 'ออกจากระบบ',
                                    icon: "./images/icons/door_out.png",
                                    handler: function () {
                                        window.location.href = Ext.urlEIS;
                                    }
                                }]
//
//
//                        }, {
//                            xtype: 'displayfield',
//                            width: 50,
//                            id: '2notif',
//                            value: 5
                        }

                    ]
                })]
        }),
        listeners: {

            afterrender: function () {
                setAfterLoad();
                Ext.btnConnect();


            }
        }
    };
    //
//    Ext.Ajax.request({
//        url: "./access/info.php",
//        success: function (response) {
//            // RENDER
//            Ext.WebApp = new Ext.Viewport({
//                layout: "border",
//                items: [north, west, center]
//            });
//            Ext.get("divID").update('<div id="logout">' + '<div id="userInfo" style="margin-top:0px; float:left;"></div>' + "</div>");
//            Ext.get("userInfo").update(response.responseText);
////                        favorite();
//            // alertSystem();
//            var url = window.location.href;
//            url = url.split("#");
//            if (url[1]) {
//                Ext.getCmp("content-panel").update('<iframe src="' + url[1] + '.php" frameborder="0" width="100%" height="100%"></iframe>');
//            }
//
//        }
//    });
Ext.Ajax.request({
    url: "./access/info.php",
    success: function (response) {
        // RENDER
        Ext.WebApp = new Ext.Viewport({
            layout: "border",
            items: [north, west, center]
        });
        Ext.get("divID").update('<div id="logout">' + '<div id="userInfo" style="margin-top:0px; float:left;"></div>' + "</div>");
        Ext.get("userInfo").update(response.responseText);
        
        var url = window.location.href;
        url = url.split("#");
        if (url[1]) {
            Ext.getCmp("content-panel").update('<iframe src="' + url[1] + '.php" frameborder="0" width="100%" height="100%"></iframe>');
        }

        // --- เริ่มระบบเช็ค Session Realtime ตรงนี้ ---
        initSessionTimer();
    }
});

// ฟังก์ชันควบคุมเวลา Session
function initSessionTimer() {
    // สมมติว่า Session ของ PHP มีอายุ 20 นาที (1200 วินาที)
    // เราจะแจ้งเตือนก่อนหมดเวลา 1 นาที (เหลือ 60 วินาทีสุดท้าย)
    var sessionTimeoutSec = 1200; 
    var warningBeforeSec = 60; 
    var checkInterval = (sessionTimeoutSec - warningBeforeSec) * 1000; // แปลงเป็น มิลลิวินาที

    var sessionAlertTimer;

    function startTimer() {
        // ล้าง Timer เก่าออกก่อนถ้ามี
        if (sessionAlertTimer) clearTimeout(sessionAlertTimer);

        sessionAlertTimer = setTimeout(function() {
            // เมื่อถึงเวลาเตือน แสดง Ext.Msg.confirm แบบ Realtime
            Ext.Msg.confirm(
                'แจ้งเตือนเซสชั่น', 
                'เซสชั่นของคุณกำลังจะหมดอายุในอีก 1 นาที คุณต้องการทำงานต่อหรือไม่?', 
                function(btn) {
                    if (btn === 'yes') {
                        // ถ้ากด ใช่ -> ส่ง Ajax ไปบอก Server ให้ต่ออายุ (Keep-Alive)
                        Ext.Ajax.request({
                            url: './access/keep_alive.php', // สเปกไฟล์ PHP ที่ใช้ต่ออายุเซสชั่น
                            success: function(res) {
                                // ถ้าต่ออายุสำเร็จ ให้เริ่มนับเวลาใหม่
                                startTimer();
                            },
                            failure: function() {
                                Ext.Msg.alert('ผิดพลาด', 'ไม่สามารถต่อเซสชั่นได้ กรุณารีเฟรชหน้าจอ');
                            }
                        });
                    } else {
                        // ถ้ากด ไม่ หรือ ปล่อยทิ้งไว้จนหมดเวลา -> ส่งไปหน้า Logout
                        window.location.href = './access/logout.php'; 
                    }
                }
            );
        }, checkInterval);
    }

    // เริ่มทำงานครั้งแรก
    startTimer();

    // (Option เสริม) ถ้าผู้ใช้มีการคลิกหรือขยับเมาส์บนหน้าเว็บ ให้รีเซ็ตเวลาอัตโนมัติได้เช่นกัน
    /*
    Ext.getBody().on('click', function() {
        // คุณอาจจะส่ง Ajax ไป refresh session ที่ฝั่ง server ด้วยหากต้องการแบบ active จริงๆ
        startTimer(); 
    });
    */
}

    function setAfterLoad() {
        Ext.Ajax.request({
            url: "./access/infoNode.php",
            success: function (result, request) {
                var jsonData = Ext.util.JSON.decode(result.responseText);
                localStorage.setItem("userid", jsonData.data.user_id);

            }
        });

        //-----------------------------------------
        var updateClock = function () {
            Ext.Ajax.request({
                url: "./agesession.php",
                success: function (result, request) {
//                                var jsonData = Ext.util.JSON.decode(result.responseText);

//                               console.log(jsonData);
                }
            });
        };
        var task = {
            run: updateClock,
            interval: 300000 //1 second *60
        };
//-----------------------------------------
        var runner = new Ext.util.TaskRunner();
        runner.start(task);

        //show dashboard
        Ext.getCmp("content-panel").update('<iframe src="bi/dashBoard.php" frameborder="0" width="100%" height="100%"></iframe>');
        //display top
        if (localStorage.getItem('runWarranty') == '0') {
            Ext.get('header').hide();
        } else {
            Ext.get('header').show();
        }

        Ext.textEditor = function () {
            if (!Ext.isEmpty(Ext.getCmp('winMsgID'))) {
                Ext.getCmp('winMsgID').show();
            } else {
                new Ext.Window({
                    title: 'Text Memories',
                    width: 400,
                    id: 'winMsgID',
                    height: 300,
                    modal: false,
                    plain: true,
                    layout: "fit",
                    maximizable: true,
                    collapsible: true,
                    closable: true,
                    frame: true,
                    items: [{
                            xtype: 'textarea',
                            fieldLabel: 'textareafield',
                            name: 'textMemories',
                            id: 'textMemoriesID',
                            listeners: {
                                blur: function () {
                                    localStorage.setItem("textMemories", this.getValue());
                                }, afterrender: function () {

                                    if (localStorage.getItem("textMemories") !== '[object Object]') {
                                        this.setValue(localStorage.getItem("textMemories"));
                                    }

                                }
                            }
                        }],
                    listeners: {
                        close: function (win) {
                            localStorage.setItem("textMemories", Ext.getCmp('textMemoriesID').getValue());
                        },
                        beforeclose: function (win) { },
                        afterrender: function (win) { }
                    }
                });
                Ext.getCmp('winMsgID').show();
            }
        };
        var showMenu = function () {
            let menu = new Ext.menu.Menu({
                items: [{
                        iconCls: 'icon-user-home',
                        text: 'หน้าแรก',
                        handler: function () {
//	         Ext.getCmp('TreePanel1ID').root.reload();
                            var fullURL = 'sp/dashBoard?st=ST0000';
                            var fullNameSplit = fullURL.split("?");
                            var uri = fullNameSplit[0];
                            var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                            Ext.page = Ext.apply({uri: uri, method: method});
                            Ext.History.add(uri);
                            Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
                        },
                    },
                    {
                        text: 'กลับสู่ระบบ EIS',
                        icon: "./images/icons/bullet_home.png",
                        handler: function () {
                            window.location.href = Ext.urlEIS+'/entrance';
                        }
                    },
                    {
                        text: "แสดง/เปิด เมนูทั้งหมด",
                        icon: "./images/icons/arrow_in.png",
                        handler: function (e) {
                            north.toggleCollapse(false);
                            Ext.WestGlo.toggleCollapse(false);
                        },
                        scope: this,
                    },
                    {
                        text: "แสดง/ปิด เมนูด้านบน",
                        icon: "./images/icons/arrow_ns.png",
                        handler: function (e) {
                            north.toggleCollapse(true);
                        },
                        scope: this,
                    },
                    {
                        text: "Reload",
                        icon: "./images/icons/page_white_refresh.png",
                        handler: function (e) {
                            window.location.reload();
                        },
                        scope: this,
                    }, {
                        text: "เปิด Text Memories",
                        icon: "./images/icons/text_columns.png",
                        handler: function (e) {
                            Ext.textEditor();
                        },
                        scope: this,
                    }, {
                        text: "Remove Text Memories",
                        icon: "./images/icons/database_delete.png",
                        handler: function (e) {
//                            localStorage.clear();
                            localStorage.removeItem('textMemories');
                        },
                        scope: this,
                    }, {
                        text: "Remove All Memories",
                        icon: "./images/icons/database_delete.png",
                        handler: function (e) {
                            localStorage.clear();
                        },
                        scope: this,
                    }, {
                        text: "ค้นหา PR",
                        icon: "./images/icons/report_magnify.png",
                        handler: function (e) {
//					   Ext.getCmp('TreePanel1ID').root.reload();
                            var fullURL = 'sp/find?st=st9000';
                            var fullNameSplit = fullURL.split("?");
                            var uri = fullNameSplit[0];
                            var method = (Ext.isEmpty(fullNameSplit[1])) ? '' : (fullNameSplit[1]);
                            Ext.page = Ext.apply({uri: uri, method: method});
                            Ext.History.add(uri);
                            Ext.getCmp("content-panel").update('<iframe src="' + Ext.page.uri + '.php?' + Ext.page.method + '" frameborder="0" width="100%" height="100%"></iframe>');
                        },
                        scope: this
                    }

                ],
            });
            Ext.EventObject.stopEvent();
            menu.showAt(Ext.EventObject.getXY());
        };
        TreePanel1.on("contextmenu", function (n) {
            showMenu();
        });
        Ext.get('headerx').on("contextmenu", function (n) {
            showMenu();
        });
    }
});