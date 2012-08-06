/**
* @package shorty an ownCloud url shortener plugin
* @category internet
* @author Christian Reiner
* @copyright 2011-2012 Christian Reiner <foss@christian-reiner.info>
* @license GNU Affero General Public license (AGPL)
* @link information http://apps.owncloud.com/content/show.php/OC.Shorty?content=150401
* @link repository https://svn.christian-reiner.info/svn/app/oc/shorty
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
* License as published by the Free Software Foundation; either
* version 3 of the license, or any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU AFFERO GENERAL PUBLIC LICENSE for more details.
*
* You should have received a copy of the GNU Affero General Public
* License along with this library.
* If not, see <http://www.gnu.org/licenses/>.
*
*/

/**
 * @file js/shorty.js
 * @brief Client side activity library
 * @author Christian Reiner
 */

/**
 * @class OC.Shorty
 * @brief Central activity library for the client side
 * @author Christian Reiner
 */
OC.Shorty={
	/**
	* @class OC.Shorty.WUI
	* @brief Collection of all methods implementing the UI of this app
	* @description "WUI" stands for "Web User Interface" :-)
	* @author Christian Reiner
	*/
	WUI:{
		/**
		* @class OC.Shorty.WUI.Controls
		* @brief Collection of methods implementing the top control bar
		* @author Christian Reiner
		*/
		Controls:{
			/**
			* @method OC.Shorty.WUI.Controls.init
			* @brief Initializes the control bar after it loaded
			* @author Christian Reiner
			*/
			init: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("init controls");
				var dfd = new $.Deferred();
				$.when(
					OC.Shorty.WUI.Controls.toggle()
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Controls.init
			/**
			* @method OC.Shorty.WUI.Controls.toggle
			* @brief Toggles the control bar (open/close)
			* @author Christian Reiner
			*/
			toggle: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle controls");
				var dfd = new $.Deferred();
				OC.Shorty.WUI.Notification.hide();
				// show or hide dialog
				var controls = $('#controls');
				if ( ! controls.is(':visible')){
					$.when(
						controls.slideDown('slow')
					).done(dfd.resolve)
				}else{
					$.when(
						controls.slideUp('fast')
					).done(dfd.resolve)
				}
				return dfd.promise();
			}, // OC.Shorty.WUI.Controls.toggle
		}, // OC.Shorty.WUI.Controls
		/**
		* @brief Collection of methods implementing the central 'Desktop' where all real action takes place
		* @author Christian Reiner
		*/
		Desktop:{
			/**
			* @class OC.Shorty.WUI.Desktop
			* @brief Shows the central desktop
			* @author Christian Reiner
			*/
			show: function(duration){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("show desktop");
				duration = duration || 'slow';
				var dfd = new $.Deferred();
				$.when($('#desktop').fadeTo(duration,1.0)).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Desktop.show
			/**
			* @class OC.Shorty.WUI.Desktop.hide
			* @brief Hides the central desktop
			* @author Christian Reiner
			*/
			hide: function(duration){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("hide desktop");
				duration = duration || 'slow';
				var dfd = new $.Deferred();
				$.when($('#desktop').fadeTo(duration,0.3)).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Desktop.hide
		}, // OC.Shorty.WUI.Desktop
		/**
		* @class OC.Shorty.WUI.Dialog
		* @brief A collection of methods used for handling dialogs
		* @author Christian Reiner
		*/
		Dialog:{
			/**
			* @method OC.Shorty.WUI.Dialog.execute
			* @brief Execute a dialog, including preparing the desktop beforehand
			* @param dialog jQueryObject Representation of the existing dialog
			* @author Christian Reiner
			*/
			execute: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("execute dialog "+dialog.attr('id'));
				var dfd = new $.Deferred();
				switch ( dialog.attr('id') ){
					case 'dialog-add':
						$.when(
							OC.Shorty.WUI.Notification.hide(),
							OC.Shorty.Action.Url.add()
						).done(dfd.resolve)
						break;

					case 'dialog-edit':
						$.when(
							OC.Shorty.WUI.Notification.hide(),
							OC.Shorty.Action.Url.edit()
						).done(dfd.resolve)
						break;

					case 'dialog-del':
						$.when(
							OC.Shorty.WUI.Notification.hide(),
							OC.Shorty.Action.Url.del()
						).done(dfd.resolve)
						break;

					default:
						dfd.resolve();
				} // switch
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.execute
			/**
			* @method OC.Shorty.WUI.Dialog.hide
			* @brief Hides a dialog
			* @param dialog jQueryObject Represents the dialog to be handled
			* @desrciption
			* Also moves the dialog code back to its 'parking place' in case of embedded dialogs.
			* This method is save for already hidden dialogs.
			* @author Christian Reiner
			*/
			hide: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("hide dialog "+dialog.attr('id'));
				var duration = 'slow';
				var dfd = new $.Deferred();
				if (!dialog.is(':visible')) dfd.resolve();
				else{
					$.when(
						dialog.slideUp(duration)
					).pipe(function(){
						switch ( dialog.attr('id') ){
							case 'dialog-add':
								dialog.find('#confirm').off('click');
								dialog.find('#target').off('focusout');
								break;

							default:
						} // switch
					}).pipe(function(){
						if (dialog.hasClass('shorty-standalone'))
							OC.Shorty.WUI.Desktop.show();
					}).done(dfd.resolve)
				}
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.hide
			/**
			* @method OC.Shorty.WUI.Dialog.reset
			* @brief Resets a dialog to its default values
			* @param dialog jQueryObject Represents the dialog to be handled
			* @description The default values are read from the 'data-...' attributes stored in the specifically handled item.
			* @author Christian Reiner
			*/
			reset: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("reset dialog "+dialog.attr('id'));
				var dfd = new $.Deferred();
				if (dialog){
					// reset dialog fields
					$.when(
						$.each(dialog.find('#status'),function(){
							if($(this).is('[data]'))
								 $(this).val($(this).attr('data'));
							else $(this).val('');
						}),
						$.each(dialog.find('input,textarea'),function(){
							if($(this).is('[data]'))
								 $(this).val($(this).attr('data')).attr('placeholder',$(this).attr('data'));
							else $(this).val('').attr('placeholder','');
						}),
						$.each(dialog.find('.shorty-value'),function(){
							if($(this).is('[data]'))
								 $(this).text($(this).attr('data'));
							else $(this).text('');
						}),
						$.each(dialog.find('.shorty-icon'), function(){
							if($(this).is('[data]'))
								 $(this).attr('src',$(this).attr('data'));
							else $(this).attr('src','');
						}),
						OC.Shorty.WUI.Dialog.sharpen(dialog,false)
					).done(dfd.resolve)
				}
				else
				dfd.resolve();
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.reset
			/**
			* @method OC.Shorty.WUI.Dialog.sharpen
			* @brief Activates the button that triggers an action
			* @param dialog jQueryObject Represents the dialog to be handled
			* @param sharpness bool Flag indicating if the dialog should be sharpened or unsharpened
			* @description
			* Before dialogs are 'sharpened' clicking the finalizing action button is suppressed.
			* This is done to allow some in-dialog validation routines to complete (like fetching url meta data)
			* @author Christian Reiner
			*/
			sharpen: function(dialog,sharpness){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle sharpness of dialog '"+dialog.attr('id')+"' to "+sharpness);
				var confirm=dialog.find('#confirm');
				if (sharpness){
					confirm.off('click');
					confirm.on('click',{dialog: dialog}, function(event){
						event.preventDefault();
						OC.Shorty.WUI.Dialog.execute(event.data.dialog);
					});
					confirm.addClass('sharp');
				}else{
					confirm.off('click');
					confirm.on('click',function(event){
						event.preventDefault();
						dialog.find('#target').effect('highlight',{'color':'#CCCCCC'},500);
					});
					confirm.removeClass('sharp');
				}
			}, // OC.Shorty.WUI.Dialog.sharpen
			/**
			* @method OC.Shorty.WUI.Dialog.show
			* @brief Makes an existing dialog visible
			* @param dialog jQueryObject Represents the dialog to be handled
			* @author Christian Reiner
			*/
			show: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("show dialog "+dialog.attr('id'));
				var duration = 'slow';
				var dfd = new $.Deferred();
				if (dialog.is(':visible'))
					// dialog already open, nothing to do...
					dfd.resolve();
				else{
					$('.shorty-dialog').not(dialog.parents('.shorty-dialog')).each(function(){
						OC.Shorty.WUI.Dialog.hide($(this));
					});
					// hide 'old' notifications
					OC.Shorty.WUI.Notification.hide(),
					// some preparations
					$.when(
						function(){
							var dfd = new $.Deferred();
							if (dialog.hasClass('shorty-standalone'))
								$.when(OC.Shorty.WUI.Desktop.hide()).done(dfd.resolve)
							else dfd.resolve();
							return dfd.promise();
						}()
					).pipe(function(){
						// prevent submission before entering anything
						OC.Shorty.WUI.Dialog.sharpen(dialog,false);
						// show dialog
						dialog.slideDown(duration);
					}).pipe(function(){
						// initialize dialog actions
						switch(dialog.attr('id')){
							case 'dialog-add':
								OC.Shorty.WUI.Dialog.sharpen(dialog,false);
								dialog.find('#target').focus();
								dialog.find('#target').on('focusout', {dialog: dialog}, function(event){
									$.when(
										OC.Shorty.WUI.Meta.collect(event.data.dialog)
									).done(function(){
										OC.Shorty.WUI.Dialog.sharpen(dialog,true);
									}).fail(function(){
										OC.Shorty.WUI.Dialog.sharpen(dialog,false);
									})
								});
								break;

							case 'dialog-edit':
								dialog.find('#title').focus();
								OC.Shorty.WUI.Dialog.sharpen(dialog,true);
								break;

							case 'dialog-share':
								var status=dialog.find('#status');
								dialog.find('.status-hint').hide().filter('#'+status.val()).show();
								status.on('change', {dialog: dialog}, function(event){
									dialog.find('.status-hint').hide().filter('#'+status.val()).fadeIn('fast');
								});
								break;
						} // switch
					}).done(dfd.resolve).fail(dfd.reject)
				} // else
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.show
			/**
			* @method OC.Shorty.WUI.Dialog.toggle
			* @brief Toggles the visibility of an existing dialog
			* @param dialog jQueryObject Represents the dialog to be handled
			* @author Christian Reiner
			*/
			toggle: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle dialog "+dialog.attr('id'));
				var dfd = new $.Deferred();
				OC.Shorty.WUI.Notification.hide();
				// show or hide dialog
				if ( ! dialog.is(':visible'))
					 $.when(OC.Shorty.WUI.Dialog.show(dialog)).done(dfd.resolve)
				else $.when(OC.Shorty.WUI.Dialog.hide(dialog)).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.toggle
			/**
			* @method OC.Shorty.WUI.Dialog.wipe
			* @brief Wipes all values inside an existing dialog
			* @param dialog jQueryObject Represents the dialog to be handled
			* @description Helps to remove left overs from a previous usage of a dialog
			* @author Christian Reiner
			*/
			wipe: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("wipe dialog "+dialog.attr('id'));
				var dfd = new $.Deferred();
				if (dialog){
					// wipe dialog fields
					$.when(
						$.each(dialog.find('#status'),      function(){$(this).attr('data','blocked');$(this).val('blocked');}),
						$.each(dialog.find('input'),        function(){$(this).attr('data','');$(this).val('');}),
						$.each(dialog.find('textarea'),     function(){$(this).attr('data','');$(this).val('');}),
						$.each(dialog.find('.shorty-value'),function(){$(this).attr('data','');$(this).text('');}),
						$.each(dialog.find('.shorty-icon'), function(){$(this).attr('data','');$(this).attr('src','');}),
						OC.Shorty.WUI.Dialog.sharpen(dialog,false)
					).done(dfd.resolve)
				}
				else
					dfd.resolve();
				return dfd.promise();
			}, // OC.Shorty.WUI.Dialog.wipe
		}, // OC.Shorty.WUI.Dialog
		/**
		* @class OC.Shorty.WUI.Entry
		* @brief Collection of methods handling entries (represented objects like OC.Shortys)
		* @author Christian Reiner
		*/
		Entry:{
			/**
			* @method OC.Shorty.WUI.Entry.click
			* @brief Triggers the action specific for each action button offered for a list item
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			click: function(event,element){
				var dfd = new $.Deferred();
				var entry=element.parents('tr').first();
				if (OC.Shorty.Debug) OC.Shorty.Debug.log(event.type+" on action "+element.attr('id')+" for entry "+entry.attr('id'));
				// close any visible dialogs first (exception: dialogs containing the clicked element)
				if ($('.shorty-standalone').is(':visible')){
					$('.shorty-standalone').not(element.parents('.shorty-dialog')).each(function(){
						OC.Shorty.WUI.Dialog.hide($(this));
					});
				}
				// highlight clicked row as active entry
				$.when(
					OC.Shorty.WUI.List.highlight(element.parents('.shorty-list'),entry)
				).pipe(function(){
					if ('click'==event.type){
						switch(element.attr('id')){
							case 'close':
								break;

							case 'del':
								OC.Shorty.WUI.Entry.del(entry);
								break;

							case 'edit':
								OC.Shorty.WUI.Entry.edit(entry);
								break;

							case 'open':
								OC.Shorty.Action.Url.forward(entry);
								break;

							case 'share':
								OC.Shorty.WUI.Entry.share(entry);
								break;

							case 'show':
								OC.Shorty.WUI.Entry.show(entry);
								break;

							default: // probably an action registered by another plugin...
								// execute the function specified inside the clicked element:
								if (typeof $(element).attr('data_method')!=='undefined'){
									if (OC.Shorty.Debug) OC.Shorty.Debug.log("handing control to registered action");
									executeFunctionByName($(element).attr('data_method'),window,entry);
								}
						} // switch
					} // if click
				}).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Entry.click
			/**
			* @method OC.Shorty.WUI.Entry.del
			* @brief Marks a list item as 'deleted' by changing its 'status'
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			del: function(entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("delete entry "+entry.attr('id'));
				if (entry.hasClass('deleted')){
					// change status to deleted
					OC.Shorty.Action.Url.status(entry.attr('data-id'),'blocked');
					// mark row as undeleted
					entry.removeClass('deleted');
				}else{
					// change status to deleted
					OC.Shorty.Action.Url.status(entry.attr('data-id'),'deleted');
					// mark row as deleted
					entry.addClass('deleted');
				}
			}, // OC.Shorty.WUI.Entry.del
			/**
			* @method OC.Shorty.WUI.Entry.edit
			* @brief prepares the 'edit' action/dialog
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			edit: function(entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("modify entry "+entry.attr('id'));
				var dfd = new $.Deferred();
				// use the existing edit dialog for this
				var dialog=$('#controls #dialog-edit');
				// load entry into dialog
				dialog.find('#id').val(entry.attr('data-id'));
				dialog.find('#status').val(entry.attr('data-status')||'');
				dialog.find('#source').val(entry.attr('data-source'||''));
				dialog.find('#relay').val(entry.attr('data-relay'||''));
				dialog.find('#target').val(entry.attr('data-target'||''));
				dialog.find('#title').val(entry.attr('data-title')||'');
				dialog.find('#clicks').val(entry.attr('data-clicks')||'');
				dialog.find('#created').val(entry.attr('data-created')||'');
				dialog.find('#accessed').val(entry.attr('data-accessed')||'');
				dialog.find('#notes').val(entry.attr('data-notes')||'');
				// leave until date empty if not specify (do NOT fill in the current date)
				if (entry.attr('data-until'))
					 dialog.find('#until').datepicker('setDate',new Date(entry.attr('data-until'))||'')
										  .datepicker('refresh');
				else dialog.find('#until').datepicker('refresh');
				// open edit dialog
				$.when(
					OC.Shorty.WUI.Dialog.show(dialog)
				).done(function(){
					OC.Shorty.WUI.Meta.collect(dialog);
				});
				return dfd.promise();
			}, // OC.Shorty.WUI.Entry.edit
			/**
			* @method OC.Shorty.WUI.Entry.send
			* @brief prepares the 'send' action
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			send: function(event,element){
				var dfd = new $.Deferred();
				var entry=element.parents('table').parents('tr');
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("send action "+element.attr('id')+" on entry "+entry.attr('data-id'));
				// take action
				$.when(
					OC.Shorty.Action.Url.send(element,entry)
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Entry.send
			/**
			* @method OC.Shorty.WUI.Entry.share
			* @brief prepares the 'share' action/dialog
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			share: function(entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("share entry "+entry.attr('id'));
				var dfd = new $.Deferred();
				// use the existing 'share' dialog for this
				var dialog=$('#dialog-share');
				// fill and show dialog
				dialog.find('#id').val(entry.attr('data-id'))
								.attr('data',entry.attr('data-id'));
				dialog.find('#source').attr('href',entry.attr('data-source'))
									.text(entry.attr('data-source'));
				dialog.find('#relay').attr('href',entry.attr('data-relay'))
									.text(entry.attr('data-relay'));
				dialog.find('#target').attr('href',entry.attr('data-target'))
									.text(entry.attr('data-target'));
				dialog.find('#status').attr('value',entry.attr('data-status'))
									.attr('data',entry.attr('data-status'));
				// move 'share' dialog towards entry
				dialog.appendTo(entry.find('td#actions')),
				// open dialog
				$.when(
					OC.Shorty.WUI.Dialog.show(dialog)
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Entry.share
			/**
			* @method OC.Shorty.WUI.Entry.show
			* @brief prepares the 'show' action/dialog
			* @param entry jQueryObject Representation of a lists item to be handled
			* @author Christian Reiner
			*/
			show: function(entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("show entry "+entry.attr('id'));
				var dfd = new $.Deferred();
				// use the existing edit dialog for this
				var dialog=$('#controls #dialog-show');
				// load entry into dialog
				dialog.find('#id').attr('data-id',entry.attr('data-id')).val(entry.attr('data-id'));
				dialog.find('#status').attr('data-status',entry.attr('data-status')||'').val(t('shorty',entry.attr('data-status'))||'');
				dialog.find('#source').attr('data-source',entry.attr('data-source')).val(entry.attr('data-source'));
				dialog.find('#relay').attr('data-relay',entry.attr('data-relay')).val(entry.attr('data-relay'));
				dialog.find('#target').attr('data-target',entry.attr('data-target')).val(entry.attr('data-target'));
				dialog.find('#title').attr('data-title',entry.attr('data-title')).val(entry.attr('data-title'));
				dialog.find('#until').attr('data-until',entry.attr('data-until')||'').val(entry.attr('data-until')||'');
				dialog.find('#clicks').attr('data-clicks',entry.attr('data-clicks')||'').val(entry.attr('data-clicks')||'');
				dialog.find('#created').attr('data-created',entry.attr('data-created')||'').val(entry.attr('data-created')||'');
				dialog.find('#accessed').attr('data-accessed',entry.attr('data-accessed')||'').val(entry.attr('data-accessed')||'');
				dialog.find('#notes').attr('data-notes',entry.attr('data-notes')).val(entry.attr('data-notes'));
				// open show dialog
				$.when(
					OC.Shorty.WUI.Dialog.show(dialog)
				).done(function(){
					OC.Shorty.WUI.Meta.collect(dialog);
				});
				return dfd.promise();
			} // OC.Shorty.WUI.Entry.show
		}, // OC.Shorty.WUI.Entry
		/**
		* @class OC.Shorty.WUI.Hourglass
		* @brief Handling of the desktops 'hourglass' activity indicator
		* @author Christian Reiner
		*/
		Hourglass:{
			/**
			* @method OC.Shorty.WUI.Hourglass.toggle
			* @brief Toggles the visibility of the desktop hourglass
			* @param show bool Flag indicating of the list should be shown or hidden
			* @author Christian Reiner
			*/
			toggle: function(show){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle hourglass to "+show?"true":"false");
				var dfd = new $.Deferred();
				var hourglass = $('#desktop .shorty-hourglass');
				if (show){
				if (hourglass.is(':visible'))
					dfd.resolve();
				else
					$.when(
						hourglass.fadeIn('fast')
					).done(dfd.resolve)
				}else{
					if (!hourglass.is(':visible'))
						dfd.resolve();
					else
						$.when(
							hourglass.fadeOut('slow')
						).done(dfd.resolve)
				}
				return dfd.promise();
			}, // OC.Shorty.WUI.Hourglass.toggle
		}, // OC.Shorty.WUI.Hourglass
		/*
		* @class OC.Shorty.WUI.List
		* @brief Collection of methods handling lists
		* @author Christian Reiner
		*/
		List:{
			/**
			* @method OC.Shorty.WUI.List.add
			* @brief Adds a list of elements to an existing list
			* @param list jQueryObject Representation of the 'list'
			* @param elements array List of elements to be added
			* @param hidden bool Flag that controls if added entries should be kept hidden for a later visualization (highlighting)
			* @return Deferred.promise
			* @author Christian Reiner
			*/
			add:function(list,elements,hidden){
				var context=this;
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("add "+elements.length+" entries to list");
				var dfd = new $.Deferred();
				// insert list elements (sets) one by one
				var row,set;
				$(elements).each(function(i,set){
					// clone dummy row from list header: dummy is the last row
					row = list.find('thead tr:last-child').first().clone();
					// add attributes to row, as data and value
					context.ListAddEnrich.apply(context,[row,set,hidden]);
					// insert new row in table
					context.ListAddInsert.apply(context,[list,row]);
					dfd.resolve();
				}) // each
				return dfd.promise();
			}, // OC.Shorty.WUI.List.add
			/**
			* @method OC.Shorty.WUI.List.build
			* @brief Builds the content of a list by retrieving and adding entries
			* @author Christian Reiner
			*/
			build: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("build list");
				var dfd = new $.Deferred();
				// prepare loading
				$.when(
					OC.Shorty.WUI.Hourglass.toggle(true),
					OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),false)
				).done(function(){
					// retrieve new entries
					$.when(
						OC.Shorty.WUI.List.get()
					).pipe(function(response){
						OC.Shorty.WUI.List.empty($('#list-of-shortys').first());
						OC.Shorty.WUI.List.fill.apply(OC.Shorty.Runtime.Context.ListOfShortys,[$('#list-of-shortys').first(),response.data]);
					}).done(function(){
						$.when(
							OC.Shorty.WUI.List.show(),
							OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),true)
						).always(function(){
							OC.Shorty.WUI.Hourglass.toggle(false)
							dfd.resolve();
						})
					}).fail(function(){
						dfd.reject();
					})
				})
				return dfd.promise();
			}, // OC.Shorty.WUI.List.build
			/**
			* @method OC.Shorty.WUI.List.dim
			* @brief Dims the content of a list so that manipulations can be done without having to close it
			* @param list jQueryObject Representing the list to be handled
			* @param show bool Flag indicating of the list should be dimmed of re-shown
			* @author Christian Reiner
			*/
			dim: function(list,show){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("dim list to "+(show?"true":"false"));
				var duration='slow';
				var dfd =new $.Deferred();
				var body=list.find('tbody');
				if (show)
				{
					var rows=body.find('tr.shorty-fresh');
					OC.Shorty.WUI.List.highlight(list,rows.first());
					rows.each(function(){
						$(this).removeClass('shorty-fresh');
						$(this).find('td').effect('pulsate');
					});
					$.when(
						OC.Shorty.WUI.List.vacuum(),
						body.fadeIn(duration)
					).done(dfd.resolve)
				}else{
					if (!body.is(':visible'))
						dfd.resolve();
					else
					{
						$.when(
							body.fadeOut(duration)
						).done(dfd.resolve)
					}
				}
				return dfd.promise();
			}, // OC.Shorty.WUI.List.dim
			/**
			* @method OC.Shorty.WUI.List.empty
			* @brief Clears a list by removing all its rows
			* @param list jQueryObject Represents the list to be handled
			* @description Will only clear the list body, header entries like titlebar and toolbar will be left untouched
			* @author Christian Reiner
			*/
			empty: function(list){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("empty list");
				var dfd = new $.Deferred();
				// move embedded dialogs back to their safe place in the controls
				$('.shorty-embedded').appendTo($('#controls #dialog-show'));
				// remove all rows, one by one
				$.when(
					list.find('tbody tr').each(function(){
						$(this).remove();
				})
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.List.empty
			/**
			* @method OC.Shorty.WUI.List.fill
			* @brief (Re-)Fills a list with al elements from the given set
			* @param list jQueryObject Represents the list to be handled
			* @param elements array list of elements to be filled in the lists
			* @author Christian Reiner
			*/
			fill: function(list,elements){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("fill list");
				var dfd = new $.Deferred();
				$.when(
					OC.Shorty.WUI.List.add.apply(this,[list,elements,false])
				).pipe(
					this.ListFillFilter.apply(this,[list])
				).done(dfd.resolve).fail(dfd.reject)
				return dfd.promise();
			}, // OC.Shorty.WUI.List.fill
			/**
			* @method OC.Shorty.WUI.List.filter
			* @brief Filters a given list by comparing column values to a given value pattern
			* @param object list: jQuery object representing the list to filter (html table)
			* @param string column: Name (id) of the column to consider
			* @param string pattern: Pattern to compare the cells content against
			* @return object Deferred object
			* @author Christian Reiner
			*/
			filter: function(list,column,pattern){
				// we define a default reference callback function referencing the 'data-...' attributes in the rows
				var reference=  this.ColumnValueReference[column]
				              ||function(){return $(this).parent().attr('data-'+column);};
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("filter list by column '"+column+"' and pattern '"+pattern+"'");
				var dfd = new $.Deferred();
				$.when(
					list.find('tbody tr td#'+column).filter(function(){
						// compare equality of value and pattern using the reference callback as value
						return (-1==reference.call(this).toLowerCase().indexOf(pattern.toLowerCase()));
					}).addClass('shorty-filtered'),
					list.find('tbody tr td#'+column).filter(function(){
						// compare NON-equality of value and pattern using the reference callback as value
						return (-1!=reference.call(this).toLowerCase().indexOf(pattern.toLowerCase()));
					}).removeClass('shorty-filtered'),
					list.find('tbody tr').filter(':has(td.shorty-filtered)').addClass('shorty-filtered'),
					list.find('tbody tr').not(':has(td.shorty-filtered)').removeClass('shorty-filtered')
				).done(dfd.resolve).fail(dfd.reject)
				return dfd.promise();
			}, // OC.Shorty.WUI.List.filter
			/**
			* @method OC.Shorty.WUI.List.get
			* @brief Retrieves the list of OC.Shortys from the server
			* @return object Deferred object
			* @author Christian Reiner
			*/
			get: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("get list");
				var dfd = new $.Deferred();
				$.when(
					$.ajax({
						type:     'GET',
						url:      OC.filePath('shorty','ajax','list.php'),
						cache:    false,
						dataType: 'json'
					}).pipe(
						function(response){return OC.Shorty.Ajax.eval(response)},
						function(response){return OC.Shorty.Ajax.fail(response)}
					)
				).done(function(response){
					dfd.resolve(response);
				}).fail(function(response){
					dfd.reject(response);
				})
				return dfd.promise();
			}, // OC.Shorty.WUI.List.get
			/**
			* @method OC.Shorty.WUI.List.hide
			* @brief Hides the list of OC.Shortys
			* @param string duration: The duration the hiding animation should take (optional)
			* @return object Deferred object
			* @author Christian Reiner
			*/
			hide: function(duration){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("hide list");
				duration = 'slow';
				var dfd = new $.Deferred();
				var list = $('#list-of-shortys');
				if ( ! list.is(':visible'))
					dfd.resolve();
				else $.when(list.fadeOut(duration)).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.List.hide
			/**
			* @method OC.Shorty.WUI.List.highlight
			* @brief highlights a given entry in the list of OC.Shortys
			* @param object entry: jQuery object representing the entry to highlight
			* @return object Deferred object
			* @author Christian Reiner
			*/
			highlight: function(list,entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("highlighting list entry "+entry.attr('id'));
				var dfd = new $.Deferred();
				// close any open embedded dialog
				$.when(
					// close any potentially open embedded dialogs
					// this closes action dialogs when clicking on another row
					// appears to be less intuitive otherwise, since you'd have to EXPLICITLY close an open dialog otherwise
					OC.Shorty.WUI.Dialog.hide($('.shorty-embedded'))
				).pipe(function(){
					// neutralize all rows that might have been highlighted
					list.find('tr.clicked').removeClass('clicked');
					entry.addClass('clicked');
				}).always(dfd.resolve);
				return dfd.promise();
			}, // OC.Shorty.WUI.List.highlight
			/**
			* @method OC.Shorty.WUI.List.modify
			* @brief Modifies existing entries in the list to match updated data
			* @param object list: jQuery object representing the list
			* @param bool hidden: Flag indicating if modified rows should be kept hidden for later highlighting
			* @return object Deferred object
			* @author Christian Reiner
			*/
			modify: function(list,hidden){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("modify entry in list holding "+list.length+" entries");
				var dfd = new $.Deferred();
				// modify list elements (sets) one by one
				var row,set;
				$.each(list,function(i,set){
					// select row from list by id
					row=$('#list-of-shortys tbody tr#'+set.id);
					// modify attributes in row, as data and value
					$.each(['status','title','until','notes'],function(j,aspect){
						if (typeof set[aspect]==='undefined') set[aspect]='';
						// enhance row with actual set values
						row.attr('data-'+this,set[aspect]);
						if (hidden) row.addClass('shorty-fresh');
						// fill data into corresponsing column
						var content, classes=[];
						switch(aspect){
							case 'until':
								if (!set[aspect]){
									content="-"+t('shorty',"never")+"-";
									row.removeClass('shorty-expired');
								}else{
									content=set[aspect];
									if (dateExpired(set[aspect]))
										row.addClass('shorty-expired');
									else row.removeClass('shorty-expired');
								}
								break;

							case 'title':
								classes.push('ellipsis');
								content=set[aspect];
								break;

							case 'status':
								if ('deleted'==set[aspect])
								row.addClass('deleted');
								content=t('shorty',set[aspect]);
								break;

							default:
								content=set[aspect];
						} // switch
						// show modified column immediately or keep it for a later pulsation effect ?
						row.find('td').filter('#'+aspect).html('<span class="'+classes.join(' ')+'">'+content+'</span>');
					}) // each aspect
				}) // each entry
				return dfd.resolve().promise();
			}, // OC.Shorty.WUI.List.modify
			/**
			* @method OC.Shorty.WUI.List.show
			* @brief Shows the list if it was hidden
			* @param string duration Duration the animation should take (optional)
			* @return object Deferred object
			* @author Christian Reiner
			*/
			show: function(duration){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("show list");
				duration = duration | 'slow';
				var dfd = new $.Deferred();
				var list = $('#list-of-shortys');
				if (list.is(':visible'))
				dfd.resolve();
				else
				{
					// list currently not visible, show it
					$.when(
						list.find('tbody').show(),
						list.fadeIn(duration)
					).done(function(){
						dfd.resolve();
						OC.Shorty.WUI.List.vacuum();
					})
				}
				return dfd.promise();
			}, // OC.Shorty.WUI.List.show
			/**
			* @method OC.Shorty.WUI.List.sort
			* @brief Sorts a list by the values of a specified column
			* @param object list The list object in the DOM
			* @param string A two letter code as defined in lib/type.php
			* @author Christian Reiner
			*/
			sort: function(list,sortCode){
				sortCore = sortCode || 'cd';
				var icon=list.find('thead tr#toolbar th div img[data-sort-code="'+sortCode+'"]');
				var sortCol=icon.parents('th').attr('id');
				var sortDir=icon.attr('data-sort-direction');
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("sorting list column "+sortCol+" "+(sortDir=='asc'?'ascending':'descending'));
				// use the 'tinysort' jquery plugin for sorting
				switch (sortCol){
					case 'until':
						list.find('tbody>tr').tsort('td#until',{order:sortDir});
						break;

					default:
						list.find('tbody>tr').tsort({attr:'data-'+sortCol,order:sortDir});
				} // switch
				// mark currently active sort icon
				var icons=list.find('thead tr#toolbar img.shorty-sorter');
				icons.removeClass('shorty-active');
				icons.filter('[data-sort-code="'+sortCode+'"]').addClass('shorty-active');
				// store the sorting code as preference, for returning list retrievals
				OC.Shorty.Action.Preference.set({'list-sort-code':sortCode});
			}, // OC.Shorty.WUI.List.sort
			/**
			* @method OC.Shorty.WUI.List.toggle
			* @brief: Toggles the visibility of the list
			* @param string duration Duration the animation should take
			* @author Christian Reiner
			*/
			toggle: function(duration){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle list");
				duration = 'slow';
				var dfd = new $.Deferred();
				if (list.is(':visible'))
					 return OC.Shorty.WUI.List.hide();
				else return OC.Shorty.WUI.List.show();
			}, // OC.Shorty.WUI.List.toggle
			/**
			* @method OC.Shorty.WUI.List.vacuum
			* @brief Controls the visibility of the vacuum version of the list
			* @author Christian Reiner
			*/
			vacuum: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("vacuum list");
				// list is empty if no row exists
				if (0!=$('#list-of-shortys tbody').find('tr').length)
					 $('#vacuum').fadeOut('fast');
				else $('#vacuum').fadeIn('slow');
			}, // OC.Shorty.WUI.List.vacuum
			/**
			* @class OC.Shorty.WUI.List.Toolbar
			* @brief Collection of methods to control a lists toolbar
			* author Christian Reiner
			*/
			Toolbar:{
				/**
				* @method OC.Shorty.WUI.List.Toolbar.toggle
				* @brief Toggles the visibility of a lists toolbar
				* @param object list The list whos toolbars is to be toggled
				* @author Christian Reiner
				*/
				toggle: function(list){
					if (OC.Shorty.Debug) OC.Shorty.Debug.log("toggle list toolbar");
					var button =list.find('#tools');
					var toolbar=list.find('#toolbar');
					var dfd = new $.Deferred();
					if (!toolbar.find('div').is(':visible')){
						// toolbar NOT visible: open toolbar
						$.when(
							// each <th>'s content MUST be encapsulate in a 'div', otherwise the animation does not work
							toolbar.find('div').slideDown('slow')
						).pipe(function(){
							button.attr('src',button.attr('data-shade'));
						}).done(dfd.resolve)
					}else{ // toolbar IS visible
						// any filters active? prevent closing of toolbar !
						if (this.ToolbarCheckFilter.apply(this,[toolbar])) {
							if (OC.Shorty.Debug) OC.Shorty.Debug.log('active filter prevents closing of toolbar');
						}else{
							// close toolbar
							$.when(
								toolbar.find('div').slideUp('slow')
							).done(function(){
								button.attr('src',button.attr('data-unshade'))
								dfd.resolve();
							})
						}
					}
					return dfd.promise();
				}, // OC.Shorty.WUI.List.Toolbar.toggle
			}, // OC.Shorty.WUI.List.Toolbar
		}, // OC.Shorty.WUI.List
		/**
		 * @class OC.Shorty.WUI.Notification
		 * @brief Collection of methods controling the central notification area
		 * @author Christian Reiner
		 */
		Notification:{
			/**
			* @method OC.Shorty.WUI.Notification.hide
			* @brief Hides the notification area and clears the content
			* @author Christian Reiner
			*/
			hide: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("hide notification");
				var dfd = new $.Deferred();
				$.when(
					$('#notification').slideUp('fast')
				).pipe(function(){
					$('#notification').text('');
				}).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Notification.hide
			/**
			* @method OC.Shorty.WUI.Notification.show
			* @brief Populates the notification area with the specified text and shows it
			* @author Christian Reiner
			*/
			show: function(message,level){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("show notification with level "+level);
				level = level || 'info';
				var dfd = new $.Deferred();
				var duration = 'slow';
				var notification = $('#notification');
				if (message && message.length){
					$.when(
						notification.slideUp('fast')
					).done(function(){
						switch(level){
							case 'debug':
								// detect debug mode by checking, of function 'debug()' exists
								if ( OC.Shorty.Debug ){
								OC.Shorty.Debug.log('Debug: '+message);
								$.when(
									notification.attr('title', 'debug message'),
									notification.text('Debug: '+message),
									notification.slideDown(duration)
								).done(dfd.resolve)
								}
								else
								dfd.resolve();
								break;

							case 'error':
								if (OC.Shorty.Debug)
								OC.Shorty.Debug.log('Error: '+message);
								$.when(
								notification.attr('title', 'error message'),
								notification.text('Error: ' + message),
								notification.slideDown(duration)
								).done(dfd.resolve)
								break;

							default: // 'info'
								if ( message.length ){
								if (OC.Shorty.Debug)
									OC.Shorty.Debug.log('Info: '+message);
								$.when(
									notification.text(message),
									notification.slideDown(duration)
								).done(dfd.resolve)
								}else{
								$.when(
									notification.text('')
								).done(dfd.resolve)
								}
						} // switch
					})
				} // if message
				return dfd.promise();
			}, // OC.Shorty.WUI.Notification.show
		}, // OC.Shorty.WUI.Notification
		/**
		* @class OC.Shorty.WUI.Meta
		* @brief Collection of methods to handle url meta data
		* @author Christian Reiner
		*/
		Meta:{
			/**
			* @method OC.Shorty.WUI.Meta.collect
			* @brief Collects meta data about an url specified in the dialog
			* @param object dialog The dialog that takes the meta data tokens
			* @author Christian Reiner
			*/
			collect: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("collect meta data");
				var dfd = new $.Deferred();
				var target = dialog.find('#target').val().trim();
				// don't bother getting active on empty input
				if ( ! target.length ){
					dialog.find('#target').focus().select();
					dfd.resolve();
					return dfd.promise();
				}
				// fill in fallback protocol scheme 'http' if none is specified
				var regexp = /^[a-zA-Z0-9]+\:\//;
				if ( ! regexp.test(target) ){
					target = 'http://' + target;
					dialog.find('#target').val(target);
				}
				// start expressing activity
				dialog.find('#busy').fadeIn('fast');
				// query meta data from target
				$.when(
					OC.Shorty.WUI.Meta.get(target)
				).done(function(response){
					var meta=response.data;
					if (meta.final)
						dialog.find('#target').val(meta.final);
					$.when(
						OC.Shorty.WUI.Meta.reset(dialog)
					).done(function(){
						dialog.find('#title').attr('placeholder',meta.title);
						// specify the icons and information to be shown as meta data
						dialog.find('#staticon').attr('src',meta.staticon);
						dialog.find('#schemicon').attr('src',meta.schemicon);
						dialog.find('#favicon').attr('src',meta.favicon);
						dialog.find('#mimicon').attr('src',meta.mimicon);
						dialog.find('#explanation').html(meta.title?meta.title:'[ '+meta.explanation+' ]');
						dialog.find('#meta').fadeTo('fast',1);
						// stop expressing activity
						dialog.find('#busy').fadeOut('slow');
					});
					dfd.resolve(response);
				}).fail(function(response){
					$.when(
						OC.Shorty.WUI.Meta.reset(dialog)
					).done(function(){
						dialog.find('#title').attr('placeholder','');
						dialog.find('#explanation').html('- '+t('shorty','Sorry, that target is invalid!')+' -');
						dialog.find('#meta').fadeTo('fast',1);
						// stop expressing activity
						dialog.find('#busy').fadeOut('slow');
					})
					dfd.reject(response);
				})
				return dfd.promise();
			}, // OC.Shorty.WUI.Meta.collect
			/**
			* @method OC.Shorty.WUI.Meta.get
			* @brief Fetches the meta data of a given target url
			* @param string target The target url to fetch meta data about
			* @author Christian Reiner
			*/
			get: function(target){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("get meta data for target url '"+target+"'");
				var dfd = new $.Deferred();
				$.ajax({
					type:     'GET',
					url:      OC.filePath('shorty','ajax','meta.php'),
					cache:    false,
					data:     { target: encodeURIComponent(target) },
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response);},
					function(response){return OC.Shorty.Ajax.fail(response);}
				).done(function(response){
					dfd.resolve(response);
				}).fail(function(response){
					dfd.reject(response);
				})
				return dfd.promise();
			}, // OC.Shorty.WUI.Meta.get
			/**
			* @class OC.Shorty.WUI.Meta.reset
			* @brief Resets meta data that is currently contained in the specified dialog
			* @param object dialog The dialog the be altered
			* @author Christian Reiner
			*/
			reset: function(dialog){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("reset meta data");
				var dfd = new $.Deferred();
				$.when(
					dialog.find('#meta').fadeTo('fast',0)
				).always(function(){
					dialog.find('#staticon').attr('src',dialog.find('#staticon').attr('data'));
					dialog.find('#schemicon').attr('src',dialog.find('#schemicon').attr('data'));
					dialog.find('#favicon').attr('src',dialog.find('#favicon').attr('data'));
					dialog.find('#mimicon').attr('src',dialog.find('#mimicon').attr('data'));
					dialog.find('#explanation').html(dialog.find('#explanation').attr('data'));
					dfd.resolve();
				});
				return dfd.promise();
			} // OC.Shorty.WUI.Meta.reset
		}, // OC.Shorty.WUI.Meta
		/**
		* @class OC.Shorty.WUI.Sums
		* @brief Collection of methods to handle and visualize statistical sums
		* @author Christian Reiner
		*/
		Sums:{
			/**
			* @method OC.Shorty.WUI.Sums.fill
			* @brief Fills the sums as specified in the provided data into the desktop
			* @param array data The data as specified during a server request
			* @author Christian Reiner
			*/
			fill: function(data){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("fill sums");
				var dfd = new $.Deferred();
				$.when(
					// update (set) sum values in the control bar
					this.MetaFillSums.apply(this,[data])
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.WUI.Sums.fill
			/**
			* @method OC.Shorty.WUI.Sums.get
			* @brief Retrieves the statistical sums from the server
			* @author Christian Reiner
			*/
			get: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("get sums");
				var dfd = new $.Deferred();
				$.when(
					$.ajax({
						type:     'GET',
						url:      OC.filePath('shorty','ajax','count.php'),
						cache:    false,
						data:     { },
						dataType: 'json'
					}).pipe(
						function(response){return OC.Shorty.Ajax.eval(response)},
						function(response){return OC.Shorty.Ajax.fail(response)}
					)
				).done(function(response){
					this.MetaFillSums.apply(this,[response.data]);
					dfd.resolve(response);
				}).fail(function(response){
					dfd.reject(response);
				})
				return dfd.promise();
			}, // OC.Shorty.WUI.Sums.get
			/**
			* @method OC.Shorty.WUI.Sums.increment
			* @brief Increments the click counter for a single entry in the visible list
			* @param entry object Jquery object representing the clicked entry (row)
			* @author Christian Reiner
			*/
			increment: function(entry){
				var clicks=parseInt(entry.attr('data-clicks'),10)+1;
				entry.attr('data-clicks',clicks);
				entry.find('td#clicks span').text(clicks);
				$('#controls #sum_clicks').text(parseInt($('#controls #sum_clicks').text(),10)+1);
			} // OC.Shorty.WUI.Sums.increment
		} // OC.Shorty.WUI.Sums
	}, // OC.Shorty.WUI

	/**
	 * @class Action
	 * @brief Collection of actions methods serving as backend for the WUI methods.
	 * @author Christian Reiner
	 */

	Action:{
		/**
		 * @class OC.Shorty.Action.Preference
		 * @brief Collection of methods handling user preference values
		 * @author Christian Reiner
		 */
		Preference:
		{
			/**
			 * @method OC.Shorty.Action.Preference.get
			 * @brief: Gets a specified users preference value
			 * @author Christian Reiner
			 */
			get:function(data){
				if (OC.Shorty.Debug){OC.Shorty.Debug.log("get preference(s):");OC.Shorty.Debug.log(data);}
				var dfd = new $.Deferred();
				$.ajax({
					type:     'GET',
					url:      OC.filePath('shorty','ajax','preferences.php'),
					cache:    false,
					data:     data,
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).always(function(response){
					if (OC.Shorty.Debug){OC.Shorty.Debug.log("got preference(s):");OC.Shorty.Debug.log(response.data);}
				}).done(function(response){
					dfd.resolve(response.data);
				}).fail(function(response){
					dfd.reject({});
				})
				return dfd.promise();
			}, // OC.Shorty.Action.Preference.get
			/**
			 * @method OC.Shorty.Action.Preference.get
			 * @brief: Sets a specified users preference value
			 * @author Christian Reiner
			 */
			set:function(data){
				if (OC.Shorty.Debug){OC.Shorty.Debug.log("set preference(s):");OC.Shorty.Debug.log(data);}
				var dfd = new $.Deferred();
				$.ajax({
					type:     'POST',
					url:      OC.filePath('shorty','ajax','preferences.php'),
					cache:    false,
					data:     data,
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).always(function(response){
					if (OC.Shorty.Debug){OC.Shorty.Debug.log("got preference(s):");OC.Shorty.Debug.log(response.data);}
				}).done(function(response){
					dfd.resolve(response.data);
				}).fail(function(response){
					dfd.reject({});
				})
				return dfd.promise();
			}, // OC.Shorty.Action.Preference.set
		}, // OC.Shorty.Action.Preference
		/**
		 * @class OC.Shorty.Action.Setting
		 * @brief Collection of methods handling system settings values
		 * @author Christian Reiner
		 */
		Setting:{
			/**
			 * @method OC.Shorty.Action.Setting.get
			 * @brief: Gets a specified system settings value
			 * @author Christian Reiner
			 */
			get:function(data){
				if (OC.Shorty.Debug){OC.Shorty.Debug.log("get setting(s):");OC.Shorty.Debug.log(data);}
				var dfd = new $.Deferred();
				$.ajax({
					type:     'GET',
					url:      OC.filePath('shorty','ajax','settings.php'),
					cache:    false,
					data:     data,
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).always(function(response){
					if (OC.Shorty.Debug){OC.Shorty.Debug.log("got preference(s):");OC.Shorty.Debug.log(response.data);}
				}).done(function(response){
					dfd.resolve(response.data);
				}).fail(function(response){
					dfd.reject({});
				})
				return dfd.promise();
			}, // OC.Shorty.Action.Setting.get
			/**
			 * @method OC.Shorty.Action.Setting.set
			 * @brief: Sets a specified system settings value
			 * @author Christian Reiner
			 */
			set:function(data){
				if (OC.Shorty.Debug){OC.Shorty.Debug.log("set setting(s):");OC.Shorty.Debug.log(data);}
				var dfd = new $.Deferred();
				$.ajax({
					type:     'POST',
					url:      OC.filePath('shorty','ajax','settings.php'),
					cache:    false,
					data:     data,
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).always(function(response){
					if (OC.Shorty.Debug){OC.Shorty.Debug.log("got preference(s):");OC.Shorty.Debug.log(response.data);}
				}).done(function(response){
					dfd.resolve(response.data);
				}).fail(function(response){
					dfd.reject({});
				})
				return dfd.promise();
			}, // OC.Shorty.Action.Setting.set
			/**
			 * @object OC.Shorty.Action.Setting.popup
			 * @brief A persistent object representing a popup dialog
			 * @author Christian Reiner
			 */
			popup:{},
			/**
			 * @method OC.Shorty.Action.Setting.verify
			 * @brief Controls the verification of the current setting of the static backends base url.
			 * @author Christian Reiner
			 */
			verify:function(){
				if (!OC.Shorty.Action.Setting.popup.dialog){
					OC.Shorty.Action.Setting.popup=$('#shorty #dialog-verification');
					OC.Shorty.Action.Setting.popup.dialog({show:'fade',autoOpen:false,modal:true});
					OC.Shorty.Action.Setting.popup.dialog('option','minHeight',280 );
					OC.Shorty.Action.Setting.popup.dialog('option','minWidth',400 );
				}
				var dfd = new $.Deferred();
				$.when(
					this.check(OC.Shorty.Action.Setting.popup,$('#shorty #backend-static #backend-static-base').val())
				).done(dfd.resolve)
				return dfd.promise();
			}, // OC.Shorty.Action.Setting.verify
			/**
			 * @method OC.Shorty.Action.Setting.check
			 * @brief Verifies if the current setting of the static backends base url is usable.
			 * @author Christian Reiner
			 */
			check:function(popup,target){
				popup.find('#verification-target').text(target);
				popup.dialog('open');
				popup.find('#success').hide();
				popup.find('#failure').hide();
				popup.find('#hourglass').fadeIn('fast');
				var dfd = new $.Deferred();
				$.ajax({
					// the '0000000000' below is a special id recognized for testing purposes
					url:         target+'0000000000',
					cache:       false,
					crossDomain: true, // required when using a "short named domain" and server side url rewriting
					data:        { },
					dataType:    'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).done(function(response){
					$.when(
						popup.find('#hourglass').fadeOut('fast')
					).then(function(){
						popup.find('#success').fadeIn('fast');
						dfd.resolve(response);
					})
				}).fail(function(response){
					$.when(
						popup.find('#hourglass').fadeOut('fast')
					).then(function(){
						popup.find('#failure').fadeIn('fast');
						dfd.reject(response);
					})
				})
				return dfd.promise();
			} // OC.Shorty.Action.Setting.check
		}, // OC.Shorty.Action.Setting
		/**
		 * @class OC.Shorty.Action.Token
		 * @brief Collection of methods handling OCs CSRF protection token
		 * @author Christian Reiner
		 */
		Token:{
			/**
			 * @method OC.Shorty.Action.Token.refresh
			 * @brief Retrieves a fresh token and replaces the existing one in the DOM tree.
			 * @author Christian Reiner
			 */
			refresh:function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("refreshing request token (lifebeat)");
				var dfd=new $.Deferred();
				$.ajax({
					type:     'POST',
					url:      OC.filePath('shorty','ajax','token.php'),
					cache:    false,
					data:     { },
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).done(function(response){
					var token=response.token;
					$(document).bind('ajaxSend','');
					$(document).bind('ajaxSend',function(elm,xhr,s){xhr.setRequestHeader('requesttoken',token);});
					dfd.resolve();
				}).fail(dfd.reject)
			} // OC.Shorty.Action.Token.refresh
		}, // OC.Shorty.Action.Token
		/**
		 * @class OC.Shorty.Action.Url
		 * @brief Collection of methods handling URLs
		 * @author Christian Reiner
		 */
		Url:{
			/**
			 * @,ethod OC.Shorty.Action.Url.add
			 * @brief Adds a URL including meta data as specified as a new Shorty.
			 * @author Christian Reiner
			 */
			add:function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("action add url");
				var dfd=new $.Deferred();
				var dialog=$('#dialog-add');
				var status=dialog.find('#status').val()||'public';
				var target=dialog.find('#target').val()||'';
				var title =dialog.find('#title').val()||'';
				var notes =dialog.find('#notes').val()||'';
				var until =dialog.find('#until').val()||'';
				// store favicon from meta data, except it is the internal default blank
				var favicon = dialog.find('#meta #favicon').attr('src');
				favicon=(favicon==dialog.find('#meta #favicon').attr('data'))?'':favicon;
				// perform upload of new shorty
				$.when(
					OC.Shorty.WUI.Notification.hide(),
					// close and neutralize dialog
					OC.Shorty.WUI.Dialog.hide(dialog),
					OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),false),
					OC.Shorty.WUI.List.show()
				).done(function(){
					var data={
						status:  status,
						target:  target,
						title:   title,
						notes:   notes,
						until:   until,
						favicon: favicon
					};
					if (OC.Shorty.Debug) OC.Shorty.Debug.log(data);
					$.ajax({
						type:     'POST',
						url:      OC.filePath('shorty','ajax','add.php'),
						cache:    false,
						data:     data,
						dataType: 'json'
					}).pipe(
						function(response){return OC.Shorty.Ajax.eval(response)},
						function(response){return OC.Shorty.Ajax.fail(response)}
					).done(function(response){
						// wipe entries in dialog
						OC.Shorty.WUI.Dialog.reset(dialog)
					}).done(function(response){
						// add shorty to existing list
						OC.Shorty.WUI.List.add.apply(OC.Shorty.Runtime.Context.ListOfShortys,
												[$('#list-of-shortys').first(),[response.data],true]);
						OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),true)
						dfd.resolve(response);
					}).fail(function(response){
						OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),true)
						dfd.reject(response);
					})
				})
				return dfd.promise();
			}, // ===== OC.Shorty.Action.Url.add =====
			/** OC.Shorty.Action.Url.edit
			 * @brief Modifies an existign Shorty by storing the specified attributes.
			 * @author Christian Reiner
			 */
			edit: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("action modify url");
				var dfd=new $.Deferred();
				var dialog=$('#dialog-edit');
				var id    =dialog.find('#id').val();
				var status=dialog.find('#status').val()||'blocked';
				var title =dialog.find('#title').val()||dialog.find('#title').attr('placeholder');
				var until =dialog.find('#until').val()||'';
				var notes =dialog.find('#notes').val()||'';
				// perform modification of existing shorty
				$.when(
				OC.Shorty.WUI.Notification.hide(),
				// close and neutralize dialog
				OC.Shorty.WUI.Dialog.hide(dialog),
				OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),false),
				OC.Shorty.WUI.List.show()
				).done(function(){
					var data={	id: id,
								status: status,
								title:  title,
								notes:  notes,
								until:  until};
					if (OC.Shorty.Debug) OC.Shorty.Debug.log(data);
					$.ajax({
						type:     'POST',
						url:      OC.filePath('shorty','ajax','edit.php'),
						cache:    false,
						data:     data,
						dataType: 'json'
					}).pipe(
						function(response){return OC.Shorty.Ajax.eval(response)},
						function(response){return OC.Shorty.Ajax.fail(response)}
					).done(function(response){
						// wipe entries in dialog
						OC.Shorty.WUI.Dialog.reset(dialog);
						// modify existing entry in list
						OC.Shorty.WUI.List.modify([response.data],true);
						OC.Shorty.WUI.List.dim($('#list-of-shortys').first(),true)
						dfd.resolve(response);
					}).fail(function(response){
						dfd.reject(response);
					})
				})
				return dfd.promise();
			}, // ===== OC.Shorty.Action.Url.edit =====
			/**
			 * @method OC.Shorty.Action.Url.del
			 * @brief Marks an existing Shorty as deleted. 
			 * @author Christian Reiner
			 */
			del: function(){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("action delete url");
				var dfd = new $.Deferred();
				var dialog = $('#dialog-edit');
				var id     = dialog.find('#id').val();
				$.when(
					// OC.Shorty.WUI.Notification.hide(),
					$.ajax({
						type:     'GET',
						url:      OC.filePath('shorty','ajax','del.php'),
						cache:    false,
						data:     { id: id },
						dataType: 'json'
					}).pipe(
						function(response){return OC.Shorty.Ajax.eval(response)},
						function(response){return OC.Shorty.Ajax.fail(response)}
					)
				).done(function(response){
					// close and neutralize dialog
					OC.Shorty.WUI.Dialog.hide(dialog);
					// hide and remove deleted entry
					// ...
					dfd.resolve(response.data);
				}).fail(function(response){
					dfd.reject(response.data);
				})
				return dfd.promise();
			}, // ===== OC.Shorty.Action.Url.del =====
			/** OC.Shorty.Action.Url.forward
			 * @brief Redirects to the target URL of a given Shorty.
			 * @author Christian Reiner
			 */
			forward: function(entry){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("action forward to entry "+entry.attr('id'));
				var url=entry.attr('data-target');
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("opening target url '"+url+"' in new window");
				window.open(url);
			}, // OC.Shorty.Action.Url.forward
			/**
			 * @method OC.Shorty.Action.Url.send
			 * @brief RUns the specific action defined for a chosen sharing usage. 
			 * @author Christian Reiner
			 */
			send: function(element,entry){
				var action=element.attr('id');
				var position=element.position();
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("action 'send via "+action+"' with entry '"+entry.attr('id')+"'");
				switch (action){
					case 'usage-qrcode':
						// take layout from hidden dialog template
						var message=$('#dialog-qrcode').html();
						// use the jquery.impromtu plugin for a popup
						var proceed=$.prompt({
							state0:{
								html:message,
								buttons:{Ok:true},
								position:{
									container:'#dialog-share',
									width:'auto',
									arrow:'bl',
									x:position.left+19,
									y:position.top-332
								}
							}
						});
						var qrcodeUrl=$('#jqibox fieldset #qrcode-url').val()+encodeURIComponent(entry.attr('data-source'));
						$('#jqibox fieldset #payload').val(qrcodeUrl);
						$('#jqibox fieldset #payload').focus().select();
						// full url to the qrcode image
						$('#jqibox fieldset img').attr('src',qrcodeUrl);
						// download image when download button is clicked
						$('#jqibox fieldset #download').click(function(){
							window.location.href=qrcodeUrl+"&download=1";
						});
						// switch to details when image is clicked
						$('#jqibox fieldset img').click(function(){
							$('#jqibox fieldset #qrcode-img').hide();
							$('#jqibox fieldset #qrcode-url').show();
						});
						break;

					case 'usage-email':
						// we offer a 'mailto://' link for all devices supporting that or copying the address as a fallback
						var mailSubject=entry.attr('data-title')||'';
						var mailBody=entry.attr('data-notes')+"\n\n"+entry.attr('data-source');
						var mailLink='mailto:""?'
									+'subject='+encodeURIComponent(mailSubject)
									+'&body='+encodeURIComponent(mailBody);
						// take layout from hidden dialog template
						var message=$('#dialog-email').html();
						// use the jquery.impromtu plugin for a popup
						var proceed=$.prompt({
							state0:{
								html:message,
								buttons:{Ok:true,Cancel:false},
								position:{
									container:'#dialog-share',
									width:'auto',
									arrow:'bc',
									x:position.left-206,
									y:position.top-239
								},
								submit:function(e,v,m,f){
									if(v) window.location=mailLink;
									else  $.prompt.close();
								}
							}
						});
						$('#jqibox fieldset #payload').val(mailBody);
						$('#jqibox fieldset #payload').focus().select();
						break;

					case 'usage-sms':
						// since most client systems won't understand the sms:// protocol this action is often disabled
						// in addition, the protocol implementations do NTO allow to specify any content in the link
						// therefore we ask the user to copy&paste a prepared body to their clipboard...
						var smsBody=entry.attr('data-title')+"\n"+entry.attr('data-notes')+"\n"+entry.attr('data-source');
						// take layout from hidden dialog template
						var message=$('#dialog-sms').html();
						// use the jquery.impromtu plugin for a popup
						var proceed=$.prompt({
							state0:{
								html:message,
								buttons:{Ok:true,Cancel:false},
								position:{
									container:'#dialog-share',
									width:'auto',
									arrow:'bc',
									x:position.left-204,
									y:position.top-299
								},
								submit:function(e,v,m,f){
									if(v) window.location='sms:';
									else  $.prompt.close();
								}
							}
						});
						$('#jqibox fieldset #payload').val(smsBody);
						$('#jqibox fieldset #payload').focus().select();
						break;

					case 'usage-clipboard':
						// take layout from hidden dialog template
						var clipboardBody=entry.attr('data-source');
						var message=$('#dialog-clipboard').html();
						// use the jquery.impromtu plugin for a popup
						var proceed=$.prompt({
							state0:{
								html:message,
								buttons:{Ok:true},
								position:{
									container:'#dialog-share',
									width:'auto',
									arrow:'br',
									x:position.left-428,
									y:position.top-138
								}
							}
						});
						$('#jqibox fieldset #payload').val(clipboardBody);
						$('#jqibox fieldset #payload').focus().select();
						break;
					default:
						if (OC.Shorty.Debug) OC.Shorty.Debug.log("usage action '"+action+"' is disabled, refusing to comply");
				}
			}, // OC.Shorty.Action.Url.send
			/** OC.Shorty.Action.Url.show
			 * @brief Visualizes all attributes of an existing Shorty. 
			 * @author Christian Reiner
			 */
			show: function(){
				var dfd = new $.Deferred();
				var dialog = $('#dialog-show');
				var id     = dialog.find('#id').val();
				var record = $(this).parent().parent();
				$('#shorty-add-id').val(record.attr('data-id'));
				$('#shorty-add-id').val(record.attr('data-status'));
				$('#shorty-add-source').val(record.children('.shorty-source:first').text());
				$('#shorty-add-relay').val(record.children('.shorty-relay:first').text());
				$('#shorty-add-target').val(record.children('.shorty-target:first').text());
				$('#shorty-add-notes').val(record.children('.shorty-notes:first').text());
				$('#shorty-add-until').val(record.children('.shorty-until:first').text());
				$.when(
					function(){
						if ($('.shorty-add').css('display') == 'none')
							$('.shorty-add').slideToggle();
					},
					$('html, body').animate({ scrollTop: $('.shorty-menu').offset().top }, 500)
				).done(dfd.resolve)
				return dfd.promise();
			}, // ===== OC.Shorty.Action.Url.show =====
			/**
			 * @method OC.Shorty.Action.Url.status
			 * @brief Changes the status of an existing Shorty as specified. 
			 * @author Christian Reiner
			 */
			status: function(id,status){
				if (OC.Shorty.Debug) OC.Shorty.Debug.log("changing status of id "+id+" to "+status);
				var dfd = new $.Deferred();
				$.ajax({
					type:  'GET',
					url:   OC.filePath('shorty','ajax','status.php'),
					cache: false,
					data:  {
						id    : id,
						status: status
					},
					dataType: 'json'
				}).pipe(
					function(response){return OC.Shorty.Ajax.eval(response)},
					function(response){return OC.Shorty.Ajax.fail(response)}
				).done(function(){
					// update the rows content
					var row=$('#list-of-shortys tbody tr#'+id);
					row.attr('data-status',status);
					row.find('td#status span').text(t('shorty',status));
					dfd.resolve();
				}).fail(dfd.reject)
				return dfd.promise();
			} // OC.Shorty.Action.Url.status
		}, // OC.Shorty.Action.Url
	}, // OC.Shorty.Action

	/**
	* @class OC.Shorty.Ajax
	* @brief Tool collection handling ajax requests
	* @author Christian Reiner
	*/
	Ajax:{
		/**
		* @method OC.Shorty.Ajax.eval
		* @brief Filters and converts ajax responses into internal format
		* @description
		* The ajax replies we get contain an error or a success structure.
		* In case of an error the data is converted into a normal ajax failure.
		* This makes dealing with failures easier, since all failures have the same format.
		* @param object Ajax response
		* @return object Deferred object, rejected or resolved
		* @author Christian Reiner
		*/
		eval:function(response){
			if (OC.Shorty.Debug) OC.Shorty.Debug.log("eval ajax response of status "+response.status);
			// Check to see if the response is truely successful.
			if (response.status){
				// this is a valid response
				if ('success'==response.status){
					OC.Shorty.WUI.Notification.show(response.message,'debug');
					return new $.Deferred().resolve(response);
				}else{
			//           // is this an expired request token (CSRF protection mechanism) ?
			//           if (response.message.indexOf("Token expired")>=0)
			//             // reload apps base page
			//             window.location.href=OC.filePath('shorty','','');
					OC.Shorty.WUI.Notification.show(response.message,'error');
					return new $.Deferred().reject(response);
				}
			}
		}, // OC.Shorty.Ajax.eval

		/**
		* @method OC.Shorty.Ajax.fail
		* @brief Filters and converts ajax failures into internal format
		* @param object Ajax response
		* @return object Rejected deferred object
		* @author Christian Reiner
		*/
		fail:function(response){
			if (OC.Shorty.Debug) OC.Shorty.Debug.log("handle ajax failure");
			return new $.Deferred().reject({
				status: 'error',
				data: null,
				message: "Unexpected error: " + response.status + " " + response.statusText
			});
		} // OC.Shorty.Ajax.fail
	}, // OC.Shorty.Ajax

	// ===========

	/**
	* @class OC.Shorty.Runtime
	* @brief Catalog of references to runtime callback methods
	* @author Christian Reiner
	*/
	Runtime:{
		/**
		* @class OC.Shorty.Runtime.Context
		* @brief Definition of contexts callbacks can be associated to
		* @author Christian Reiner
		*/
		Context:{}
	}, // OC.Shorty.Runtime
	// ===========
} // OC.Shorty

/**
 * @class OC.Shorty.Runtime.Context.ListOfShortys
 * @brief Catalog of callbacks required for list of shorty
 * @author Christian Reiner
 */
OC.Shorty.Runtime.Context.ListOfShortys={
	/**
	 * @class OC.Shorty.Runtime.Context.ListOfShortys.ColumnValueReference
	 * @brief collection of callback methods to use a list columns value
	 * @author Christian Reiner
	 * @description These callbacks are used in column filtering, a default for
	 * non existing methods here exists in the filtering function
	 */
	ColumnValueReference:{
	},
	/**
	* @method OC.Shorty.Runtime.Context.ListOfShortys.ListAddEnrich
	* @brief Enriches a raw list entry with usage specific values taken from a sepcified set of attributes
	* @param row jQueryObject Represents the raw row, freshly cloned
	* @param set array A set of attributes (values) defining an element to re represented by the row
	* @param hidden bool Flag that controls if added entries should be kept hidden for a later visualization (highlighting)
	* @author Christian Reiner
	*/
	ListAddEnrich:function(row,set,hidden){
		// set row id to entry id
		row.attr('id',set.id);
		// hold back rows for later highlighting effect
		if (hidden) row.addClass('shorty-fresh'); // might lead to a pulsate effect later
		// add aspects as content to the rows cells
		$.each(
			['id','status','title','source','relay','target','clicks','created','accessed','until','notes','favicon'],
			function(j,aspect){
				// we wrap the cells content into a span tag
				var span=$('<span>');
				span.addClass('ellipsis');
				// enhance row with real set values
				if (typeof set[aspect]==='undefined')
					row.attr('data-'+this,'');
				else row.attr('data-'+this,set[aspect]);
				// fill data into corresponsing column
				var title, content, classes=[];
				switch(aspect)
				{
					case 'favicon':
						span.html('<img class="shorty-icon" width="16" src="'+set[aspect]+'">');
						break;

					case 'until':
						if (!set[aspect])
							span.text("-"+t('shorty',"never")+"-");
						else{
							span.text(set[aspect]);
							if (dateExpired(set[aspect]))
							row.addClass('shorty-expired');
						}
						break;

					case 'title':
						span.text(set[aspect]);
						break;

					case 'target':
						span.text(set[aspect]);
						span.attr('title',set[aspect]);
						break;

					case 'status':
						if ('deleted'==set[aspect])
							row.addClass('deleted');
						span.text(t('shorty',set[aspect]));
						break;

					default:
						span.text(set[aspect]);
				} // switch
				row.find('td#'+aspect).empty().append(span);
			}
		) // each aspect
	}, // OC.Shorty.Runtime.Context.ListOfShortys.ListAddEnrich
	/**
	* @method OC.Shorty.Runtime.Context.ListOfShortys.ListAddInsert
	* @brief Inserts a cloned and enriched row into the table at a usage specific place
	* @description
	* OC.Shortys always get inserted at the BEGIN of the table, regardless of its sorting
	* This is important to always have the new entry flashing at the top of the list
	* @author Christian Reiner
	*/
	ListAddInsert: function(list,row){
		list.find('tbody').prepend(row);
	}, // OC.Shorty.Runtime.Context.ListOfShortys.ListAddInsert
	/**
	* @method OC.Shorty.Runtime.Context.ListOfShortys.ListFillFilter
	* @param list jQueryObject Represents the list to be handled
	* @author Christian Reiner
	*/
	ListFillFilter: function(list){
		if (OC.Shorty.Debug) OC.Shorty.Debug.log("using 'default' method to filter filled list");
		// only makes sense for default OC.Shorty list
		var data=new Array();
		data['sum_shortys']=$('#desktop #list-of-shortys tbody tr').length;
		data['sum_clicks']=0;
		$('#desktop #list-of-shortys tbody tr').each(function(){
			data['sum_clicks']+=parseInt($(this).attr('data-clicks'),10);
		});
		OC.Shorty.WUI.Sums.fill.apply(OC.Shorty.Runtime.Context.ListOfShortys,[data]);
		// filter list
		var toolbar=list.find('thead tr#toolbar');
		OC.Shorty.WUI.List.filter.apply(this,
			[list,'target',toolbar.find('th#target #filter').val()]);
		OC.Shorty.WUI.List.filter.apply(this,
			[list,'title', toolbar.find('th#title #filter').val()]);
		OC.Shorty.WUI.List.filter.apply(this,
			[list,'status',toolbar.find('th#status select :selected').val()]);
		// sort list
		$.when(
			OC.Shorty.Action.Preference.get('list-sort-code')
		).done(function(pref){
			OC.Shorty.WUI.List.sort.apply(OC.Shorty.Runtime.Context.ListOfShortys,[list,pref['list-sort-code']]);
		})
	}, // OC.Shorty.Runtime.Context.ListOfShortys.ListFillFilter
	/**
	* @class OC.Shorty.Runtime.Context.ListOfShortys.ToolbarCheckFilter
	* @brief Checks and signals visually if any active filters prevent closing the list toolbar
	* @author Christian Reiner
	*/
	ToolbarCheckFilter: function(toolbar){
		return (  (  (toolbar.find('th#title,#target').find('div input#filter:[value!=""]').length)
				&&(toolbar.find('th#title,#target').find('div input#filter:[value!=""]').effect('pulsate')) )
				||(  (toolbar.find('th#status select :selected').val())
				&&(toolbar.find('#status').effect('pulsate')) ) );
	}, // OC.Shorty.Runtime.Context.ListOfShortys.ToolbarCheckFilter
	/**
	* @class OC.Shorty.Runtime.Context.ListOfShortys.MetaFillSums
	* @brief Fills sums (statistical values) into a lists environment
	* @author Christian Reiner
	*/
	MetaFillSums:function(data){
		$('#controls #sum_shortys').text(data.sum_shortys);
		$('#controls #sum_clicks').text(data.sum_clicks);
	} // OC.Shorty.Runtime.Context.ListOfShortys.MetaFillSums

} // OC.Shorty.Runtime.Context.ListOfShortys