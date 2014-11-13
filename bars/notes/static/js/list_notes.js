/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
*/
Ext.onReady(function () {

  Ext.QuickTips.init();

  var url = {
      local:  '/static/notes.php',  // static data file
      remote: '/get_notes'
  };

  var encode = true;

  var local = false;

  var store = new Ext.data.JsonStore({
    // store configs
    autoLoad: true,
    autoDestroy: true,
    url: (local ? url.local : url.remote),
    storeId: 'myStore',
    // reader configs
    root: 'row',
    idProperty: 'uuid',
    totalProperty: 'total',
    remoteSort: false,
    fields: [
      'header',
      'category',
      {name: 'date_time', type: 'date'},
      {name:'favorites', type:'bool'},
      {name: 'publish', type: 'bool'},
      'text',
      'uuid'],
    writer: 'json',
    sortInfo: {field: 'date_time', direction: 'DESC'}
  });

  var filters = new Ext.ux.grid.GridFilters({
    encode: encode,
    local: local,
    filters:[
      {
        type: 'string',
        dataIndex: 'header'
//        disabled: true
      },
      {
        type: 'numeric',
        dataIndex: 'price'
      },
      {
        type: 'date',
        dataIndex: 'date_time'
      },
      {
        type: 'list',
        dataIndex: 'category',
        options: ['Notice', 'Reminder', 'Reference', 'TODO']
//        phpMode: true
      },
      {
        type: 'boolean',
        dataIndex: 'favorites'
      }]
  });

  var cm = new Ext.grid.ColumnModel({
    defaults: {
      sortable: true
    },
    columns: [
      {
        header: 'Edit note',
        width: 70,
        sortable: false,
        renderer: function (){
            return '<button class="btn-edit">Edit</button>'
        },
        dataIndex: 'actionEdit'
        },
      {
        id: 'header',
        header: "Note's header",
        dataIndex: 'header',
        width: 180
      },
      {
        header: 'View note',
        width: 60,
        sortable: false,
        renderer: function (){
            return '<button class="btn-open">View</button>'
        },
        dataIndex: 'actionOpen'
      },
      {
        header: 'Category',
        dataIndex: 'category',
        width: 70
      },
      {
      xtype: 'datecolumn',
      header: 'Date of change',
      width: 120,
      dataIndex: 'date_time',
      format: 'Y-m-d H:i:s',
      editor :
        {
          xtype : 'datefield',
          format: 'Y-m-d H:i:s',
          submitFormat: 'c'
        }
      },
      {
        xtype: 'checkcolumn',
        header: 'Favorites',
        dataIndex: 'favorites',
        width: 55
      },
      {
        xtype: 'checkcolumn',
        header: 'Publish',
        dataIndex: 'publish',
        width: 55
      },
      {
        header: "UUID",
        dataIndex: 'uuid',
        width: 220,
        hidden: true
      },
      {
        header: 'Delete note',
        width: 70,
        sortable: false,
        renderer: function (){
            return '<button class="btn-delete">Delete</button>'
        },
        dataIndex: 'actionDelete'
      }
    ]
  });

  var grid = new Ext.grid.GridPanel
  ({
    id: 'myNotes',
    store: store,
    cm: cm,
    renderTo: 'editor-grid',
    width: 800,
    height: 300,
    stripeRows: true,
    plugins: [filters],
    autoExpandColumn: 'header',
    title: 'Notes list',
    frame: true,
    clicksToEdit: 1,
    tbar: [
      {
        text: 'Add new notes',
        handler: createNote
      }
    ],
    listeners: {
      scope: this,
      rowclick: actionWithNote
    }
  });
});