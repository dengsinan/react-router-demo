import React, { useRef, useState } from 'react';
import { Button, Space, Table, Tag } from '@arco-design/web-react';
import { IconEdit, IconPlus } from '@arco-design/web-react/icon';
import { ColumnProps } from '@arco-design/web-react/es/Table';
import TaskDrawer from './TaskDrawer';
import { useBoolean } from 'ahooks';
import { TaskItemVo, LaborContext, LaborDetailListItemVo } from './constants';

const LaborTable: React.FC = () => {
  const [laborList, setLaborList] = useState<LaborDetailListItemVo[]>([
    {
      id: 1,
      laborTime: '2031-03-05',
      taskItemVoList: [
        {
          projectId: 1,
          projectName: 'vhawk Lint静态检查工具v2.6',
          storyId: 1,
          taskId: 1,
          taskName: '首页相关功能开发',
          parent: 0,
          consumed: 2,
        },
        {
          projectId: 12,
          projectName: 'vhawk 2.5.1',
          storyId: 0,
          taskId: 20,
          taskName: '规则集管理页面测试',
          parent: 0,
          consumed: 4,
        },
      ],
    },
    {
      id: 2,
      laborTime: '2031-03-06',
    },
  ]);

  const currentLaborId = useRef<number>();

  const [laborTaskList, setLaborTaskList] = useState<TaskItemVo[]>();

  const updateLaborTaskList = (payload: TaskItemVo[]) => {
    setLaborList(
      laborList.map(i =>
        i.id === currentLaborId.current
          ? { ...i, taskItemVoList: [...payload] }
          : i
      )
    );
  };

  const [visible, { set }] = useBoolean(false);

  const columns: ColumnProps<LaborDetailListItemVo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '提交审批时间',
      dataIndex: 'laborTime',
      render: (_, { id, laborTime, taskItemVoList }) => (
        <Space>
          <span>{laborTime}</span>

          <Button
            type="outline"
            icon={taskItemVoList ? <IconEdit /> : <IconPlus />}
            onClick={e => {
              e.stopPropagation();
              currentLaborId.current = id;
              console.log(`taskItemVoList`, taskItemVoList);
              if (taskItemVoList) {
                setLaborTaskList([...taskItemVoList]);
              } else {
                setLaborTaskList([]);
              }
              set(true);
            }}
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <LaborContext.Provider value={{ laborTaskList, updateLaborTaskList }}>
        <Table
          rowKey="id"
          columns={columns}
          data={laborList}
          expandedRowRender={record =>
            record.taskItemVoList?.map(({ taskId, taskName, consumed }) => (
              <Space key={taskId}>
                <Tag color="#7bc616">{taskName}</Tag>
                <span>消耗：{consumed}</span>
              </Space>
            ))
          }
        />

        {visible && <TaskDrawer visible={visible} updateVisible={set} />}
      </LaborContext.Provider>
    </>
  );
};

export default LaborTable;
