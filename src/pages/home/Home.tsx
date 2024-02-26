import React from 'react';

type HomeProps = {};

const Home: React.FC<HomeProps> = props => {
  const {} = props;

  return (
    <>
      <p>Home</p>
    </>
  );
};

Home.displayName = 'Home';

export default Home;
