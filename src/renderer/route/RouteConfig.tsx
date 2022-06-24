import { useLocation } from 'react-router-dom';
import JEWindow from 'renderer/pages/JEWindow';
import Setting from 'renderer/pages/Setting';
import Starter from 'renderer/pages/Starter';

const RouteConfig = (_props: any) => {
  const location = useLocation();
  const { search } = location;

  // 视图配置
  const viewsConfig = (): any => {
    return {
      notFind: <div />,
      jeWindow: <JEWindow />,
      settingWindow: <Setting />,
      starterWindow: <Starter />,
    };
  };

  /**
   * 获取视图
   * @returns
   */
  const selectView = () => {
    console.log(search);
    const name: any = search?.substr(1);
    let view = viewsConfig()[name];
    if (view == null) {
      view = viewsConfig().notFind;
    }
    return view;
  };

  return <div>{selectView()}</div>;
};

export default RouteConfig;
