import React from 'react';
import { Tree } from '@arco-design/web-react';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';
import { cloneDeep, filter } from 'lodash-es';
import apiData from './app.json';
import { ExecutionVoList, StoryVoList, Task, UserTaskVoList } from './types';
const TreeNode = Tree.Node;

// const treeData: TreeDataType[] = [
//   {
//     title: '项目 A',
//     key: '0-0',
//     children: [
//       {
//         title: '执行 A',
//         key: '0-0-1',
//       },
//       {
//         title: '执行 B',
//         key: '0-0-2',
//         children: [
//           {
//             title: '任务 A',
//             key: '0-0-2-1',
//             isLeaf: true,
//             checkable: true,
//           },
//           {
//             title: '任务 B',
//             key: '0-0-2-2',
//             isLeaf: true,
//             checkable: true,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: '项目 B',
//     key: '0-1',
//     children: [
//       {
//         title: '执行 C',
//         key: '0-1-1',
//         children: [
//           {
//             title: '任务 C ',
//             key: '0-1-1-1',
//             isLeaf: true,
//             checkable: true,
//           },
//           {
//             title: '任务 D',
//             key: '0-1-1-2',
//             isLeaf: true,
//             checkable: true,
//           },
//         ],
//       },
//       {
//         title: '任务 E',
//         key: '0-1-2',
//         isLeaf: true,
//         checkable: true,
//       },
//     ],
//   },
// ];

type TestTreeProps = {
  updateSelectedTasks: (tasks: any[]) => void;
};

const TestTree: React.FC<TestTreeProps> = props => {
  const { updateSelectedTasks } = props;

  const treeData = apiData.map(convertData);

  function handleCheck(checkedKeys: string[]) {
    const tree = cloneDeep(treeData).filter(i => checkChildren(i, checkedKeys));
    updateSelectedTasks(tree);
    console.log(`tree`, tree);
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

function convertData({
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
}: Partial<Task & ExecutionVoList & StoryVoList & UserTaskVoList>) {
  const node: TreeDataType = {
    title: projectName || executionName || storyName || taskName,
    key: (projectId || executionId || storyId || taskId) as unknown as string,
    isLeaf: !!taskId,
    children: [],
    checkable: !!taskId,
  };

  if (executionVoList) {
    node.children!.push(...executionVoList.map(convertData));
  }

  if (storyVoList) {
    node.children!.push(...storyVoList.map(convertData));
  }

  if (userTaskVoList) {
    node.children!.push(...userTaskVoList.map(convertData));
  }

  return node;
}

TestTree.displayName = 'TestTree';

export default TestTree;
