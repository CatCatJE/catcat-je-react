import React from 'react';
import CatCatSign from 'renderer/components/CatCatSign';
import styles from '../styles/starter.module.scss';

type StateType = {
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface Starter {
  state: StateType;
  props: PropType;
}

class Starter extends React.Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className={styles.starter}>
          <div className={styles.topBg}> top bg</div>
          <div className={styles.midContaniner}>
            <div className={styles.leftBg}> left bg</div>
            <div className={styles.leftMenu}>Left Menu
              <CatCatSign />
            </div>
            <div className={styles.rightContaniner}>Right Menu</div>
            <div className={styles.rightBg}> right bg</div>
          </div>
          <div className={styles.btmBg}> bottom bg</div>
        </div>
      </div>
    );
  }
}
export default Starter;
// Language: typescript
