export interface Issue {
  id: number; // issue id
  title: string; // 标题
  info: {
    album: string; // 专辑
    image?: string; // 封面
    lyricist: string; // 作词
    composer: string; // 作曲
    arranger: string; // 编曲
    singer: string; // 歌手
    notes: string; // 备注
    notator: string; // 扒谱
    source: string; // 来源
  };
  score: {
    total: number;
    lines: {
      page: [[string]];
    };
  };
  origin: string; // 原始body
  [propName: string]: any;
}
