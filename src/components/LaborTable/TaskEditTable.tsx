import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useImperativeHandle,
  forwardRef,
  FC,
  Ref,
} from 'react';
import {
  Table,
  Input,
  Form,
  FormInstance,
  Space,
} from '@arco-design/web-react';
import { RefInputType } from '@arco-design/web-react/es/Input';
import { TaskItemVo, Task } from './constants';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { RowCallbackProps } from '@arco-design/web-react/es/Table/interface';
import { Button } from 'antd';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';

const FormItem = Form.Item;
const EditableContext = React.createContext<{ getForm?: () => FormInstance }>(
  {}
);

function EditableCell(props: RowCallbackProps) {
  const { children, className, rowData, column, onHandleSave } = props;
  const ref = useRef<HTMLDivElement>(null);
  const refInput = useRef<RefInputType>(null);
  const { getForm } = useContext(EditableContext);
  const [editing, setEditing] = useState(false);
  const handleClick = useCallback(
    (e: any) => {
      // console.log('body click');

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
    editing && refInput.current && refInput.current.focus();
  }, [editing]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClick]);

  const cellValueChangeHandler = async (value: RootObject) => {
    const form = getForm!();
    // console.log(`cell form`, form.getFieldValue('school'), form.getFields());

    // 报错 Error: form validate error, get errors by error.errors
    // await form.validate();
    // .then(res => {
    //   console.log(`cell form res`, res);
    // })
    // .catch(err => {
    //   console.log(`cell form err`, err);
    // });

    form.validate([column.dataIndex], (errors, values) => {
      // console.log(`cell err`, errors);
      if (!errors || !errors[column.dataIndex]) {
        setEditing(!editing);
        onHandleSave && onHandleSave({ ...rowData, ...values });
      }
    });
  };

  if (editing) {
    return (
      <>
        <div ref={ref}>
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
            rules={[
              { required: true, message: '数据不能为空' },
              {
                validator(value, callback) {
                  if (+value > 10) {
                    callback('校验失败');
                  }
                },
              },
            ]}
          >
            <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
          </FormItem>
        </div>
        {/* <Button type="primary" onClick={handleClick}>
          cell save
        </Button> */}
      </>
    );
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
  rowRef: Ref<TaskEditTableRowInstance>;
};

export type TaskEditTableRowInstance = {
  validateForm: () => Promise<void>;
};

const TaskEditTable: FC<TaskEditTableProps> = props => {
  const { selectedTasks, rowRef } = props;

  console.log(`selectedTasks`, selectedTasks);

  function EditableRow(props: RowCallbackProps) {
    const { children, className, ...rest } = props;
    const refForm = useRef<FormInstance>(null);

    const getForm = () => refForm.current!;

    useImperativeHandle(rowRef, () => {
      return {
        validateForm: async () => {
          // const err = await getForm().validate();
          // console.log(`form err`, err);
          const form = getForm();
          console.log(
            `drawer form`,
            form.getFieldValue('school'),
            form.getFields(),
            form.getInnerMethods(true).innerGetFieldValue('school')
          );
          await form.validate();

          // form.validate(['school'], err => {
          //   console.log(`drawer school err`, err);
          // });
        },
        errFn() {
          console.log('form child');

          throw new Error('来自子元素');
        },
        clickFn: handleClick,
      };
    });

    // 报错
    async function handleClick() {
      // const form = getForm();
      const form = refForm.current!;
      console.log(`form`, form.getFieldValue('school'), form.getFields());
      // 报错 Error: form validate error, get errors by error.errors
      const err = await form.validate();
      console.log(`form err`, err);
    }

    return (
      <>
        <EditableContext.Provider
          value={{
            getForm,
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

          <Button type="default" onClick={handleClick}>
            form save
          </Button>
        </EditableContext.Provider>
      </>
    );
  }

  const [data, setData] = useState<TreeDataType[]>(selectedTasks.map(i => i));

  const columns: ColumnProps<TreeDataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
    },
    {
      title: '工时',
      dataIndex: 'hour',
      editable: true,
      onCell: () => ({
        onHandleSave: handleSave,
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Operation',
      dataIndex: 'op',
    },
  ];

  function handleSave(row: TreeDataType) {
    const newData = [...data];
    const index = newData.findIndex(item => row.key === item.key);
    newData.splice(index, 1, { ...newData[index], ...row });
    setData(newData);

    console.log(`row`, row);
    updateToSave([{ taskName: row.school }]);
  }

  return (
    <>
      <Table
        data={data}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        columns={columns}
        className="table-demo-editable-cell"
      />
    </>
  );
};

export default TaskEditTable;
