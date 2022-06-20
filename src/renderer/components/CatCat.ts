import axios from 'axios';

const catConfigItem = [
  { name: 'roomid', type: 'number' },
  { name: 'clientId', type: 'string' },
  { name: 'ttsDanmu', type: 'boolean' },
  { name: 'ttsGift', type: 'boolean' },
  { name: 'ttsKey', type: 'string' },
  { name: 'waveD', type: 'boolean' },
  { name: 'alwaysOnTop', type: 'boolean' },
  { name: 'catdb', type: 'boolean' },
  { name: 'dmTs', type: 'string' },
  { name: 'bgc', type: 'string' },
  { name: 'btc', type: 'string' },
  { name: 'bbc', type: 'string' },
  { name: 'dmc', type: 'string' },
  { name: 'dmf', type: 'string' },
  { name: 'voice', type: 'string' },
  { name: 'SESSDATA', type: 'string' },
  { name: 'csrf', type: 'string' },
  { name: 'v1', type: 'string' },
  { name: 'v2', type: 'string' },
  { name: 'fansDisplay', type: 'boolean' },
  { name: 'darkMode', type: 'boolean' },
  { name: 'proxyApi', type: 'boolean' },
];

const getNewSessionId = () => {
  let index = 0;
  const charArray = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    '1',
    '2',
    '9',
  ];
  let stringBuilder = '';
  while (index < 10) {
    const randomIndex = Math.floor(Math.random() * 10) + 7;
    stringBuilder += charArray[randomIndex];
    // eslint-disable-next-line no-plusplus
    index++;
  }
  return stringBuilder;
};

export { catConfigItem, getNewSessionId };
