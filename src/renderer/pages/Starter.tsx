import { Octokit } from 'octokit';
import React from 'react';
import {
  Button,
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

  q = '';

  sourceList = [
    { owner: 'zytx121', repo: 'je' },
    { owner: 'CatCatJE', repo: 'ffxiv' },
  ];

  owner = this.sourceList[1].owner;

  repo = this.sourceList[1].repo;

  initTotalCount = 0;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      issueList: this.initIssueList,
      current: 1,
      total: 0,
      search: '',
    };
  }

  async componentDidMount() {
    const r = Math.random() * 10;
    this.owner = this.sourceList[r > 5 ? 0 : 1].owner;
    this.repo = this.sourceList[r > 5 ? 0 : 1].repo;
    const gtoken = window.electron.store.get('gtoken');
    const octokit = new Octokit({
      auth: gtoken,
    });
    const repo = await octokit
      .request(`GET /repos/${this.owner}/${this.repo}`, {
        owner: this.owner,
        repo: this.repo,
      })
      .then((res) => {
        return res;
      });

    if (repo.status === 200) {
      console.info(repo.data.open_issues_count);
      this.initTotalCount = repo.data.open_issues_count;
      this.setState({
        total: repo.data.open_issues_count,
      });
    }
    this.getIssuseList(1);
  }

  getIssuseList = async (page: number) => {
    const gtoken = window.electron.store.get('gtoken');
    const octokit = new Octokit({
      auth: gtoken,
    });
    let result;
    console.info(this.q);
    if (this.q !== '') {
      result = await octokit
        .request('GET /search/issues', {
          owner: this.owner,
          repo: this.repo,
          direction: 'ASC',
          per_page: 6,
          state: 'open',
          page,
          q: `is:issue is:open ${this.q} repo:${this.owner}/${this.repo}`,
        })
        .then((res) => {
          return res;
        });
      if (result.status === 200) {
        this.initIssueList = [];
        result.data.items.forEach((item: any) => {
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
          const mapLines = item.body?.split('\n');
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
            } else if (line.startsWith('来源')) {
              issue.info.source = line.replace('来源：', '').trim();
            } else if (line.startsWith('扒谱')) {
              issue.info.notator = line.replace('扒谱：', '').trim();
            } else if (line.startsWith('记谱')) {
              issue.info.notator = line.replace('记谱：', '').trim();
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
          issue.score.lines.page[0] = s?.split('\n').map((line: string) => {
            const tempLine = line;
            return tempLine.trim();
          });
          this.initIssueList.push(issue);
        }, this.initIssueList);
        this.setState({
          issueList: this.initIssueList,
          total: result.data.total_count,
        });
      } else {
        console.log('error');
      }
    } else {
      result = await octokit
        .request(`GET /repos/${this.owner}/${this.repo}/issues`, {
          owner: 'OWNER',
          repo: 'REPO',
          direction: 'ASC',
          per_page: 6,
          state: 'open',
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
          const mapLines = item.body?.split('\n');
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
            } else if (line.startsWith('扒谱')) {
              issue.info.notator = line.replace('扒谱：', '').trim();
            } else if (line.startsWith('记谱')) {
              issue.info.notator = line.replace('记谱：', '').trim();
            } else if (line.startsWith('来源')) {
              issue.info.source = line.replace('来源：', '').trim();
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
          issue.score.lines.page[0] = s?.split('\n').map((line: string) => {
            const tempLine = line;
            return tempLine.trim();
          });
          this.initIssueList.push(issue);
        }, this.initIssueList);
        this.setState({
          issueList: this.initIssueList,
          total: this.initTotalCount,
        });
      } else {
        console.log('error');
      }
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

  doSearch = (q: string) => {
    this.q = q;
    this.getIssuseList(1);
  };

  render() {
    const { issueList, current, total, search } = this.state;
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
                    placeholder="请输入歌曲关键字"
                    color="rgb(182, 133, 73)"
                    borderColor="rgb(182, 133, 73)"
                    focusBorderColor="rgb(182, 133, 73)"
                    value={search}
                    onChange={(e) => {
                      this.setState({
                        search: e.target.value,
                      });
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        this.doSearch(search);
                      }
                    }}
                  />
                  <InputRightElement>
                    <Button onClick={() => this.doSearch(search)}>
                      <SearchIcon color="rgb(182, 133, 73)" />
                    </Button>
                  </InputRightElement>
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
                    defaultPageSize={6}
                    onChange={this.pageChange}
                    current={current}
                    total={total}
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
