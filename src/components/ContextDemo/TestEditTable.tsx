import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Table,
  Input,
  Form,
  FormInstance,
  Space,
} from '@arco-design/web-react';
import { RefInputType } from '@arco-design/web-react/es/Input';
import { PayloadInfo } from './constants';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { RowCallbackProps } from '@arco-design/web-react/es/Table/interface';
import { Button } from 'antd';

interface RootObject {
  key: string;
  name: string;
  salary: number;
  school: string;
  email: string;
}

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
    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
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

type TestEditTableProps = {
  updateToSave: (value: PayloadInfo[]) => void;
  selectedTasks: any[];
};

export type TestEditTableInstance = {
  validateForm: () => Promise<void>;
};

const TestEditTable = forwardRef<TestEditTableInstance, TestEditTableProps>(
  (props, ref) => {
    const { updateToSave, selectedTasks } = props;

    console.log(`selectedTasks`, selectedTasks);

    const editRowRef = useRef<any>(null);

    const FEditableRow = forwardRef(function EditableRow(
      props: RowCallbackProps,
      fRef
    ) {
      const { children, className, ...rest } = props;
      const refForm = useRef<FormInstance>(null);

      const getForm = () => refForm.current!;

      useImperativeHandle(fRef, () => {
        return {
          validateForm: async () => {
            // const err = await getForm().validate();
            // console.log(`form err`, err);
            const form = getForm();
            console.log(
              `drawer form`,
              form.getFieldValue('school'),
              form.getFields()
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
    });

    useImperativeHandle(ref, () => {
      return {
        // validateForm: editRowRef.current!.validateForm,
        validateForm: async () => {
          // throw new Error('error');
          // await editRowRef.current!.errFn();

          await editRowRef.current!.clickFn();
        },
      };
    });

    const [data, setData] = useState<RootObject[]>([
      {
        key: '1',
        name: 'Jane Doe',
        salary: 23000,
        school: '100',
        email: 'jane.doe@example.com',
      },
      {
        key: '2',
        name: 'Alisa Ross',
        salary: 25000,
        school: '35 Park Road, London',
        email: 'alisa.ross@example.com',
      },
      {
        key: '3',
        name: 'Kevin Sandra',
        salary: 22000,
        school: '31 Park Road, London',
        email: 'kevin.sandra@example.com',
      },
      {
        key: '4',
        name: 'Ed Hellen',
        salary: 17000,
        school: '42 Park Road, London',
        email: 'ed.hellen@example.com',
      },
      {
        key: '5',
        name: 'William Smith',
        salary: 27000,
        school: '62 Park Road, London',
        email: 'william.smith@example.com',
      },
    ]);

    const columns: ColumnProps<RootObject>[] = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Salary',
        dataIndex: 'salary',
      },
      {
        title: 'School',
        dataIndex: 'school',
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

    function handleSave(row: RootObject) {
      const newData = [...data];
      const index = newData.findIndex(item => row.key === item.key);
      newData.splice(index, 1, { ...newData[index], ...row });
      setData(newData);

      console.log(`row`, row);
      updateToSave([{ school: row.school }]);
    }

    const nameFormRef = useRef<FormInstance | null>(null);

    // async function validateForm() {
    //   const form = nameFormRef.current;
    //   const err = await form?.validate();
    //   console.log(`name form err`, err);
    // }

    // useImperativeHandle(ref, () => {
    //   return {
    //     validateForm,
    //   };
    // });

    return (
      <>
        <Table
          data={data}
          components={{
            body: {
              row: (...props) => {
                // console.log(`props`, props);
                return <FEditableRow ref={editRowRef} {...props[0]} />;
              },
              cell: EditableCell,
            },
          }}
          columns={columns}
          className="table-demo-editable-cell"
        />

        <Form ref={nameFormRef} style={{ width: 600 }} autoComplete="off">
          <FormItem
            label="Username"
            field="name"
            rules={[
              {
                validator(value, callback) {
                  if (!value) {
                    callback('name 不能为空');
                  }
                },
              },
            ]}
          >
            <Input placeholder="please enter your username..." />
          </FormItem>
        </Form>

        {/* <Button onClick={validateForm}>Submit</Button> */}
      </>
    );
  }
);

TestEditTable.displayName = 'TestEditTable';

export default TestEditTable;
