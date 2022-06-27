import { Octokit } from 'octokit';
import React from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
} from '@chakra-ui/react';
import { Issue } from 'renderer/@types/catcat';
import CatCatSign from 'renderer/components/CatCatSign';
import Pagination from 'rc-pagination';
import '../styles/pagination.css';
import SliderNav from 'renderer/components/SliderNav';
import JEScore from 'renderer/components/JEScore';
import { CheckIcon, SearchIcon } from '@chakra-ui/icons';
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
  initIssueList: Array<Issue> = [];

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      issueList: this.initIssueList,
      current: 1,
    };
  }

  async componentDidMount() {
    this.getIssuseList(1);
  }

  getIssuseList = async (page: number) => {
    const gtoken = window.electron.store.get('gtoken');
    const octokit = new Octokit({
      auth: gtoken,
    });
    const result = await octokit
      .request('GET /repos/zytx121/je/issues', {
        owner: 'OWNER',
        repo: 'REPO',
        direction: 'ASC',
        per_page: 6,
        page,
      })
      .then((res) => {
        console.log(res);
        return res;
      });
    console.log(result);
    if (result.status === 200) {
      this.initIssueList = [];
      result.data.forEach((item: any) => {
        const issue: Issue = {
          title: '',
          info: {
            album: '',
            image: undefined,
            lyricist: '',
            composer: '',
            arranger: '',
            singer: '',
            notes: '',
            notator: '',
            source: '',
          },
          score: {
            total: 0,
            lines: {
              page: [['']],
            },
          },
          origin: '',
          id: 0,
        };
        issue.id = item.id;
        issue.title = item.title;
        issue.origin = item.body;
        const mapLines = item.body.split('\n');
        // eslint-disable-next-line array-callback-return
        mapLines.map((line: string) => {
          if (line.startsWith('- 歌手')) {
            issue.info.singer = line.replace('- 歌手：', '').trim();
          } else if (line.startsWith('- 作曲')) {
            issue.info.composer = line.replace('- 作曲：', '').trim();
          } else if (line.startsWith('- 作词')) {
            issue.info.lyricist = line.replace('- 作词：', '').trim();
          } else if (line.startsWith('- 编曲')) {
            issue.info.arranger = line.replace('- 编曲：', '').trim();
          } else if (line.startsWith('- 曲谱')) {
            issue.info.source = line.replace('- 曲谱：', '').trim();
          } else if (line.startsWith('- 注释')) {
            issue.info.notes = line.replace('- 注释：', '').trim();
          } else if (line.startsWith('- 扒谱')) {
            issue.info.notator = line.replace('- 扒谱：', '').trim();
          } else if (line.startsWith('- 专辑')) {
            issue.info.album = line.replace('- 专辑：', '').trim();
          } else if (line.startsWith('![image]')) {
            issue.info.image = line
              .replace('![image]', '')
              .replace('(', '')
              .replace(')', '')
              .trim();
          }
        }, this);
        const s = item.body?.split('```')[1]?.replace('```', '');
        issue.score.total = 1;
        issue.score.lines.page[0] = s.split('\n').map((line: string) => {
          const tempLine = line;
          return tempLine.trim();
        });
        this.initIssueList.push(issue);
      }, this.initIssueList);
      this.setState({
        issueList: this.initIssueList,
      });
    } else {
      console.log('error');
    }
  };

  pageChange = (page: number) => {
    console.log(page);
    this.setState({
      current: page,
    });
    this.getIssuseList(page);
  };

  openDetails = (issue: Issue) => {
    console.log(issue);
    window.electron.ipcRenderer.sendMessage('createWindow', [issue]);
  };

  render() {
    const { issueList, current } = this.state;
    return (
      <div>
        <div className={styles.starter}>
          <div className={styles.topBg}> </div>
          <div className={styles.midContaniner}>
            <div className={styles.leftBg}> </div>
            <div className={styles.displayArea}>
              <div className={styles.leftMenu}>
                <SliderNav />
                <CatCatSign />
              </div>
              <div className={styles.rightContaniner}>
                <InputGroup marginBottom="40px" width="calc(100vw - 260px)">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="rgb(182, 133, 73)" />}
                  />
                  <Input
                    type="text"
                    placeholder="type title"
                    color="rgb(182, 133, 73)"
                    borderColor="rgb(182, 133, 73)"
                    focusBorderColor='rgb(182, 133, 73)'
                  />
                  <InputRightElement children={<CheckIcon color='rgb(182, 133, 73)' />} />
                </InputGroup>
                <SimpleGrid columns={3} spacing={3}>
                  {issueList.map((item: Issue, index: number) => {
                    return (
                      // <div key={item.id}>
                      //   <Button
                      //     aria-hidden
                      //     onClick={() => this.openDetails(item)}
                      //     minWidth="200px"
                      //     marginBottom={1}
                      //   >
                      //     <div className={styles.title}>{item.title}</div>
                      //   </Button>
                      // </div>
                      <JEScore
                        key={item.id}
                        issue={item}
                        onClick={() => this.openDetails(item)}
                      />
                    );
                  }, this)}
                </SimpleGrid>
                <div id="pagination" className={styles.pagination}>
                  <Pagination
                    onChange={this.pageChange}
                    current={current}
                    total={1000}
                  />
                </div>
              </div>
            </div>
            <div className={styles.rightBg}> </div>
          </div>
          <div className={styles.btmBg}> </div>
        </div>
      </div>
    );
  }
}
export default Starter;
// Language: typescript
