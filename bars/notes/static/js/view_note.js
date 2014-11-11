//function showNote (cpn, rowIndex, e) {
//  if(e.target.className.indexOf('btn-delete') > -1){
//    var uuid = cpn.store.getAt(rowIndex).get('uuid');
//    alert('helli!');
////    alert('item ' + rowIndex + ' clicked : ' + uuid);
////    var delNote = function(btn) {
////      console.info('You pressed ' + btn);
////      if (btn == 'yes') {
////        Ext.Ajax.request({
////          url: '/delete_note',
////          success: function (){
////            Ext.getCmp('myNotes').getView().ds.reload();
////          },
////          failure: function (){
////            alert('Error in server');
////          },
////          params: {uuid: uuid}
////        });
////      }
////    };
////    Ext.MessageBox.show({
////    title:'Delete note?',
////    msg: 'You are deleting this note. Continue?',
////    buttons: Ext.MessageBox.YESNO,
////    fn: delNote,
////    icon : Ext.MessageBox.QUESTION
////    });
//  }
//  console.debug(e);
//}
