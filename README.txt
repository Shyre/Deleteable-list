#Deletable-List component
    #date: 15-08-2012
    #version: 0.2
    #author: Sonni D. Hansen
    #email: sonnii.hansen@gmail.com
    #license: GPL v3

  
This is a rewrite of Jin p Myung's Ext.jsv.DeletableList       component. I didn't make this,I just rewrote it because i needed some extra features and added a Quick Guide to get started.
  
    #fixes: Bug's corrected, new animations added and drag list removes delete button.
 
####QUICK GUIDE: 
  If you aren't too familiar with Sencha Touch 2 and the Class system, 
  here's a quick guide to get you started.
 
 
  1st. Place this js file in the following dir: APPDIR/app/ux/ 
  
  2nd. Set Path just above your APP's Ext.application
 
 			Ext.Loader.setPath({
 				'Ext.ux': 'app/ux' //now we go a namespace to use
 			});
 
  3th. Add to requires
 			
 			Ext.application({
 				requires: ['Ext.ux.DeletableList']
 			});
 
  4th. Copy delete.png to APPDIR/resources/images/
 
  5th. Define your own list that extends the Ext.ux.DeletableList
 
 			Ext.define('MyApp.view.List', {
 				extend: 'Ext.ux.DeletableList',
 				
 				config: {
 					itemTpl: Ext.create('Ext.XTemplate',
 						.... list ....
 						'<p class="delete" style="position: absolute; right: 5px; top: 20px; display: none;">',
 							'<img src="resources/images/delete.png" alt="delete" />',
 						'</p>'
 					),						// like that
 					store: 'MyStore'		// require
 
 					deletable: {
 						storage: true,		// ajax, jsonp => false || localstorage, sessionstorage ... => true
 						message: true,
 						cls    : 'p.delete',
 						title  : 'Delete Item',
 						text   : 'Are you sure?'
 					}
 				}
 			});
 /