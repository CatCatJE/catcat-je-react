import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createStandaloneToast } from '@chakra-ui/toast';
import { stringify } from 'querystring';
import styles from '../styles/paper.module.scss';
import '../styles/paper.css';
import { catConfigItem, getNewSessionId } from '../components/CatCat';

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
  comeInLastMinute: number;
  count: number;
  muaConfig: MuaConfig;
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

  constructor(props) {
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
    this.state = {
      muaConfig,
    };
    console.info(`muacofig加载完成`);
    this.load(muaConfig);
  }

  componentDidMount() {
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

  render() {
    return (
      <div className={styles.paper}>
        <div className={styles.top} />
        <div className={styles.leftBorder} />
        <div className={styles.container}>
          <div className={styles.papers}>
            <div className={styles.title}>
              <h1>风与约定</h1>
            </div>
            <div className={styles.info}>
              <i>专辑：风与约定</i>&nbsp;&nbsp;
              <i>作词：叶尖尖</i>&nbsp;&nbsp;
              <i>作曲：永夜蛰居</i>
              <br />
              <i>编曲：永夜蛰居</i>&nbsp;&nbsp;
              <i>歌手：多多poi / 宴宁</i>&nbsp;&nbsp;
              <i>附注：原神</i>
            </div>
            <div className={styles.score}>
              <span>#2#2&nbsp;&nbsp;#2(#6)&nbsp;&nbsp;(#6#555)</span>
              <br />
              <span>#2#2&nbsp;&nbsp;#2(#6)&nbsp;&nbsp;#24#22#2</span>
              <br />
              <span>#245#55&nbsp;&nbsp;#2(#6)&nbsp;&nbsp;#24#22#2</span>
              <br />
              <span>#245#5#6#254&nbsp;&nbsp;(#6)4#2</span>
              <br />
              <span>#2#2&nbsp;&nbsp;#2(#6)&nbsp;&nbsp;(#6#555)</span>
              <br />
              <span>22#2#2(#6)#2&nbsp;&nbsp;2#2#654#2</span>
              <br />
              <span>2#2#2#65&nbsp;&nbsp;(#6)&nbsp;&nbsp;#2#24#2</span>
              <br />
              <span>5#5544#254&nbsp;&nbsp;#22#2&nbsp;&nbsp;(#6)4#22#2</span>
              <br />
              <span>12#2&nbsp;&nbsp;44#2&nbsp;&nbsp;44#2&nbsp;&nbsp;54#2</span>
              <br />
              <span>(#6)#62#2&nbsp;&nbsp;(#6)#62#2</span>
              <br />
              <span>#245#5#6#254&nbsp;&nbsp;(#6)4#2</span>
              <br />
              <span>#2#2&nbsp;&nbsp;#2(#6)&nbsp;&nbsp;(#6#555)</span>
              <br />
              <span>22#2#2(#6)#2&nbsp;&nbsp;2#2#654#2</span>
              <br />
              <span>2#2#2#65&nbsp;&nbsp;(#6)&nbsp;&nbsp;#2#24#2</span>
            </div>
            <div className={styles.footer}>
              <i>记谱：列克星敦</i>
            </div>
          </div>
        </div>
        <div className={styles.rightBorder} />
      </div>
    );
  }
}

export default JEWindow;