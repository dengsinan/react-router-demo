import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Table, Input, Form, FormInstance } from '@arco-design/web-react';
import { RefInputType } from '@arco-design/web-react/es/Input';
import { PayloadInfo } from './constants';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import { RowCallbackProps } from '@arco-design/web-react/es/Table/interface';

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

function EditableRow(props: RowCallbackProps) {
  const { children, className, ...rest } = props;
  const refForm = useRef<FormInstance>(null);

  const getForm = () => refForm.current!;

  return (
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
    </EditableContext.Provider>
  );
}

function EditableCell(props: RowCallbackProps) {
  const { children, className, rowData, column, onHandleSave } = props;
  const ref = useRef<HTMLDivElement>(null);
  const refInput = useRef<RefInputType>(null);
  const { getForm } = useContext(EditableContext);
  const [editing, setEditing] = useState(false);
  const handleClick = useCallback(
    (e: any) => {
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

  const cellValueChangeHandler = (value: RootObject) => {
    const form = getForm!();
    form.validate([column.dataIndex], (errors, values) => {
      if (!errors || !errors[column.dataIndex]) {
        setEditing(!editing);
        onHandleSave && onHandleSave({ ...rowData, ...values });
      }
    });
  };

  if (editing) {
    return (
      <div ref={ref}>
        {
          <FormItem
            style={{ marginBottom: 0 }}
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            initialValue={rowData[column.dataIndex]}
            field={column.dataIndex}
            rules={[{ required: true }]}
          >
            <Input ref={refInput} onPressEnter={cellValueChangeHandler} />
          </FormItem>
        }
      </div>
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
};

const TestEditTable: React.FC<TestEditTableProps> = props => {
  const { updateToSave } = props;

  const [data, setData] = useState<RootObject[]>([
    {
      key: '1',
      name: 'Jane Doe',
      salary: 23000,
      school: '32 Park Road, London',
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

TestEditTable.displayName = 'TestEditTable';

export default TestEditTable;
