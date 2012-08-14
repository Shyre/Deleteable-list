/*
 * #date: 		15-08-2012
 * #version: 	0.2
 * #author: 	Sonni D. Hansen
 * #email:    	sonnii.hansen@gmail.com
 * #license  	GPL v3
 *
 * #comment:	This is a rewrite of Jin p Myung's Ext.jsv.DeletableList component. I didn't make this,
 *				I just rewrote it because i needed some extra features and added a Quick Guide to get started.
 * #fixes:		Bug's corrected, new animations added and drag list removes delete button.
 *
 * QUICK GUIDE:
 * If you aren't too familiar with Sencha Touch 2 and the Class system, 
 * here's a quick guide to get you started.
 *
 *
 * 1st. Place this js file in the following dir: APPDIR/app/ux/ 
 * 
 * 2nd. Set Path just above your APP's Ext.application
 *
 *			Ext.Loader.setPath({
 *				'Ext.ux': 'app/ux' //now we go a namespace to use
 *			});
 *
 * 3th. Add to requires
 *			
 *			Ext.application({
 *				requires: ['Ext.ux.DeletableList']
 *			});
 *
 * 4th. Copy delete.png to APPDIR/resources/images/
 *
 * 5th. Define your own list that extends the Ext.ux.DeletableList
 *
 *			Ext.define('MyApp.view.List', {
 *				extend: 'Ext.ux.DeletableList',
 *				
 *				config: {
 *					itemTpl: Ext.create('Ext.XTemplate',
 *						.... list ....
 *						'<p class="delete" style="position: absolute; right: 5px; top: 20px; display: none;">',
 *							'<img src="resources/images/delete.png" alt="delete" />',
 *						'</p>'
 *					),						// like that
 *					store: 'MyStore'		// require
 *
 *					deletable: {
 *						storage: true,		// ajax, jsonp => false || localstorage, sessionstorage ... => true
 *						message: true,
 *						cls    : 'p.delete',
 *						title  : 'Delete Item',
 *						text   : 'Are you sure?'
 *					}
 *				}
 *			});
 */

Ext.define('Ext.ux.DeletableList', {
    extend: 'Ext.List',

    config: {
        deletable: null,
        scrollable: {
            directionLock: true
        }
    },

    initialize: function () {
        this.callParent();
        this.prevTarget = null;
        this.oldDel = null;

        // store
        if (this.getStore()) {
            this.addStore = this.getStore();
        } else {
            this.warnMsg('Deletable Store', 'Please set store. Or it doesn\'t work!');
        }

        // setting of plugin
        if (this.getDeletable()) {
            this.setting = this.getDeletable();

            Ext.applyIf(this.setting, {
                storage: this.setting.storage || false,
                message: this.setting.message || false,
                cls: this.setting.cls || '.delete',
                title: this.setting.title || 'Delete Item',
                text: this.setting.text || 'Are you sure?'
            });
        } else {
            this.warnMsg('Deletable Store', 'Please set config for deletable list. Or it doesn\'t work!');
        }

        // event listeners
        this.on('itemswipe', this.onItemSwipeList, this);
        this.on('deleteitem', this.onDeleteItemList, this);
        this.getScrollable().getScroller().on('scrollstart', this.onScrollStart, this);
    },

    onScrollStart: function (list) {
        this.toogleDel(null);
    },

    onItemSwipeList: function (list, idx, target) {
        var me = this,
			cls = this.setting.cls;
        del = target.down(cls);


        if (del != this.oldDel) {
            // animate
            this.toggleVisualElement(del, false);
            this.oldDel = del;

            // event
            del.on('tap', function () {
                if (target != this.prevTarget) {
                    me.fireEvent('deleteitem', me, del, idx, target);
                    this.prevTarget = target;
                }
            }, list, {
                single: true
            });
        }

        // show or hide
        this.toogleDel(del);
    },

    onDeleteItemList: function (list, del, idx, target) {
        var message = this.setting.message,
			title = this.setting.title,
			text = this.setting.text;

        this.del = del;
        this.idx = idx;

        if (message) {
            Ext.Msg.confirm(title, text, this.doDeleteItem, this);
        } else {
            this.doDeleteItem('yes', del, idx);
        }
    },

    doDeleteItem: function (buttonId) {
        this.del.hide();

        if (buttonId === 'yes') {
            var store = this.addStore,
				storage = this.setting.storage;

            store.removeAt(this.idx);

            if (storage) {
                store.sync();
            }
        }
    },
    
    toogleDel: function (newDelBtn) {
        if (newDelBtn == null) {
            if (this.oldDelBtn) {
                this.toggleVisualElement(this.oldDelBtn, true);
                this.oldDelBtn = null;
            }
        }
        else {
            // first time or this.oldDelBtn = null;
            if (!this.oldDelBtn && this.oldDelBtn !== newDelBtn) {
                this.toggleVisualElement(newDelBtn, false);
                this.oldDelBtn = newDelBtn;
            } else {
                // if you swipe again
                if (this.oldDelBtn == newDelBtn) {
                    this.toggleVisualElement(newDelBtn, true);
                    this.oldDelBtn = null;
                }
                // old button is hide
                // new buttin is show
                else {
                    this.toggleVisualElement(newDelBtn, false);
                    this.toggleVisualElement(this.oldDelBtn, true);
                    this.oldDelBtn = newDelBtn;
                }
            }
        }
    },

    toggleVisualElement: function (el, _out) {
        el.nextVisibleState = _out;
        Ext.Anim.run(el, _out ? 'fade' : 'flip', {
            out: _out,
            duration: 400,
            before: function (cmp) {
                if (!cmp.nextVisibleState) {
                    cmp.show();
                }
            },
            after: function (cmp) {
                if (cmp.nextVisibleState) {
                    cmp.hide();
                }
            }
        });
    },

    warnMsg: function (title, text) {
        Ext.Msg.alert(title, text, Ext.emptyFn);
    }
});