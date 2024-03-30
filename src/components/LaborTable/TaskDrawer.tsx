import { Button, Drawer, Message, Space } from '@arco-design/web-react';
import React, { RefObject, useContext, useRef, useState } from 'react';
import TaskEditTable, {
  TaskEditTableInstance,
  TaskEditTableRowInstance,
} from './TaskEditTable';
import { LaborContext, TaskItemVo } from './constants';
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

  const { updateLaborTaskList } = useContext(LaborContext);

  const [step, setStep] = useState<LaborTaskStep>(LaborTaskStep.selectTask);

  // 当前选中的任务 在 tree 和 table 之间互通
  const [selectedTasks, setSelectedTasks] = useState<TreeDataType[]>([]);

  const treeRef: RefObject<TaskTreeInstance> = useRef(null);

  const editTableRef: RefObject<TaskEditTableInstance> = useRef(null);

  const editTableRowRef: RefObject<TaskEditTableRowInstance> = useRef(null);

  async function handleNext() {
    if (step === LaborTaskStep.selectTask) {
      // 获取已选择的任务
      const tasks = treeRef.current!.getSelectedTasks();

      setSelectedTasks(tasks);

      if (!tasks.length) {
        Message.error('选择任务');
        return;
      }

      setStep(LaborTaskStep.editLaborHour);
    } else if (step === LaborTaskStep.editLaborHour) {
      // 表单校验
      await editTableRowRef.current?.valid();
      // 获取编辑后的表格数据
      const data = editTableRef.current?.getSavedTask();
      console.log(`data`, data);

      // 更新外部 table 展开数据
      if (data) {
        updateLaborTaskList?.(
          data.map(i => {
            const { title, children, ...rest } = i;
            return rest as TaskItemVo;
          })
        );

        updateVisible(false);
      }
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

  return (
    <>
      <Drawer
        width={'50%'}
        title="Test"
        footer={<Footer />}
        visible={visible}
        closable
        onCancel={() => updateVisible(false)}
      >
        <div
          style={{
            display: step === LaborTaskStep.selectTask ? 'block' : 'none',
          }}
        >
          <TaskTree treeRef={treeRef} />
        </div>

        {step === LaborTaskStep.editLaborHour && selectedTasks.length > 0 && (
          <TaskEditTable
            selectedTasks={selectedTasks}
            tableRef={editTableRef}
            rowRef={editTableRowRef}
          />
        )}
      </Drawer>
    </>
  );
};

export default TaskDrawer;
