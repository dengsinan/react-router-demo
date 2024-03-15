import React from 'react';
import { Tree } from '@arco-design/web-react';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { cloneDeep, filter } from 'lodash-es';
const TreeNode = Tree.Node;

const treeData: TreeDataType[] = [
  {
    title: '项目 A',
    key: '0-0',
    children: [
      {
        title: '执行 A',
        key: '0-0-1',
      },
      {
        title: '执行 B',
        key: '0-0-2',
        children: [
          {
            title: '任务 A',
            key: '0-0-2-1',
            isLeaf: true,
            checkable: true,
          },
          {
            title: '任务 B',
            key: '0-0-2-2',
            isLeaf: true,
            checkable: true,
          },
        ],
      },
    ],
  },
  {
    title: '项目 B',
    key: '0-1',
    children: [
      {
        title: '执行 C',
        key: '0-1-1',
        children: [
          {
            title: '任务 C ',
            key: '0-1-1-1',
            isLeaf: true,
            checkable: true,
          },
          {
            title: '任务 D',
            key: '0-1-1-2',
            isLeaf: true,
            checkable: true,
          },
        ],
      },
      {
        title: '执行 D',
        key: '0-1-2',
      },
    ],
  },
];

type TestTreeProps = {
  updateSelectedTasks: (tasks: any[]) => void;
};

const TestTree: React.FC<TestTreeProps> = props => {
  const { updateSelectedTasks } = props;

  function handleCheck(checkedKeys: string[]) {
    const tree = cloneDeep(treeData).filter(i => checkChildren(i, checkedKeys));
    updateSelectedTasks(tree);
  }

  function checkChildren(child: TreeDataType, checkedKeys: string[]): boolean {
    if (child.isLeaf) {
      return !!(child.checkable && checkedKeys.includes(child.key!));
    } else {
      if (child.children?.length) {
        child.children = child.children.filter(i =>
          checkChildren(i, checkedKeys)
        );
        return !!child.children.length;
      }
      return false;
    }
  }

  return (
    <>
      <Tree onCheck={handleCheck} treeData={treeData}></Tree>
    </>
  );
};

TestTree.displayName = 'TestTree';

export default TestTree;
