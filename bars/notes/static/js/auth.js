$(document).on('click', '.signIn', signIn);
$(document).on('click', '.signUp', signUp);
$(document).on('click', '.signOut', signOut);

function signUp() {

  Ext.QuickTips.init();

  Ext.form.Field.prototype.msgTarget = 'side';

  var bd = Ext.getBody();

  bd.createChild({tag: 'h2', html: ''});


  var signUp = new Ext.FormPanel({
    labelWidth: 75,
    frame: true,
    title: 'Please sign up',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    defaults: {width: 230},
    defaultType: 'textfield',
    items: [
      {
        fieldLabel: 'Login(e-mail)',
        name: 'email',
        vtype: 'email',
        allowBlank: false
      },
      {
        fieldLabel: 'Password',
        name: 'password',
        inputType: 'password',
        allowBlank: false
      },
      {
        fieldLabel: 'Password confirm',
        name: 'confirm',
        inputType: 'password',
        allowBlank: false
      }
    ],
    buttons: [
      {
        text: 'Sign up',
        handler: function(){
          signUp.getForm().submit({
            url: '/signup',
            success: function(form, action) {
              Ext.Msg.alert('Success', action.result.msg);
              signUp.hide();
              document.location.href = '/notes_list';
            },
            failure: function(form, action) {
              Ext.Msg.alert('Failed. Check your data.', action.result.msg);
            }
          })
        }
      },
      {
        text: 'Cancel',
        handler: function(){
         signUp.hide()
        }
      }
    ]
  });

  signUp.render(document.body);
}

function signIn() {

  Ext.QuickTips.init();

  Ext.form.Field.prototype.msgTarget = 'side';

  var bd = Ext.getBody();

  bd.createChild({tag: 'h2', html: ''});


  var signIn = new Ext.FormPanel({
    labelWidth: 75,
    frame: true,
    title: 'Please sign in',
    bodyStyle: 'padding:5px 5px 0',
    width: 350,
    defaults: {width: 230},
    defaultType: 'textfield',

    items: [
      {
        fieldLabel: 'Login(e-mail)',
        name: 'email',
        vtype: 'email',
        allowBlank: false
      },
      {
        fieldLabel: 'Password',
        name: 'password',
        inputType: 'password',
        allowBlank: false
      }
    ],

    buttons: [
      {
        text: 'Sign in',
        handler: function(){
          signIn.getForm().submit({
            url: '/signin',
            success: function(form, action) {
              Ext.Msg.alert('Success', action.result.msg);
              signIn.hide();
              document.location.href = '/notes_list';
            },
            failure: function(form, action) {
              Ext.Msg.alert('Failed. Check your data.', action.result.msg);
            }
          })
        }
      },
      {
        text: 'Cancel',
        handler: function(){
         signIn.hide()
        }
      }
    ]
  });

  signIn.render(document.body);
}

function signOut() {
  var signOut = function(btn) {
    console.info('You pressed ' + btn);
    if (btn == 'yes') {
      document.location.href = '/signout';
    }
  };
  Ext.MessageBox.show({
  title:'Confirm sign out',
  msg: 'Are you sure want to sign out?',
  buttons: Ext.MessageBox.YESNO,
  fn: signOut,
  icon : Ext.MessageBox.QUESTION
  });
}