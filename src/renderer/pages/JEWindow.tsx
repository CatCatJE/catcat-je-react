import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createStandaloneToast } from '@chakra-ui/toast';
import { stringify } from 'querystring';
import styles from '../styles/paper.module.scss';
import '../styles/paper.css';
import { catConfigItem, getNewSessionId } from '../components/CatCat';
import issue from './issue.json';
import { Button } from '@chakra-ui/react';

interface MuaConfig {
  roomid: number;
  clientId?: string;
  ttsDanmu?: boolean;
  ttsGift?: boolean;
  ttsKey?: string;
  alwaysOnTop?: boolean;
  catdb?: boolean;
  dmTs?: string;
  SESSDATA?: string;
  csrf?: string;
  v1?: string;
  v2?: string;
  fansDisplay?: string;
  darkMode?: boolean;
  proxyApi?: boolean;
  sessionId?: string;
  started?: boolean;
  count: number;
}

type StateType = {
  controllers: any;
  muaConfig: MuaConfig;
  scoreList: Array<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type PropType = {};

interface JEWindow {
  state: StateType;
  props: PropType;
}
const { toast } = createStandaloneToast();
class JEWindow extends React.Component {
  listHeightRef: any = '';

  initScoreList: Array<any> = [];

  loaded: boolean = false;

  count: number = 0;

  // eslint-disable-next-line global-require
  sdk = require('microsoft-cognitiveservices-speech-sdk');

  speakStatus = false;

  ttsOk = false;

  speechConfig!: {
    speechSynthesisLanguage: string;
    speechSynthesisVoiceName: string;
  };

  constructor(props: {} | Readonly<{}>) {
    const muaConfig: MuaConfig = {
      count: 0,
      roomid: 0,
      clientId: '',
      ttsDanmu: false,
      ttsGift: false,
      ttsKey: '',
      alwaysOnTop: false,
      catdb: false,
      dmTs: '',
      SESSDATA: '',
      csrf: '',
      v1: '',
      v2: '',
      fansDisplay: '',
      darkMode: false,
      proxyApi: false,
      sessionId: getNewSessionId(),
      started: true,
    };
    super(props);
    const arr = catConfigItem.map((item) =>
      window.electron.store.get(item.name)
    );
    arr.map((item: unknown, index: number) => {
      console.info(item);
      muaConfig[catConfigItem[index].name] = item;

      return '';
    });
    console.info(muaConfig);
    issue.score.lines.page[0].map((p) => {
      this.initScoreList.push(p);
      return '';
    });
    this.state = {
      muaConfig,
      scoreList: this.initScoreList,
    };
    console.info(`muacofig加载完成`);
    this.load(muaConfig);
  }

  async componentDidMount() {
    console.info('renderer dw');
    setInterval(() => {
      console.info('try to read');
    }, 2000);
    window.danmuApi.msgTips((_event: any, data: any) => {
      toast({
        title: '提示',
        description: data,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    });
    // eslint-disable-next-line react/no-string-refs
    this.refs.sp_2.style.color = 'red';
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    console.info('componentDidUpdate');
  }

  componentWillUnmount() {}

  load = (muaConfig: MuaConfig) => {
    console.info('load muaconfig');
    console.info(muaConfig);
    window.electron.ipcRenderer.sendMessage('setOnTop:setting', [
      muaConfig.alwaysOnTop,
    ]);
  };

  synthesizeToSpeaker = (text: string) => {
    const player = new this.sdk.SpeakerAudioDestination();
    player.onAudioEnd = function (s: unknown) {
      console.info(s);
    };
    const synthesizer = new this.sdk.SpeechSynthesizer(
      this.speechConfig,
      this.sdk.AudioConfig.fromDefaultSpeakerOutput(player)
    );
    console.info('come in ss');
    console.info(synthesizer);
    try {
      synthesizer.speakTextAsync(
        text,
        (result: any) => {
          this.speakStatus = false;
          synthesizer.close();
          if (result) {
            console.log(JSON.stringify(result));
            this.speakStatus = false;
          }
          // synthesizer.close()
        },
        (error: any) => {
          console.log(error);
          this.speakStatus = false;
          synthesizer.close();
        }
      );
    } catch (e) {
      console.info(e);
      this.speakStatus = false;
    }
  };

  testHid = async function testHid() {
    console.info('click');
    const grantedDevices = await navigator.hid.getDevices();
    let grantedDeviceList = '';
    grantedDevices.forEach((device: { productName: any }) => {
      grantedDeviceList += `<hr>${device.productName}</hr>`;
    });
    console.info(grantedDeviceList);
    const grantedDevices2 = await navigator.hid.requestDevice({
      filters: [],
    });
    grantedDeviceList = '';
    grantedDevices2.forEach((device: { productName: any }) => {
      console.info(device.productName);
    });
  };

  render() {
    const { scoreList } = this.state;
    let sort = 0;
    return (
      <div className={styles.paper}>
        <div className={styles.top} />
        <div className={styles.leftBorder} />
        <div className={styles.container}>
          <div className={styles.papers}>
            <div className={styles.title}>
              <h1>{issue.name}</h1>
            </div>
            <div className={styles.info}>
              <i>专辑：{issue.info.album}</i>&nbsp;&nbsp;
              <i>作词：{issue.info.lyricist}</i>&nbsp;&nbsp;
              <i>作曲：{issue.info.composer}</i>
              <br />
              <i>编曲：{issue.info.arranger}</i>&nbsp;&nbsp;
              <i>歌手：{issue.info.singer}</i>&nbsp;&nbsp;
              <i>附注：{issue.info.notes}</i>
            </div>
            <div className={styles.score}>
              {scoreList.map((s) => {
                const sList = s.split(',');
                const sss = sList.map((ss: string) => {
                  sort += 1;
                  return (
                    <span
                      ref={`sp_${sort}`}
                      id={`sp_${sort}`}
                      className={styles.scoreColorDe}
                    >
                      {ss}
                    </span>
                  );
                });
                const jsx = <div>{sss}</div>;
                return (
                  <>
                    <span>{jsx}</span>
                  </>
                );
              })}
            </div>
            <div className={styles.footer}>
              <i>记谱：{issue.info.notator}</i>
            </div>
          </div>
        </div>
        <div className={styles.rightBorder} />
      </div>
    );
  }
}

export default JEWindow;
