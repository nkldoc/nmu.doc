
<!-- System ERP :: Src js  -->
<link href="./js/ext-3.4.0/resources/css/ext-all.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="./js/jquery.js"></script>
<script type="text/javascript" src="./js/ext-3.4.0/adapter/jquery/ext-jquery-adapter.js"></script>
<script type="text/javascript" src="./js/ext-3.4.0/ext-all.js"></script>
<link rel="stylesheet" type="text/css" title="blue" href="./js/ext-3.4.0/resources/css/xtheme-blue.css?_dc=V1116122023" />

<script type="text/javascript">
    Ext.onReady(function () {
        Ext.QuickTips.init();
        function processWorkflow(actionCode) {
            table = 'sign_audit_documents';
            txtStatus = 'DOC_DRAFT';
            txtDocNo = 'DOC0013';
            roleCode = 'OFFICER';
            Ext.Ajax.request({

                url: './controller/workflowProcess.php',

                params: {

                    module_code: 'DOC',
                    table_name: table,
                    document_no: txtDocNo,
                    current_status: txtStatus,
                    action_code: actionCode,
                    from_role: roleCode
                },

                success: function (response) {

                    var obj =
                            decode(
                                    response.responseText
                                    );

                    if (obj.success) {

                        Msg.alert(
                                'Success',
                                obj.message
                                );

                        dsMaster.reload();

                    } else {

                        Msg.alert(
                                'Error',
                                obj.message
                                );
                    }
                }
            });
        }
        processWorkflow('SUBMIT');
    });
</script>
