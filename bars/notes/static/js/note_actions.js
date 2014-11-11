function createNote() {
  var form = new Ext.form.FormPanel({
    baseCls: 'x-plain',
    labelWidth: 55,
    url: '/add_note',
    layout: {
      type: 'vbox',
      align: 'stretch'
    },
    defaults: {
      xtype: 'textfield'
    },
    items: [
      {
        plugins: [ Ext.ux.FieldLabeler ],
        fieldLabel: 'Header',
        dataIndex: 'header',
        name: 'header',
        displayField: false
      },
      {
        xtype: 'combo',
        store: ['Notice', 'Reference', 'Reminder', 'TODO' ],
        plugins: [Ext.ux.FieldLabeler ],
        fieldLabel: 'Category',
        dataIndex: 'category',
        name: 'category'
      },
      {
        plugins: [ Ext.ux.FieldLabeler ],
        xtype: 'checkbox',
        fieldLabel: 'Favorites',
        dataIndex: 'favorites',
        name: 'favorites'
      },
      {
        plugins: [ Ext.ux.FieldLabeler ],
        xtype: 'checkbox',
        fieldLabel: 'Publish',
        dataIndex: 'publish',
        name: 'publish'
      },
      {
        xtype: 'textarea',
        fieldLabel: 'text',
        hideLabel: true,
        dataIndex: 'text',
        name: 'text',
        flex: 1
      }

    ]
  });

  var w = new Ext.Window({
    title: 'Compose note',
    collapsible: true,
    maximizable: true,
    width: 750,
    height: 500,
    minWidth: 300,
    minHeight: 200,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:5px;',
    buttonAlign: 'center',
    items: form,
    buttons: [
      {
        text: "Save text",
        handler: function () {
          form.getForm().submit({
            url: '/add_note',
            waitMsg: 'Loading data...',
            success: function (form, action) {
              Ext.Msg.alert('Success', action.result.msg);
              Ext.getCmp('myNotes').getView().ds.reload();
              w.close()
            },
            failure: function (form, action) {
              Ext.Msg.alert('Failed', action.result.msg);
            }
          })
        }
      },
      {
        text: 'Cancel',
        handler: function () {
          w.close()
        }
      }
    ]
  });
  w.show();
}

$(document).on("pageload", function () {
  alert("pageload event fired!");
});

function actionWithNote(cpn, rowIndex, e) {
  var uuid = cpn.store.getAt(rowIndex).get('uuid');
  if (e.target.className.indexOf('btn-open') > -1) {
    window.open('/note' + '/' + uuid);
  }
  else if (e.target.className.indexOf('btn-edit') > -1) {
    var form = new Ext.form.FormPanel({
      baseCls: 'x-plain',
      labelWidth: 55,
      url: '/get_one_note',
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      defaults: {
        xtype: 'textfield'
      },
      items: [
        {
          plugins: [ Ext.ux.FieldLabeler ],
          fieldLabel: 'Header',
          dataIndex: 'header',
          name: 'header',
          displayField: false
        },
        {
          xtype: 'combo',
          store: ['Notice', 'Reference', 'Reminder', 'TODO' ],
          plugins: [Ext.ux.FieldLabeler ],
          fieldLabel: 'Category',
          dataIndex: 'category',
          name: 'category'
        },
        {
          plugins: [ Ext.ux.FieldLabeler ],
          xtype: 'checkbox',
          fieldLabel: 'Favorites',
          dataIndex: 'favorites',
          name: 'favorites'
        },
        {
          plugins: [ Ext.ux.FieldLabeler ],
          xtype: 'checkbox',
          fieldLabel: 'Publish',
          dataIndex: 'publish',
          name: 'publish'
        },
        {
          plugins: [ Ext.ux.FieldLabeler ],
          fieldLabel: 'UUID',
          dataIndex: 'uuid',
          name: 'uuid',
          hidden: true
        },
        {
          xtype: 'textarea',
          fieldLabel: 'text',
          hideLabel: true,
          dataIndex: 'text',
          name: 'text',
          flex: 1
        }

      ]
    });

    form.getForm().load({
      url: '/get_one_note',
      params: {
        uuid: uuid
      },
      failure: function (form, action) {
        Ext.Msg.alert("Load failed", action.result.errorMessage);
      }
    });
    var w = new Ext.Window({
      title: 'Compose note',
      collapsible: true,
      maximizable: true,
      width: 750,
      height: 500,
      minWidth: 300,
      minHeight: 200,
      layout: 'fit',
      plain: true,
      bodyStyle: 'padding:5px;',
      buttonAlign: 'center',
      items: form,
      buttons: [
        {
          text: "Save text",
          handler: function () {
            form.getForm().submit({
              url: '/edit_note',
              waitMsg: 'Loading data...',
              success: function (form, action) {
                Ext.Msg.alert('Success', action.result.msg);
                Ext.getCmp('myNotes').getView().ds.reload();
                w.close()
              },
              failure: function (form, action) {
                Ext.Msg.alert('Failed', action.result.msg);
              }
            })
          }
        },
        {
          text: 'Cancel',
          handler: function () {
            w.close()
          }
        }
      ]
    });
    w.show();
  }
  else if (e.target.className.indexOf('btn-delete') > -1) {
    var delNote = function (btn) {
      console.info('You pressed ' + btn);
      if (btn == 'yes') {
        Ext.Ajax.request({
          url: '/delete_note',
          success: function () {
            Ext.getCmp('myNotes').getView().ds.reload();
          },
          failure: function () {
            alert('Error in server');
          },
          params: {uuid: uuid}
        });
      }
    };
    Ext.MessageBox.show({
      title: 'Delete note?',
      msg: 'You are deleting this note. Continue?',
      buttons: Ext.MessageBox.YESNO,
      fn: delNote,
      icon: Ext.MessageBox.QUESTION
    });
  }
  console.debug(e);
}


