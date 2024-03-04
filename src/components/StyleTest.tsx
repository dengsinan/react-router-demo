import { Button } from '@arco-design/web-react';
import React from 'react';

type StyleTestProps = {};

const StyleTest: React.FC<StyleTestProps> = props => {
  const {} = props;

  return (
    <>
      <Button type="primary">Arco button</Button>
    </>
  );
};

StyleTest.displayName = 'StyleTest';

export default StyleTest;
