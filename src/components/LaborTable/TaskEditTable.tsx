import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useImperativeHandle,
  FC,
  Ref,
} from 'react';
import {
  Table,
  Form,
  FormInstance,
  TableColumnProps,
  InputNumber,
} from '@arco-design/web-react';
import { RefInputType } from '@arco-design/web-react/es/Input';
import { RowCallbackProps } from '@arco-design/web-react/es/Table/interface';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { useUpdate } from 'ahooks';

const FormItem = Form.Item;

const EditableContext = React.createContext<{
  getForm?: () => FormInstance;
  update?: () => void;
}>({});

function EditableCell(props: RowCallbackProps) {
  const leaveTiem = 1;
  const weeks: boolean = true;
  const { children, className, rowData, column, onHandleSave } = props;
  const ref = useRef<HTMLDivElement>(null);
  const refInput = useRef<RefInputType>(null);
  const { getForm, update } = useContext(EditableContext);
  const [editing, setEditing] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (
        editing &&
        column.editable &&
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.classList.contains('js-demo-select-option')
      ) {
        cellValueChangeHandler(rowData[column.dataIndex]);
      }
    },
    [editing, rowData, column]
  );

  useEffect(() => {
    if (editing) {
      refInput.current && refInput.current.focus();
      update?.();
    }
  }, [editing]);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [handleClick]);

  const cellValueChangeHandler = (value: number) => {
    const form = getForm?.();
    form?.validate([column.dataIndex], (errors, values) => {
      if (!errors || !errors[column.dataIndex]) {
        setEditing(!editing);
        onHandleSave && onHandleSave({ ...rowData, ...values });
      }
    });
  };

  if (editing) {
    if (column.dataIndex === 'consumed' && rowData.children.length === 0) {
      return (
        <div ref={ref}>
          {
            <FormItem
              style={{ marginBottom: 0 }}
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 24 }}
              initialValue={rowData[column.dataIndex]}
              field={column.dataIndex}
              required
              rules={[
                {
                  type: 'number',
                  required: true,
                  validator: (value, cb) => {
                    if (value > 8 && !weeks) {
                      return cb('不能超过8小时');
                    } else if (value === 0 || !value) {
                      return cb('请正确分配当日工时');
                    } else if (!/^(\d+(\.\d{1,2})?)$/.test(value)) {
                      return cb('不能超过两位小数点');
                    } else if (value + leaveTiem > 8) {
                      return cb('当前工时填报有误');
                    }
                    // else if (value > rowData.left) {
                    //   return cb('不能大于剩余工时');
                    // }
                  },
                },
              ]}
            >
              <InputNumber
                ref={refInput}
                autoComplete="new-password"
                size="small"
                onKeyDown={e => {
                  // @ts-expect-error  xxx
                  e.keyCode! === 13 && cellValueChangeHandler(e.target.value);
                }}
              />
            </FormItem>
          }
        </div>
      );
    }
  }

  return (
    <div
      className={column.editable ? `editable-cell ${className}` : className}
      onClick={() => column.editable && setEditing(!editing)}
    >
      {children}
    </div>
  );
}

type TaskEditTableProps = {
  selectedTasks: TreeDataType[];
  tableRef: Ref<TaskEditTableInstance>;
  rowRef: Ref<TaskEditTableRowInstance>;
};

export type TaskEditTableInstance = {
  getSavedTask: () => TreeDataType[];
};

export type TaskEditTableRowInstance = {
  valid: () => Promise<void>;
};

const TaskEditTable: FC<TaskEditTableProps> = props => {
  const { selectedTasks, tableRef, rowRef } = props;

  console.log(`selectedTasks`, selectedTasks);

  const EditableRow = (props: RowCallbackProps) => {
    const { children, record, className, ...rest } = props;
    const refForm = useRef<FormInstance | null>(null);
    const update = useUpdate();

    const getForm = () => refForm.current;

    useImperativeHandle(rowRef, () => ({
      valid: async () => {
        const form = getForm?.();
        await form?.validate();
      },
    }));

    return (
      <EditableContext.Provider
        value={{
          // @ts-expect-error xxxx
          getForm,
          update,
        }}
      >
        <Form
          style={{ display: 'table-row' }}
          children={children}
          ref={refForm}
          wrapper="tr"
          wrapperProps={rest}
          className={`${className} editable-row`}
        />
      </EditableContext.Provider>
    );
  };

  const [editTasks, setEditTask] = useState<TreeDataType[]>(selectedTasks);

  const columns: TableColumnProps<TreeDataType>[] = [
    {
      title: '任务',
      dataIndex: 'title',
      fixed: 'left',
      width: 220,
      ellipsis: true,
    },
    {
      title: '剩余工时',
      dataIndex: 'left',
      width: 200,
    },
    {
      title: '当日分配工时',
      dataIndex: 'consumed',
      editable: true,
      width: 200,
    },
  ];

  function updateConsumedByKey(
    data: TreeDataType[],
    key: string,
    newData: number
  ): TreeDataType[] {
    return data.map(item => {
      if (item.key === key) {
        return {
          ...item,
          consumed: newData,
        };
      }
      if (item.children) {
        return {
          ...item,
          children: updateConsumedByKey(item.children, key, newData),
        };
      }
      return item;
    });
  }

  function handleSave(row: TreeDataType) {
    const newData = updateConsumedByKey([...editTasks], row.key!, row.consumed);
    setEditTask(newData);
  }

  useImperativeHandle(tableRef, () => {
    return {
      // 获取编辑后拍平的任务列表
      getSavedTask() {
        const res: TreeDataType[] = [];

        function getTask(i: TreeDataType) {
          if (i.taskId) {
            res.push(i);
          }

          if (i.children) {
            i.children.forEach(getTask);
          }
        }

        editTasks.forEach(getTask);

        return res;
      },
    };
  });

  return (
    <>
      <Table
        data={editTasks}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        columns={columns.map(column =>
          column.editable
            ? {
                ...column,
                onCell: () => ({
                  onHandleSave: handleSave,
                }),
              }
            : column
        )}
        className="table-demo-editable-cell"
        defaultExpandAllRows={true}
      />
    </>
  );
};

export default TaskEditTable;
