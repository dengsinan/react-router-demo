import React from 'react';
import StyleTest from '../../components/StyleTest';
import styles from './home.module.scss';
import Shiki from '../../components/shiki/Shiki';
import ContextDemo from '../../components/ContextDemo/ContextDemo';

type HomeProps = {};

const Home: React.FC<HomeProps> = props => {
  const {} = props;

  return (
    <>
      {/* <p>Home</p>
      <StyleTest />
      <div className={styles.outer}>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
        optio magnam laboriosam eius vero deleniti
        <div className="inner">
          totam consequuntur quis repellat placeat ut dicta dolorum accusamus
          excepturi quaerat commodi, repellendus fugit impedit.
        </div>
      </div>

      <Shiki /> */}
      <ContextDemo />
    </>
  );
};

Home.displayName = 'Home';

export default Home;
