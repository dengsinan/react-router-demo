export interface Task {
  projectId: number;
  projectName: string;
  executionVoList: ExecutionVoList[];
  storyVoList: StoryVoList[];
  userTaskVoList: UserTaskVoList[];
}

export interface ExecutionVoList {
  executionId: number;
  executionName: string;
  storyVoList: StoryVoList[];
  userTaskVoList: UserTaskVoList[];
}

export interface StoryVoList {
  storyId: number;
  storyName: string;
  userTaskVoList: UserTaskVoList[];
}

export interface UserTaskVoList {
  taskId: number;
  taskName: string;
  type: number;
  parent: number;
  assignedTo: string;
  status: string;
  left: number;
  estimate: number;
  consumed: number;
  userTaskVoList: UserTaskVoList[];
}
