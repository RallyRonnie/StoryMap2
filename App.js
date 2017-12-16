// code to compress rows (rows of child projects with same release name)
// UNCOMMENT THIS But comment out the next override, they do not work together
//	Ext.define('Rally.ui.cardboard.row.RowFix', {
//		override: 'Rally.ui.cardboard.row.Row',
//	
//		isMatchingRecord: function(record) {
//			return this.callParent(arguments) ||
//				this.getValue().Name === (record.get('Release') && record.get('Release').Name);
//		}
//	});
//
// override Release lable to include project name - release name
Ext.define('Rally.ui.cardboard.row.HeaderFix', {
	override: 'Rally.ui.cardboard.row.Header',
	_getTitle: function () {
		var value = this.getValue();
		if (value != null) {
			return value.Project.Name + " - " + value.Name;
		} else return "-- Not Scheduled --";
	}
});
//
Ext.define('StoryMap', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	requires: [
        'Rally.ui.cardboard.plugin.FixedHeader'
    ],
	launch: function () {
		app = this;
		Ext.create('Rally.data.WsapiDataStore', {
			autoLoad: true,
			remoteFilter: false,
			model: 'TypeDefinition',
			sorters: [{	property: 'Ordinal',direction: 'Desc'}],
			filters: [{	property: 'Parent.Name', operator: '=',	value: 'Portfolio Item'}, 
				{property: 'Creatable',	operator: '=',value: 'true'	}],
			listeners: {
				load: function (store, recs) {
					piTypes = {};				
					Ext.Array.each(recs, function (type) {
						// console.log('Found PI Type', type, type.get('Ordinal'), type.get('TypePath'));
						piTypes[type.get('Ordinal') + ''] = type.get('TypePath');
					});
					app.PIType = piTypes['0'];
					this._buildHeader(piTypes['0']);
				},
				scope: this
			}
		});
	},
	_buildHeader: function (piType) {
		var filterState = app.getSetting('PIStateFilter');
		//		console.log('in _onPIsLoaded');
		var PIFilter = Ext.create('Ext.util.Filter', {});
		if (filterState != '-- No Entry --' & filterState != '') {
			PIFilter = Ext.create('Ext.util.Filter', {
				property: "State",
				value: filterState
			});
		}
		Ext.create('Rally.data.wsapi.Store', {
			model: piType,
			fetch: ['Name', 'ObjectID', 'Project', 'FormattedID','DisplayColor'],
			limit: Infinity,
			filters: PIFilter,
			sorters: [{
				property: 'Rank',
				direction: 'ASC'
			}],
			autoLoad: true,
			listeners: {
				load: function (myStore, myData, mySuccess) {
					var columns = [{
						record: null,
						value: null,
						columnHeaderConfig: {
							headerData: {
								PIhdr: '<p style="color: Red; font-size: 18px"; font-weight: bolder>No Parent</>'
							}
						}
					}];
					_.each(myData, function (record) {
						var fpiColor = record.get('DisplayColor');
						var hdrStr = 
							'<p style="color: ' + fpiColor + '; font-size: 18px; font-weight: bolder"><a href="https://rally1.rallydev.com/#/detail' +
							record.get('_ref') + '" target = "_top">' +
							record.get('FormattedID') +
							'</a> - ' +
							record.get('_refObjectName');

						columns.push({
//							tpl: Ext.create("Rally.ui.renderer.template.FormattedIDTemplate"),
							record: record,
							value: record.getRef().getRelativeUri(),
							columnHeaderConfig: {
								headerData: {
									PIhdr: hdrStr
								}
							}
						});
					});
					app._addNewButton();
					app._addBoard(columns, piType);
//					app._addRowButton();
				},
				scope: this
			}
		});
	},




	// Add AddNew Button to container
	_addNewButton: function () {
		if (app.addButton) app.addButton.destroy();
		addNewConfig = {
			//	html:'<div><input type="button" style="text-align:right;float:right;" value="Update" onClick="window.location.reload()"/></div>',
			xtype: 'rallyaddnew',
			//	newButtonText: '+ New '+app.getSetting('PITypeField')+'/Story',
			recordTypes: ['User Story'],
			ignoredRequiredFields: ['Name', 'ScheduleState', 'Project', 'Owner'],
			listeners: {
				create: function (addNew, record) {
					//					Ext.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
					// app.board.refresh();
					//					app.launch();
				}
			},
			showAddWithDetails: true
		};
		app.addButton = this.add(addNewConfig);
	},
	// add board to container
	_addBoard: function (columns, piType) {
		if (this.down('#myBoard')) {
			this.remove('myBoard');
		}
		boardConfig = {
			xtype: 'rallycardboard',
			types: ['User Story'],
			storeConfig: {
				filters: app.getQueryFilter()
			},
			attribute: piType.split('/')[1],
			itemId: 'myBoard',
			context: this.getContext(),
			enableRanking: true,
			cardConfig: {
				fields: ['Name', 'PlanEstimate', 'Owner'],
				editable: true,
				showIconsAndHighlightBorder: true,
				showReadyIcon: true,
				showBlockedIcon: true,
				showColorIcon: true,
				showPlusIcon: true,
				showGearIcon: true
			},
			plugins: [{ptype:'rallyfixedheadercardboard'}],
			columnConfig: {
				columnHeaderConfig: {
					headerTpl: '{PIhdr}'
				},
				listeners: {
					scope: this,
					beforecarddroppedsave: function (column, card) {
						var rec = card.getRecord();
						rec.set('PortfolioItem', column.getValue());
					}
				}
			},
			columns: columns,
			rowConfig: {
				field: app.getSetting('RowType'),
				enableCrossRowDragging: true,
				sortDirection: 'ASC' // ASC | DESC
			}
		};
//		console.log(boardConfig);
		app.board = this.add(boardConfig);
	},
	// Add AddNew Button to container
	_addRowButton: function () {
		if (app.rowButton) app.rowButton.destroy();
		addNewRowConfig = {
			html: '<div><input type="button" style="text-align:right;float:right;" value="Update" onClick="window.location.reload()"/></div>',
			xtype: 'rallyaddnew',
			newButtonText: '+ New Row',
			recordTypes: [app.getSetting('RowType')],
			//	ignoredRequiredFields: ['Name', 'ScheduleState', 'Project', 'Owner'],
			listeners: {
				create: function (addNew, record) {
					//	Ext.Msg.alert('Add New', 'Added record named ' + record.get('Name'));
					// app.board.refresh();
					app.launch();
				}
			},
			showAddWithDetails: true
		};
		app.rowButton = app.add(addNewRowConfig);
	},
	getSettingsFields: function () {
		var values = [{
				xtype: 'label',
				forId: 'myFieldId1',
				text: 'PI Filter',
				margin: '0 0 0 10'
			},
			{
				name: 'PIStateFilterPicker',
				xtype: 'rallyfieldvaluecombobox',
				model: app.PIType,
				field: 'State',
				boxLabelAlign: 'after',
				fieldLabel: 'State',
				margin: '0 0 15 50',
				labelStyle: "width:200px;",
				afterLabelTpl: 'Click on State to filter Features in columns',
				handlesEvents: {
					myspecialevent1: function (field, model) {
						this.setField(field.raw.fieldDefinition);
					}
				},
				listeners: {
					select: function (state_picker, records) {
//						console.log("state_picker", state_picker, "records", records);
						this.fireEvent("state_selected", _.first(records).get("name"));
					}
				},
				bubbleEvents: ['state_selected']
			},
			{
				name: 'PIStateFilter',
				width: 200,
				xtype: 'rallytextfield',
				boxLabelAlign: 'after',
				fieldLabel: 'Filter State',
				readOnly: true,
				margin: '0 0 15 50',
				labelStyle: "width:200px;",
				// afterLabelTpl: 'A comma delimited list of the states to calculated cycle time for<br/><span style="color:#999999;">eg. <i>In-Progress,Completed</i></span>',
				handlesEvents: {
					state_selected: function (state) {
//						console.log("state_selected", this.getValue(), state);
						this.setValue(state);
					},
				}
			},
			{
				xtype: 'label',
				forId: 'myFieldId3',
				text: 'Row Type (Iteration/Release)',
				margin: '0 0 0 10'
			},
			{
				xtype: 'rallyradiofield',
				fieldLabel: 'Iteration',
				margin: '0 0 15 50',
				name: 'RowType',
				label: 'Swimlane',
				inputValue: 'Iteration'
			},
			{
				xtype: 'rallyradiofield',
				margin: '0 0 15 50',
				fieldLabel: 'Release',
				name: 'RowType',
				inputValue: 'Release'
			},
			{
				type: 'query'
			}
		];
		return values;
	},
	config: {
		defaultSettings: {
			PIStateFilter: '-- No Entry --',
			PITypeField: 'Feature',
			RowType: 'Iteration',
		}
	},
	getQueryFilter: function () {
		var queries = [];
		if (app.getSetting('query')) {
			queries.push(Rally.data.QueryFilter.fromQueryString(app.getSetting('query')));
		}
		return queries;
	}
});