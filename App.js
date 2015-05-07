Ext.define('StoryMap', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	launch: function() {
		app = this;
		app.releaseArray = [null];
		app._buildPage();
	},
// Build Page
	_buildPage: function() {
		app.releaseArray = [null];
		var today = Rally.util.DateTime.toIsoString(new Date());	
		Ext.create('Rally.data.wsapi.Store', {
			model : 'Release',
			fetch : ['Name', 'ObjectID'],
			limit : Infinity,
			filters: [
				{
					property: 'ReleaseDate',
					operator: '>',
					value: today
				}
			],
			autoLoad : true,
			listeners : {
				load : function(myStore, myData, mySuccess) {
					Ext.Array.each(myData, function(rel) {
						app.releaseArray.push(rel.data);
					});
				app._addNewButton();
				app._addBoard();
				app._addReleaseButton();
				},
				scope : this
			}
		});
	},
	
// Add AddNew Button to container
	_addNewButton: function() {
		if (app.addButton) app.addButton.destroy();
		addNewConfig = {
			html:'<div><input type="button" style="text-align:right;float:right;" value="Update" onClick="window.location.reload()"/></div>',
			xtype: 'rallyaddnew',
			newButtonText: '+ New Feature/Story',
			recordTypes: ['User Story', 'PortfolioItem/Feature'],
			ignoredRequiredFields: ['Name', 'ScheduleState', 'Project', 'Tasks', 'Dependencies'],
			listeners: {
				create: function(addNew, record) {
//					Ext.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
					// app.board.refresh();
					app._buildPage();
				}
			},
			showAddWithDetails: true
		};
		app.addButton = this.add(addNewConfig);
    },
// add board to container
    _addBoard: function() {
		if (this.down('#myBoard')) {
			this.remove('myBoard');
		}
//		if (app.board) app.board.destroy();
		boardConfig = {
			xtype: 'rallycardboard',
			types: ['User Story'],
			attribute: 'Feature',
			itemId: 'myBoard',
			context: this.getContext(),
			enableRanking: true,
			cardConfig: {
				fields: ['Name', 'PlanEstimate', 'ScheduleState'],
				editable: true,
				showIconsAndHighlightBorder: true,
				showReadyIcon: true,
				showBlockedIcon: true,
				showColorIcon: true,
				showPlusIcon: true,
				showGearIcon: true
			},
			columnConfig: {
				listeners: {
					scope: this,
					beforecarddroppedsave: function(column,card){
						var rec = card.getRecord();
						rec.set('PortfolioItem', column.getValue());
					}
				}
			},
			rowConfig: {
				field: 'Release',
				enableCrossRowDragging: true,
				sortDirection: 'ASC',
				values: app.releaseArray
			}
		};
		app.board = this.add(boardConfig);
    },
    // Add AddNew Button to container
	_addReleaseButton: function() {
		if (app.releaseButton) app.releaseButton.destroy();
		addNewReleaseConfig = {
			html:'<div><input type="button" style="text-align:right;float:right;" value="Update" onClick="window.location.reload()"/></div>',
			xtype: 'rallyaddnew',
			newButtonText: '+ New Release',
			recordTypes: ['Release'],
//			ignoredRequiredFields: ['Name', 'ScheduleState', 'Project'],
			listeners: {
				create: function(addNew, record) {
//					Ext.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
					// app.board.refresh();
					app._buildPage();
				}
			},
			showAddWithDetails: true
		};
		app.releaseButton = app.add(addNewReleaseConfig);
    }
});

