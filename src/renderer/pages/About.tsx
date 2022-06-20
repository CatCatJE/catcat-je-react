import { Link } from '@chakra-ui/react';
import styles from '../styles/about.module.scss';
import pack from '../../../package.json';

const About = () => {
  return (
    <>
      <div className={styles.version}>
        <div className={styles.title}>CatCatDM</div>
        <div className={styles.items}>
          <div className={styles.item}>
            <div className={styles.name}>App:</div>
            <div className={styles.value}>{pack.name}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>Author:</div>
            <div className={styles.value}>{pack.author}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>Version:</div>
            <div className={styles.value}>{pack.version}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.name}>GitHub地址:</div>
            <div className={styles.value && styles.title}>
              <Link
                target="_blank"
                href="https://github.com/kokolokksk/catcat-dm-react"
                rel="noreferrer"
              >
                -{'>'}CatCatDm{'<'}-
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
