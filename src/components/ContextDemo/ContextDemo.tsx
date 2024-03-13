import React, { useRef, useState } from 'react';
import { Button, Space, Table, Tag } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import TestDrawer from './TestDrawer';
import { useBoolean } from 'ahooks';
import { PayloadInfo, TestContext } from './constants';

interface User {
  key: string;
  name: string;
  salary: number;
  address: string;
  email: string;
  expandValue?: PayloadInfo[];
}

const ContextDemo: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([
    {
      key: '1',
      name: 'Jane Doe',
      salary: 23000,
      address: '32 Park Road, London',
      email: 'jane.doe@example.com',
      expandValue: [
        {
          school: '第 1 条的旧数据',
        },
      ],
    },
    {
      key: '2',
      name: 'Alisa Ross',
      salary: 25000,
      address: '35 Park Road, London',
      email: 'alisa.ross@example.com',
      expandValue: [
        {
          school: '第 2 条的旧数据',
        },
      ],
    },
    {
      key: '3',
      name: 'Kevin Sandra',
      salary: 22000,
      address: '31 Park Road, London',
      email: 'kevin.sandra@example.com',
    },
    {
      key: '4',
      name: 'Ed Hellen',
      salary: 17000,
      address: '42 Park Road, London',
      email: 'ed.hellen@example.com',
    },
    {
      key: '5',
      name: 'William Smith',
      salary: 27000,
      address: '62 Park Road, London',
      email: 'william.smith@example.com',
    },
  ]);

  const currentUserId = useRef<string>();

  const updateExpandValue = (payload: PayloadInfo[]) => {
    setUserList(
      userList.map(i =>
        i.key === currentUserId.current
          ? { ...i, expandValue: [...payload] }
          : i
      )
    );
  };

  const [visible, { set }] = useBoolean(false);

  const columns: ColumnProps<User>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (value, record) => (
        <Space>
          {value}
          <Button
            type="outline"
            icon={<IconPlus />}
            onClick={e => {
              e.stopPropagation();
              // 记录当前打开的用户
              currentUserId.current = record.key;
              set(true);
            }}
          ></Button>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  return (
    <>
      <TestContext.Provider value={{ updateExpandValue }}>
        <Table
          columns={columns}
          data={userList}
          expandedRowRender={record =>
            record.expandValue?.map(({ school }) => (
              <Space>
                school: <Tag color="#7bc616">{school}</Tag>
              </Space>
            ))
          }
        />

        {visible && <TestDrawer visible={visible} updateVisible={set} />}
      </TestContext.Provider>
    </>
  );
};

ContextDemo.displayName = 'ContextDemo';

export default ContextDemo;
