function signUp() {

  Ext.QuickTips.init();

  // turn on validation errors beside the field globally
  Ext.form.Field.prototype.msgTarget = 'side';

  var bd = Ext.getBody();

  bd.createChild({tag: 'h2', html: 'Please sign up'});


  var simple = new Ext.FormPanel({
    labelWidth: 75, // label settings here cascade unless overridden
    url: 'save-form.php',
    frame: true,
    title: 'Sign up form',
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
        allowBlank: false
      },
      {
        fieldLabel: 'Password confirm',
        name: 'confirm',
        allowBlank: false
      }
    ],

    buttons: [
      {
        text: 'Sign up'
      },
      {
        text: 'Cancel'
      }
    ]
  });

  simple.render(document.body);
}


function signIn() {

  Ext.QuickTips.init();

  // turn on validation errors beside the field globally
  Ext.form.Field.prototype.msgTarget = 'side';

  var bd = Ext.getBody();

  bd.createChild({tag: 'h2', html: 'Please sign in'});


  var simple = new Ext.FormPanel({
    labelWidth: 75, // label settings here cascade unless overridden
    url: 'save-form.php',
    frame: true,
    title: 'Sign in form',
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
        allowBlank: false
      }
    ],

    buttons: [
      {
        text: 'Sign in'
      },
      {
        text: 'Cancel'
      }
    ]
  });

  simple.render(document.body);
}