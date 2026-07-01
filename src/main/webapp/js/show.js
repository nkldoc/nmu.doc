Ext.onReady(function () {
    Ext.QuickTips.init();
     Ext.Chat = {};

    Ext.showLoadingMask = function (loadingMessage) {
        if (Ext.isEmpty(loadingMessage))
            loadingMessage = 'Loading... Please wait';
        //Use the mask function on the Ext.getBody() element to mask the body element during Ajax calls
        Ext.Ajax.on('beforerequest', function () {
             Ext.getBody().mask(loadingMessage, 'loading');
        }, Ext.getBody());
        Ext.Ajax.on('requestcomplete', Ext.getBody().unmask, Ext.getBody());
        Ext.Ajax.on('requestexception', Ext.getBody().unmask, Ext.getBody());
    };

    Ext.showLoadingMask();
//check user before Open Socket
    Ext.Chat.socket = null;
    Ext.Chat.connect = (function (host) {
        if ('WebSocket' in window) {
            Ext.Chat.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            Ext.Chat.socket = new MozWebSocket(host);
        } else {
            console.log('Error: WebSocket is not supported by this browser.');
            return;
        }
        Ext.Chat.socket.onopen = function () {
            Ext.getCmp('out').append(String.format('<p> {0} </p>', 'Info: WebSocket connection opened.'));

            Ext.getCmp('textID').on('keydown', function (e) {
                if (e.keyCode === 13) {
                    Ext.Chat.sendMessage();
                }
            });

        };
        Ext.Chat.socket.onclose = function () {
            Ext.getCmp('textID').setValue(null);
            Ext.getCmp('out').append(String.format('<p> {0} </p>', 'Info: WebSocket closed.'));
        };
        Ext.Chat.socket.onmessage = function (message) {
            Ext.getCmp('out').append(String.format('<p> {0} </p>', Ext.encode(message.data)));
        };
    });
    Ext.Chat.initialize = function () {
        if (window.location.protocol === 'http:') {
            Ext.Chat.connect('ws://' + window.location.host + '/mcot/chat');
        } else {
            Ext.Chat.connect('wss://' + window.location.host + '/mcot/chat');
        }
    };
    Ext.Chat.sendMessage = (function () {

        var message = Ext.user_name + ' : ' + Ext.getCmp('textID').getValue();
        if (Ext.getCmp('textID').getValue() !== '') {
            Ext.Chat.socket.send(message);
            Ext.getCmp('textID').setValue('');
        }
    });
    Ext.Chat.initialize();
//
    document.addEventListener("DOMContentLoaded", function () {
        var noscripts = document.getElementsByClassName("noscript");
        for (var i = 0; i < noscripts.length; i++) {
            noscripts[i].parentNode.removeChild(noscripts[i]);
        }
    }, false);
    var rootMenu = (localStorage.getItem("rootMenu") === null) ? localStorage.getItem("rootMenu") : null;


//    localStorage.setItem("rootMenu", exampleStore);
    var TreePanel1 = new Ext.tree.TreePanel({
        title: "รายการเมนู",
        id: 'menuID',
        border: false,
        autoScroll: true,
        rootVisible: true, // show Root Node
        lines: false,
        sigleClick: true,
        singleExpand: true,
        useArrows: true,
        loader: new Ext.tree.TreeLoader({preloadChildren: true, dataUrl: "api/userMenu/userTreeGenId.php"}),
        collapsible: true,
        loading: true,
        margins: '1 0 0 2',
        cmargins: '2 0 0 3',
        listeners: {
            'expandnode': function (node) {
                console.log(node + 'expandnode Level [' + node.getDepth() + '] last node.id >>> >> ' + node.id);
            },
            'click': function (n, idx) {
                if (n.leaf)
                    console.log(idx + '  click [' + n.leaf + '] node.idid >>> >> ' + n.id);
            }
        },
        root: new Ext.tree.AsyncTreeNode({
            nodeType: 'async',
            draggable: false,
            expanded: true,
            id: 'source',
            text: 'ระบบสารสนเทศทางการบัญชีและการเงิน'
        }),
        bbar: [{text: 'resetMenu', handler: function () {
                    var treeNode = tree.getRootNode();
                    treeNode.expandChildren(true); // Optional: To see what happens

                    treeNode.getChildAt(2).getChildAt(0).appendChild({
                        id: 'gc13',
                        text: 'Grand Child 3',
                        leaf: true
                    });

                    Ext.getCmp('menuID').getRootNode().childNodes[9].expand();
//                    fnNode = function (node, e) {
//                        if (e.ctrlKey && this.isSelected(node)) {
//                            this.unselect(node);
//                        } else {
//                            this.select(node, e, e.ctrlKey);
//                        }
//
//                    }
//                    ;getNodeById
//                    fnNode();

//                    console.log(Ext.getCmp('menuID').getRootNode().childNodes);
                }}]
    });

    var updateClock = function () {
        Ext.fly("clock").update(new Date().format("g:i:s A"));
    };
    Ext.TaskMgr.start({
        run: updateClock,
        interval: 1000
    });
    var getBrowsers = function () {
        var nVer = navigator.appVersion;
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
    var menuWidth = localStorage.getItem("menuWidth") == null ? localStorage.setItem("menuWidth", 350) : localStorage.getItem("menuWidth");
    var collapsed = localStorage.getItem("collapsed") == null || localStorage.getItem("collapsed") == "1" ? false : true;

    var text = new Ext.form.TextField({
        id: 'textID',
//        anchor: '100%',
        width: (menuWidth - 50),
        autosize: true,
        emptyText: 'Echo input'
    });
    var call = new Ext.Button({
        text: 'Echo',
        handler: function () {
//            Ext.getCmp('menuID').root.getNode('xnode-66').setToggle();

//            Ext.getCmp('menuID').getRootNode().childNodes[9].expand();


//
//            var cs = Ext.getCmp('menuID').childNodes, i, len = cs.length;
//            for (i = 0; i < len; i++) {
////                cs[i].expand(deep, anim);
//                console.log(cs[i]);
//            }

//            Ext.Chat.socket.onmessage = function (message) {
//                Ext.getCmp('out').append(String.format('<p> {0} </p>', Ext.encode(message.data)));
//                Ext.Msg.show({
//                    title: 'แจ้งจากระบบ',
//                    msg: String.format('<p> {0} </p>', Ext.encode(message.data)),
//                    buttons: Ext.Msg.OK, // Ext.Msg.OKCANCEL,
//                    icon: Ext.Msg.WARNING,
//                    minWidth: 200,
//                    width: 400,
//                    fn: function (btn) {
//                        if (btn == 'ok') {
//                            text.setValue(null);
//                            text.focus();
//                        }
//                    }
//                });
//            };
        }
    });
    var out = new Ext.form.DisplayField({
        cls: 'x-form-text',
//        width: menuWidth - 50,
        anchor: '100%',
        height: 150,
        autoScroll: true,
        id: 'out'
    });
    text.on('specialkey', function (t, e) {
        if (e.getKey() === e.ENTER) {
            Ext.Chat.sendMessage();
        }
    });
    var TreePanel2 = new Ext.Panel({
        border: false,
        title: "Admin War Room",
        padding: '5 0 1 10',
        items: [
            {
                xtype: "displayfield",
                fieldLabel: "time",
                anchor: '100%',
                labelWidth: 30,
                id: "clock"
            }, {
                xtype: "displayfield",
                fieldLabel: "User Online",
                anchor: '100%',
                labelWidth: 30,
                id: "useronlineID"
            }, out
        ], tbar: [text, call, '-'],

    });


    TreePanel1.on("click", function (n) {
        var sn = this.selModel.selNode || {}; // selNode is null on initial
//        console.log(n.leaf + '  && ' + n.id + '!= ' + sn.id);
        if (n.leaf && n.id != sn.id) {

            // ignore clicks on folders and currently selected node
            var url = n.id.replace(new RegExp("-", "g"), "/");
            Ext.History.add(url);
//            console.log(Ext.History);
            if (n.leaf) {
//                localStorage.setItem("rootMenu", n);
                var accessManu = {menuID: n.id, menuTxt: n.text, browser: getBrowsers()};
                var accessinfo = Ext.apply(Ext.getInfo, accessManu);
//                console.log(n.leaf);
                /*genLog(accessinfo);*/
                Ext.Ajax.request({
                    url: "./access/logAccess.php",
                    method: "POST",
                    params: accessinfo,
                    success: function (response) {
                        //Ext.get('userInfo').update(response.responseText);
                    }
                });
            }
            Ext.getCmp("content-panel").update('<iframe src="' + url + '.php" frameborder="0" width="100%" height="100%"></iframe>');
            //Ext.getCmp('content-panel').update('<iframe src="'+n.id+'.php" frameborder=\"0\" width=\"100%\" height=\"100%\"></iframe>');
        }
    });
    var collapsedNorth = localStorage.getItem("collapsedNorth") == null || localStorage.getItem("collapsedNorth") == "1" ? false : true;
    var north = {
        region: "north",
        split: false,
        collapsible: true,
        html: '<div id="headerx"><div id="header" align="right"><div id="divID" style="margin:0px 0px 0px 0px;"></div></div></div>',
        height: 97,
        collapsed: collapsedNorth,
        listeners: {
            collapse: function () {
                localStorage.setItem("collapsedNorth", "0");
            },
            expand: function () {
                localStorage.setItem("collapsedNorth", "1");
            }
        }
    };

    var west = new Ext.Panel({
        region: "west",
        title: "&nbsp;",
        layout: "accordion",
        //        collapseMode: 'mini',
        collapsible: true,
        autoScroll: true,
        collapsed: collapsed,
        split: true,
        width: menuWidth,
        activeItem: 0,
        listeners: {
            resize: {
                fn: function (el) {
                    localStorage.setItem("menuWidth", this.getWidth());
                }
            },
            afterrender: function () {

            },
            collapse: function () {
                localStorage.setItem("collapsed", "0");
            },
            expand: function () {
                localStorage.setItem("collapsed", "1");
            }
        },
        items: [TreePanel1, TreePanel2],

    });

    // CENTER
    var center = {
        region: "center",
        id: "content-panel",
        collapsible: false,
        listeners: {
            afterrender: function () {
                Ext.getCmp("content-panel").update('<iframe id="welcome" src="welcome.php" frameborder="0" width="100%" height="100%"></iframe>');
            }
        }
    };
    // SOUTH
    var south = {
        region: "south",
        id: 'footID',
        title: "Develop by NKL International Company Limited. Version 16.1.1"

                //	split: true,
                //  collapsible: true
    };
    // RENDER
    new Ext.Viewport({
        layout: "border",
        items: [north, west, center, south],
        listeners: {

        }
    });
    // ADDED
    Ext.get("divID").update(
            '<div id="logout">' +
            '<div id="userInfo" style="margin-top:0px; float:left;"></div>' +
            "</div>"
            );
    Ext.Ajax.request({
        url: "./access/info.php",
        success: function (response) {
            Ext.get("userInfo").update(response.responseText);
        }
    });
});
