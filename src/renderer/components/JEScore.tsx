import { Image, Box } from '@chakra-ui/react';
import { Issue } from 'renderer/@types/catcat';
import styles from '../styles/jescore.module.scss';

const JEScore = (props: { issue: Issue; onClick: () => void }) => {
  const { issue, onClick } = props;
  return (
    <Box
      shadow="md"
      borderWidth="1px"
      borderColor="rgb(182, 133, 73)"
      onClick={onClick}
      width="calc(26vw - 60px)"
      height="calc(26vw - 60px)"
      overflow="hidden"
    >
      <div className={styles.title}>{issue.title}</div>
      <div className={styles.info}>
        <Image
          src={issue.info.image}
          fallbackSrc=""
          height="calc(20vw - 32px)"
          width="calc(26vw - 32px)"
        />
      </div>
    </Box>
  );
};
export default JEScore;
// Language: typescript
