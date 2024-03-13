import { Button, Drawer, Space } from '@arco-design/web-react';
import React, { useContext, useRef } from 'react';
import { Tabs } from '@arco-design/web-react';
import TestEditTable from './TestEditTable';
import { useStep } from './useStep';
import { PayloadInfo, TestContext } from './constants';
const TabPane = Tabs.TabPane;

type TestDrawerProps = {
  visible: boolean;
  updateVisible: (visible: boolean) => void;
};

enum DrawerStep {
  one = 'one',
  two = 'two',
}

const TestDrawer: React.FC<TestDrawerProps> = props => {
  const { visible, updateVisible } = props;

  const testContext = useContext(TestContext);

  const tableDataToSave = useRef<PayloadInfo[]>([]);

  const handleSubmit = () => {
    testContext.updateExpandValue?.([...tableDataToSave.current]);
    updateVisible(false);
  };

  const { step, isFirstStep, isLastStep, handlePrev, handleNext } = useStep(
    [DrawerStep.one, DrawerStep.two],
    handleSubmit
  );

  const Footer = () => {
    return (
      <Space>
        {!isFirstStep && (
          <Button type="default" onClick={handlePrev}>
            上一步
          </Button>
        )}
        <Button type="primary" onClick={handleNext}>
          {isLastStep ? '完成' : '下一步'}
        </Button>
      </Space>
    );
  };

  return (
    <>
      <Drawer width={'50%'} title="Test" footer={<Footer />} visible={visible}>
        <Tabs activeTab={step as string} type="capsule">
          <TabPane key={DrawerStep.one} title="Tab 1" disabled>
            step 1
          </TabPane>

          <TabPane key={DrawerStep.two} title="Tab 2" disabled>
            <TestEditTable
              updateToSave={value => {
                tableDataToSave.current = value;
              }}
            />
          </TabPane>
        </Tabs>
      </Drawer>
    </>
  );
};

TestDrawer.displayName = 'TestDrawer';

export default TestDrawer;
