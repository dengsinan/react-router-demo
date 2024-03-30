import { Button, Drawer, Message, Space } from '@arco-design/web-react';
import React, {
  Ref,
  RefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import TaskEditTable, { TaskEditTableRowInstance } from './TaskEditTable';
import { TaskItemVo, LaborContext, Task } from './constants';
import TaskTree, { TaskTreeInstance } from './TaskTree';
import { TreeDataType } from '@arco-design/web-react/es/Tree/interface';

type TaskDrawerProps = {
  visible: boolean;
  updateVisible: (visible: boolean) => void;
};

enum LaborTaskStep {
  selectTask,
  editLaborHour,
}

const TaskDrawer: React.FC<TaskDrawerProps> = props => {
  const { visible, updateVisible } = props;

  const { laborTaskList } = useContext(LaborContext);

  const treeRef: RefObject<TaskTreeInstance> = useRef(null);

  const editTableRef: RefObject<TaskEditTableRowInstance> = useRef(null);

  const [step, setStep] = useState<LaborTaskStep>(LaborTaskStep.selectTask);

  // 当前选中的任务 在 tree 和 table 之间互通
  const [selectedTasks, setSelectedTasks] = useState<TreeDataType[]>([]);

  function handleNext() {
    if (step === LaborTaskStep.selectTask) {
      const tasks = treeRef.current!.getSelectedTasks();

      setSelectedTasks(tasks);

      if (!tasks.length) {
        Message.error('选择任务');
        return;
      }

      setStep(LaborTaskStep.editLaborHour);
    } else if (step === LaborTaskStep.editLaborHour) {
      111;
    }
  }

  const Footer = () => {
    return (
      <Space>
        {step !== LaborTaskStep.selectTask && (
          <Button
            type="default"
            onClick={() => setStep(LaborTaskStep.selectTask)}
          >
            上一步
          </Button>
        )}
        <Button type="primary" onClick={handleNext}>
          {step === LaborTaskStep.editLaborHour ? '完成' : '下一步'}
        </Button>
      </Space>
    );
  };

  // 默认选中 keys
  const defaultCheckedKeys = useMemo(() => {
    return (
      laborTaskList?.map(
        ({ projectId, storyId, taskId }) =>
          `-${[projectId, storyId, taskId].filter(i => i).join('-')}`
      ) || []
    );
  }, [laborTaskList]);

  return (
    <>
      <Drawer
        width={'50%'}
        title="Test"
        footer={<Footer />}
        visible={visible}
        closable
      >
        {step === LaborTaskStep.selectTask && (
          <TaskTree treeRef={treeRef} defaultCheckedKeys={defaultCheckedKeys} />
        )}

        {step === LaborTaskStep.editLaborHour && selectedTasks.length > 0 && (
          <TaskEditTable
            selectedTasks={selectedTasks}
            updateToSave={value => {
              tableDataToSave.current = value;
            }}
            ref={editTableRef}
          />
        )}
      </Drawer>
    </>
  );
};

export default TaskDrawer;
