import { createContext } from 'react';

export const TestContext = createContext<{
  updateExpandValue?: (value: PayloadInfo[]) => void;
}>({});

export type PayloadInfo = {
  school: string;
};
