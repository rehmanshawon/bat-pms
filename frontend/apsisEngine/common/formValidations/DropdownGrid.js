import SearchComponent from '@/apsisEngine/common/search';
import fetchWrapper from '@/apsisEngine/helpers/fetchWrapper';
import { apsisDate, apsisMoney, apsisQuantity } from '@/apsisEngine/helpers/helpers';
import { swalConfirm } from '@/apsisEngine/helpers/helperService';
import { Button, Input, Modal, Table } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export const DropdownGrid = React.forwardRef(
	(
		{
			value,
			name,
			slug,
			onChange,
			getEvent,
			placeholder,
			is_multiple,
			labelKey,
			valueKey,
			displaySelected,
			extra,
			disabled,
			label_name,
			...props
		},
		ref
	) => {
		const isMounted = useRef(false);

		const [primaryKeyField, setPrimaryKeyField] = useState(valueKey || 'hidden_id');

		//selected options
		const [curInstanceIds, setCurInstanceIds] = useState([]);
		const [selectedIds, setSelectedIds] = useState([]);
		const [selectedColumn, setSelectedColumn] = useState([]);
		const [selectedData, setSelectedData] = useState([]);
		const [selectedLevel, setSelectedLevel] = useState([]);
		const [actionTable, setActionTable] = useState();

		//receive grid data and column
		const [grid_data, setData] = useState([]);
		const [columnData, setColumnData] = useState([]);

		const [page, setPage] = useState(1);
		const [perPage, setPerPage] = useState(10);
		const [totalRows, setTotalRows] = useState(0);
		const [currentPage, setCurrentPage] = useState(1);

		const [is_serial, setSerial] = useState(0);
		const [is_selectable, setIsSelectable] = useState(1);

		//search configurations
		const [searchConfig, setSearchConfig] = useState({});
		const [inputState, setInputState] = useState('');
		const [searchState, setSearchState] = useState([]);
		const [title, setTitle] = useState('');

		//is visible and loading
		const [visible, setVisible] = React.useState(false);
		const [confirmLoading, setConfirmLoading] = React.useState(false);

		useEffect(async () => {
			if (value && value.constructor === String) {
				await fetchSelectedData(value.split(','));
				setSelectedIds(value.split(','));
			} else if (value && value.constructor === Number) {
				await fetchSelectedData([value]);
				setSelectedIds([String(value)]);
			} else if (value && Array.isArray(value) && value.length > 0) {
				await fetchSelectedData(value);
				setSelectedIds(value.map(String));
			} else {
				setSelectedIds([]);
				setSelectedLevel([]);
			}
		}, [visible, value]);

		const showModal = async () => {
			setVisible(true);
		};

		const handleClose = () => {
			setVisible(false);
		};

		const handlePagination = async (page, per_page) => {
			setPage(page);
			setPerPage(per_page);
			setCurrentPage(page);
		};

		const handleSubmit = () => {
			setConfirmLoading(true);
			setTimeout(() => {
				if (onChange) {
					onChange(is_multiple == 1 ? selectedIds : selectedIds[0]);
				}

				if (getEvent) {
					const target = {
						name: name,
						value: is_multiple == 1 ? selectedIds : selectedIds[0],
						selectedData,
						rules: { required: props?.required },
					};
					getEvent({ target });
				}

				setVisible(false);
				setConfirmLoading(false);
			}, 1000);
		};

		//fetch title
		const fetchTitle = async () => {
			let extra_condition = extra;
			const res = await fetchWrapper
				.post('master-grid/grid-title', {
					slug: slug,
					extra: { extra_condition },
					search_key: { search_text: inputState },
					search_data: searchState ?? [],
				})
				.then(async (res) => {
					const {
						total_item,
						checkbox,
						serial,
						columns,
						primary_key_field,
						search_panel,
						master_grid_title,
						action_table,
					} = res.data;

					setTotalRows(total_item);
					setActionTable(action_table);
					setIsSelectable(checkbox);
					setSerial(serial);
					setSearchConfig(search_panel);
					setTitle(master_grid_title);
					setPrimaryKeyField(primary_key_field);

					//set column data
					const tableColumns = columns.map((column) => {
						const render = (value, row, index) => {
							if (column.field_type == 'date') {
								return (
									<span
										style={{
											display: 'block',
											textAlign: column.text_align ?? 'left',
										}}
									>
										{apsisDate(value)}
									</span>
								);
							}

							if (column.field_type == 'number') {
								return (
									<span
										style={{
											display: 'block',
											textAlign: column.text_align ?? 'right',
										}}
									>
										{apsisQuantity(value, row.hidden_uom)}
									</span>
								);
							}

							if (column.field_type == 'money') {
								return (
									<span
										style={{
											display: 'block',
											textAlign: column.text_align ?? 'right',
										}}
									>
										{apsisMoney(value, row.hidden_currency)}
									</span>
								);
							}

							return (
								<span
									style={{
										display: 'block',
										textAlign: column.text_align ?? 'left',
									}}
								>
									{value}
								</span>
							);
						};

						return {
							...column,
							render,
						};
					});

					setColumnData(tableColumns);
					fetchSelectedTitle(tableColumns);
				})
				.catch((err) => console.log(err));
		};

		//fetch Data
		const fetchData = async (searchData = null) => {

			let extra_condition = extra;
			const res = await fetchWrapper
				.post('master-grid/grid-data', {
					slug: slug,
					extra: { extra_condition },
					page: page,
					per_page: perPage,
					search_key: { search_text: inputState },
					search_data: searchState ?? [],
				})
				.then((res) => {
					if (res.data && res.data.items) {
						//set response data
						const responseData = res.data.items;
						const data = responseData.map((item, index) => {
							return {
								key: String(item[primaryKeyField] ?? Object.values(item)[0]),
								...item,
							};
						});

						//set current instance
						setCurInstanceIds(data.map((item) => item.key));
						//set table data
						setData(data);
					}
				});
		};

		//Fetch Select Titles
		const fetchSelectedTitle = (columns = []) => {
			let gridColumn = columns.length > 0 ? columns : [...columnData];
			let actionColumn = [
				{
					title: 'ACTION',
					field_type: 'delete_btn',
					link: false,
					dataIndex: 'delete_btn',
					key: 'delete_btn',
					sortable: false,
					width: '50px',
				},
			];
			setSelectedColumn([...gridColumn, ...actionColumn]);
		};

		//get selected items
		const fetchSelectedData = async (itemArray = false) => {
			if (
				(!itemArray || itemArray.length <= 0) &&
				(!selectedIds || selectedIds.length <= 0)
			) {
				setSelectedData([]);
				setSelectedLevel([]);
			} else {
				let key_field = primaryKeyField.replace('hidden_', '');

				let selectedArray = '';
				if (itemArray) {
					selectedArray = itemArray && itemArray.map((x) => "'" + x + "'").toString();
				} else {
					selectedArray = selectedIds && selectedIds.map((x) => "'" + x + "'").toString();
				}

				const originalExtra = extra ? ' AND ' + extra : '';

				let extra_condition =
					selectedArray.length > 0
						? (actionTable && actionTable != ''
								? actionTable + '.' + key_field
								: key_field) +
						  ' IN (' +
						  selectedArray +
						  ')' +
						  originalExtra
						: '';

				await fetchWrapper
					.post('master-grid/grid-data', {
						slug: slug,
						extra: { extra_condition: extra_condition.trim() },
						page: 1,
						per_page: 1000,
					})
					.then((res) => {
						if (res.data && res.data.items) {
							let selectedItems = res.data.items;
							//set selected level
							let items = selectedItems.map((item) => item[labelKey]);
							setSelectedLevel(items);
							setSelectedData(selectedItems);
						}
					});
			}
		};

		//delete button component
		const DeleteBtn = (props) => {
			return (
				<button
					key={props.index}
					className={`btn btn-xs del-btn btn-danger`}
					onClick={() => handleDelete(props.primary_key)}
				>
					<i className="fa fa-trash"></i>
				</button>
			);
		};

		//filter data
		const columnsFilter = (columns) => {
			if (!columns) return;
			if (columns.length > 0) {
				columns.forEach((data, index) => {
					if (data[primaryKeyField]) {
						data.key = String(data[primaryKeyField]);
					}
					data.delete_btn = (
						<DeleteBtn index={index} primary_key={data[primaryKeyField]} />
					);
				});
				return columns;
			}
		};

		//filter with memo function
		const filterData = useMemo(() => columnsFilter(selectedData), [selectedData]);

		/*
		 * Generate Unique iem
		 */
		const onlyUnique = (value, index, self) => {
			return self.indexOf(value) === index;
		};

		/*
		 * master grid Selection
		 */
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				setSelectedIds(selectedRowKeys);

				// //selected item
				const selectItem = selectedRowKeys.map(function (item) {
					return String(item);
				});

				// //update with previous state
				if (is_multiple) {
					const removeIds = curInstanceIds.filter((id) => !selectItem.includes(id));

					let newSelectedIds = selectedIds
						? selectedIds.filter((id) => !removeIds.includes(id))
						: [];

					setSelectedIds([...newSelectedIds, ...selectItem].filter(onlyUnique));

					//filter selected Items
					const filteredSelectedItems = selectedData.filter(
						(item) => !curInstanceIds.includes(item.key)
					);

					//generate selected rows
					let newSelectedItems = [...filteredSelectedItems, ...selectedRows];
					setSelectedData(newSelectedItems);
					//update selected Level
					setSelectedLevel(newSelectedItems.map((item) => item[labelKey]));
				} else {
					//update selected ids
					setSelectedIds(selectItem);

					//update selected rows
					setSelectedData(selectedRows);

					//update selected Level
					setSelectedLevel(selectedRows.map((item) => item[labelKey]));
				}
			},
		};

		//Remove Selection
		const handleDelete = (item) => {
			if (!item) return false;
			swalConfirm('to delete this item').then((rsp) => {
				if (rsp.isConfirmed) {
					if (is_multiple && is_multiple == 1) {
						let currentItem = [...selectedIds];
						let currentLevel = [...selectedLevel];
						let currentSelectedData = selectedData.filter((data) => data.key != item);

						// get current item
						const index = currentItem.indexOf(item.toString());
						// remove items
						if (index > -1) {
							currentItem.splice(index, 1);
							currentLevel.splice(index, 1);
						}

						// update state
						setSelectedLevel(currentLevel);
						setSelectedIds(currentItem);
						setSelectedData(currentSelectedData);
					} else {
						setSelectedLevel([]);
						setSelectedIds([]);
						setSelectedData([]);
					}
				}
			});
		};

		const handleInput = (event) => {
			const { value } = event.target;
			setInputState(value);
			handlePagination(1, 10);
		};

		//handle Search
		const handleSearch = (query) => {
			setSearchState(query);
		};

		//call from parent
		React.useImperativeHandle(ref, () => ({
			//getData() { fetchData(1, perPage, is_serial, searchStat); }
		}));

		useEffect(async () => {
			if (visible) {
				await fetchTitle();
				await fetchData();
				await fetchSelectedData();
				isMounted.current = true;
			}
		}, [visible, extra, slug]);

		//when Checked and unchecked
		useEffect(async () => {
			if (isMounted.current) {
				await fetchTitle();
				await fetchData();
			}
		}, [inputState, searchState, page, perPage]);

		return (
			<div className="d-flex">
				{displaySelected && (
					<div
						className={`dropdown_grid_level ${
							selectedLevel.length == 0 ? 'no-selected' : ''
						}`}
						style={{
							maxHeight: '32px',
							display: 'block',
							width: '100%',
							border: 'solid 1px',
							borderColor: '#d9d9d9',
							borderRadius: '4px 0 0 4px',
							background: 'white',
							overflow: 'hidden',
						}}
					>
						{selectedLevel.length > 0
							? selectedLevel.length > 2
								? selectedLevel.length + ' items selected '
								: // selectedLevel.length + ' ' + label_name + 's'
								  selectedLevel.toString()
							: 'Please select'}
					</div>
				)}
				<Button
					type="primary"
					style={{
						minHeight: '32px',
						background: '#007e3a',
						borderColor: '#007e3a',
						borderRadius: '0 4px 4px 0',
					}}
					size={`${props.btn_size ?? 'small'}` || 'small'}
					className={`${props.className ?? ''} grid-dropdown-custom-hover`}
					onClick={showModal}
					disabled={disabled ? disabled : false}
				>
					{props.btn_text || 'Select...'}
				</Button>
				<Modal
					visible={visible}
					title={props.title ?? title}
					onOk={handleSubmit}
					onCancel={handleClose}
					width={1000}
					footer={[
						<Button key="back" type="primary" danger onClick={handleClose}>
							Cancel
						</Button>,
						<Button
							key="submit"
							type="primary"
							loading={confirmLoading}
							onClick={handleSubmit}
						>
							Submit
						</Button>,
					]}
					wrapClassName="dropdown-grid"
				>
					{searchConfig && searchConfig?.search_fields && (
						<SearchComponent
							callFrom={`grid`}
							searchConfig={searchConfig}
							setQuery={handleSearch}
						/>
					)}
					<div className="search-filter">
						<Input
							type="text"
							autoComplete="off"
							name="search_text"
							value={inputState ?? ''}
							onChange={handleInput}
						/>
						<span className="icon">
							<i className="fa fa-search" />
						</span>
					</div>

					<Table
						rowSelection={{
							type: is_multiple ? 'checkbox' : 'radio',
							selectedRowKeys: selectedIds,
							...rowSelection,
						}}
						dataSource={grid_data}
						columns={columnData}
						pagination={{
							onChange: handlePagination,
							pageSize: perPage,
							total: totalRows,
							current: currentPage,
						}}
						scroll={{ x: true }}
					/>
					<div className="selected-items">
						<h2>Selected Item</h2>
						<Table
							dataSource={filterData}
							columns={selectedColumn}
							pagination={false}
							scroll={{ x: true }}
						/>
					</div>
				</Modal>
			</div>
		);
	}
);
export default React.memo(DropdownGrid);
