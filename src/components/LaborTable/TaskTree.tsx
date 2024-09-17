import React, {
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Space, Tag, Tree } from '@arco-design/web-react';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { cloneDeep, uniqueId } from 'lodash-es';
import apiData from './app.json';
import { LaborContext, TaskNode, UserTaskVo } from './constants';

interface TaskTreeProps {
  treeRef: Ref<TaskTreeInstance>;
}

export type TaskTreeInstance = {
  getSelectedTasks: () => TreeDataType[];
};

// 模拟接口调用
const useTaskList = () => {
  return { data: apiData as UserTaskVo[] };
};

const TaskTree: React.FC<TaskTreeProps> = props => {
  const { treeRef } = props;

  const { laborTaskList } = useContext(LaborContext);

  // 接口数据
  const { data } = useTaskList();

  // tree 数据
  const [taskList, setTaskList] = useState<TreeDataType[]>();

  // 设置初始 tree 数据为接口数据并转换
  useEffect(() => {
    setTaskList(cloneDeep(data).map(i => taskToTreeNode(i)));
  }, [data]);

  // 默认选中 keys
  const defaultCheckedKeys = useMemo(() => {
    return (
      laborTaskList?.map(
        ({ projectId, storyId, taskId }) =>
          `-${[projectId, storyId, taskId].filter(i => i).join('-')}`
      ) || []
    );
  }, [laborTaskList]);

  // 当前选中的 keys
  const [checkedKeys, setCheckKeys] = useState<string[]>(defaultCheckedKeys);

  useImperativeHandle(treeRef, () => {
    return {
      // 根据 key 找到当前节点及其父节点
      getSelectedTasks() {
        // return cloneDeep(data).filter(checkedNodeFilter);
        return cloneDeep(data)
          .map(i => taskToTreeNode(i))
          .filter(checkedNodeFilter);
      },
    };
  });

  function checkedNodeFilter(taskTreeNode: TreeDataType): boolean {
    if (taskTreeNode.isLeaf) {
      return !!(
        taskTreeNode.checkable && checkedKeys.includes(taskTreeNode.key!)
      );
    } else {
      if (taskTreeNode.children?.length) {
        taskTreeNode.children = taskTreeNode.children.filter(checkedNodeFilter);
        return !!taskTreeNode.children.length;
      }
      return false;
    }
  }

  // 任务 -> 树节点
  function taskToTreeNode(taskNode: TaskNode, _key: string = '') {
    const {
      projectName,
      executionName,
      storyName,
      taskName,
      projectId,
      executionId,
      storyId,
      taskId,
      executionVoList,
      storyVoList,
      userTaskVoList,
      status,
      type,
    } = taskNode;

    _key = _key + '-' + (taskId ?? executionId ?? storyId ?? projectId);

    const node: TreeDataType = {
      title: (
        <Space>
          <span>{taskName || storyName || executionName || projectName}</span>
          {taskId && <Tag>{status}</Tag>}
        </Space>
      ),
      key: _key,
      // isLeaf:
      //   !!taskId &&
      //   ((type === 1 && userTaskVoList?.length === 0) || type === 0),
      isLeaf:
        (!!taskId && type === 1 && userTaskVoList?.length === 0) ||
        (!!taskId && type === 0),
      children: [],
      checkable:
        (!!taskId && type === 1 && userTaskVoList?.length === 0) ||
        (!!taskId && type === 0),
      projectId,
      projectName,
      executionId,
      executionName,
      storyId,
      storyName,
      taskId,
      taskName,
      consumed: taskId ? 0 : undefined, // 提前准备编辑时需要的数据
      // 默认选中及其额外信息赋值
      ...(defaultCheckedKeys.includes(_key)
        ? laborTaskList?.find(i => i.taskId === taskId) || {}
        : {}),
    };

    if (executionVoList) {
      node.children!.push(...executionVoList.map(i => taskToTreeNode(i, _key)));
    }

    if (storyVoList) {
      node.children!.push(...storyVoList.map(i => taskToTreeNode(i, _key)));
    }

    if (userTaskVoList) {
      node.children!.push(...userTaskVoList.map(i => taskToTreeNode(i, _key)));
    }

    return node;
  }

  return (
    <>
      {taskList && (
        <Tree
          checkedKeys={checkedKeys}
          onCheck={setCheckKeys}
          treeData={taskList}
        ></Tree>
      )}
    </>
  );
};

export default TaskTree;
