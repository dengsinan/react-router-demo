import { createContext } from 'react';

export type LaborCtx = {
  laborTaskList?: TaskItemVo[];
  updateLaborTaskList?: (laborTaskList: TaskItemVo[]) => void;
};

export const LaborContext = createContext<LaborCtx>({});

/**
 * 工时详情
 */
export interface LaborDetailVo {
  /** 填报周期开始时间 ：yyyy-MM-dd */
  beginTime?: string;
  /** 填报周期结束时间：yyyy-MM-dd */
  endTime?: string;
  /** 工时id */
  id?: number;
  /** 填报详情列表 */
  laborDetailList?: LaborDetailListItemVo[];
  /** 审批状态 1待提交 2审批中 3通过 4驳回  */
  status?: number;
  /** 提交审批时间 */
  submitTime?: string;
  /** 填报人id */
  userId?: string;
}

/**
 * 工时详情元素
 */
export interface LaborDetailListItemVo {
  /** 工时详情id */
  id?: number;
  /** 提交审批时间 */
  laborTime?: string;
  /** 请假时间 */
  leaveDuration?: string;
  /** 下班打卡时间 */
  offDutyTime?: string;
  /** 上班打卡时间 */
  onDutyTime?: string;
  /** 外出时间 */
  outWorkDuration?: string;
  /** 任务列表 */
  taskItemVoList?: TaskItemVo[];
  /** 当天总工时 单位h */
  totalConsumed?: number;
  /** 出差时间 */
  tripOnBizDuration?: string;
  /** 工作日 */
  workDate?: string;
  /** 加班时间 */
  workOverDuration?: string;
}

/**
 * 任务列表
 */
export interface TaskItemVo {
  /** 工时消耗 */
  consumed?: number;
  /** 父任务id */
  parent?: number;
  /** 项目id */
  projectId?: number;
  /** 项目名称 */
  projectName?: string;
  /** 需求id */
  storyId?: number;
  /** 任务id */
  taskId?: number;
  taskName?: string;
  ztTaskEstimateId?: number;
}

/**
 * 任务列表
 */
export interface UserTaskVo {
  /** 分配人员 */
  assignedTo?: string;
  /** 消耗工时 */
  consumed?: number;
  /** 估算工时 */
  estimate?: number;
  /** 执行id */
  executionId?: number;
  /** 执行名称 */
  executionName?: string;
  /** 剩余工时 */
  left?: number;
  /** 父任务id */
  parent?: number;
  /** 项目id */
  projectId?: number;
  /** 项目名称 */
  projectName?: string;
  /** 状态 */
  status?: string;
  /** 研发需求id */
  storyId?: number;
  /** 研发需求名称 */
  storyName?: string;
  /** 任务id */
  taskId?: number;
  /** 任务名称 */
  taskName?: string;
  /** 任务类型：1 父任务 0 子任务 */
  type?: number;
  userTaskVoList?: UserTaskVo[];
}

/**
 * 研发需求列表
 */
export interface StoryVo {
  /** 研发需求id */
  storyId?: number;
  /** 研发需求名称 */
  storyName?: string;
  /** 任务id */
  userTaskVoList?: UserTaskVo[];
}

/**
 * 执行列表
 */
export interface ExecutionVo {
  /** 执行id */
  executionId?: number;
  /** 执行名称 */
  executionName?: string;
  /** 研发需求列表 */
  storyVoList?: StoryVo[];
  /** 任务列表 */
  userTaskVoList?: UserTaskVo[];
}

export interface TaskSelectVo {
  /** 执行列表 */
  executionVoList?: ExecutionVo[];
  /** 项目id */
  projectId?: number;
  /** 项目名称 */
  projectName?: string;
  /** 研发需求列表 */
  storyVoList?: StoryVo[];
  /** 任务列表 */
  userTaskVoList?: UserTaskVo[];
}

export type TaskNode = Partial<
  TaskSelectVo & ExecutionVo & StoryVo & UserTaskVo
>;
