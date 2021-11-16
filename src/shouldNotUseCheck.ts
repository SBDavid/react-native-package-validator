// @ts-ignore
import envinfo from 'envinfo';

type ShouldNotUse = {
  name: string;
  suggestion: string;
  link?: string;
}

const shouldNotUse: ShouldNotUse[] = [
  { name: 'react-native-svg', suggestion: '请使用 @xmly/react-native-svg，P90减少600毫秒，且接口不变', link: "http://npm.ximalaya.com/package/@xmly/react-native-svg"},
  { name: 'react-native-shadow-2', suggestion: '请使用 @xmly/react-native-shadow-2，P90减少600毫秒，且接口不变', link: "http://npm.ximalaya.com/package/@xmly/react-native-shadow-2" },
  { name: 'react-native-shadow', suggestion: '请使用 @xmly/react-native-shadow-2，P90减少600毫秒，接口少许不同，注意看文档', link: "http://npm.ximalaya.com/package/@xmly/react-native-shadow-2" }
];

// 安装了有问题的包
export default async function shouldNotUseCheck() {

  const ret: String[] = [];

  let shouldNotUseRes = await envinfo.run({
    npmPackages: shouldNotUse.map((check) => check.name)
  },{
    json: true, showNotFound: true
  });
  shouldNotUseRes = JSON.parse(shouldNotUseRes);
  shouldNotUse.forEach((check) => {
    if (shouldNotUseRes.npmPackages[check.name] !== 'Not Found') {
      ret.push(`😱😱😱 请不要使用 ${check.name}, ${check.suggestion}, 文档：${check.link}`);
    }
  });

  return ret;
}