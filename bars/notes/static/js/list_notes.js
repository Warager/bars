/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
*/
Ext.onReady(function() {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
            }
        }
        return cookieValue;
    }
    Ext.Ajax.on('beforerequest', function(conn, options){
        if (!(/^http:.*/.test(options.url) || /^https:.*/.test(options.url))) {
            options.headers = options.headers || {};
            options.headers["X-CSRFToken"] = getCookie('csrftoken');
        }
    }, this);
});
Ext.onReady(function () {
  var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
      sortable: true // columns are not sortable by default
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
        header: 'Category',
        dataIndex: 'category',
        width: 100
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

  var store = new Ext.data.JsonStore({
    // store configs
    autoLoad: true,
    autoDestroy: true,
    url: '/get_notes',
    storeId: 'myStore',
    // reader configs
    root: 'row',
    idProperty: 'uuid',
    fields: [
      'header',
      'category',
      {name: 'date_time', type: 'date'},
      {name:'favorites', type:'bool'},
      'text',
      'uuid'],
    writer: 'json',
    sortInfo: {field: 'date_time', direction: 'DESC'}
  });

  var grid = new Ext.grid.EditorGridPanel({
    id: 'myNotes',
    store: store,
    cm: cm,
    renderTo: 'editor-grid',
    width: 600,
    height: 300,
    autoExpandColumn: 'header', // column with this id will be expanded
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