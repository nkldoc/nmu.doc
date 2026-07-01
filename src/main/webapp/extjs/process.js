function processWorkflow(actionCode) {

    Ext.Ajax.request({

        url: '../controller/workflowProcess.php',

        params: {

            module_code: 'DOC',

            table_name: 'document_master',

            document_no: txtDocNo.getValue(),

            current_status: txtStatus.getValue(),

            action_code: actionCode
        },

        success: function (response) {

            var obj =
                    Ext.decode(
                            response.responseText
                            );

            if (obj.success) {

                Ext.Msg.alert(
                        'Success',
                        obj.message
                        );

                dsMaster.reload();

            } else {

                Ext.Msg.alert(
                        'Error',
                        obj.message
                        );
            }
        }
    });
}