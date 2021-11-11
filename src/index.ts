// @ts-ignore
import envinfo from 'envinfo';
// @ts-ignore
import confirm from '@inquirer/confirm';
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
import path from 'path';
import fs from 'fs';


type Version = String | number
enum VersionIs {
	LessThan = -1,
	EqualTo = 0,
	GreaterThan = 1,
}
function versionCompare(
	current: Version,
	other: Version
): VersionIs {
	const cp = String(current).split('.')
	const op = String(other).split('.')
	for (let depth = 0; depth < Math.min(cp.length, op.length); depth++) {
		const cn = Number(cp[depth])
		const on = Number(op[depth])
		if (cn > on) return VersionIs.GreaterThan
		if (on > cn) return VersionIs.LessThan
		if (!isNaN(cn) && isNaN(on)) return VersionIs.GreaterThan
		if (isNaN(cn) && !isNaN(on)) return VersionIs.LessThan
	}
	return VersionIs.EqualTo
}


type ShouldUse = {
  name: String;
  minVersion?: string;
  maxVersion?: string;
  link?: string;
};

type ShouldNotUse = {
  name: string;
  suggestion: string;
  link?: string;
}

const shouldNotUse: ShouldNotUse[] = [
  { name: 'react-native-svg', suggestion: '请使用 @xmly/react-native-svg，P90减少600毫秒，且接口不变', link: "http://npm.ximalaya.com/package/@xmly/react-native-svg"},
  { name: 'react-native-shadow-2', suggestion: '请使用 @xmly/react-native-shadow-2，P90减少600毫秒，且接口不变', link: "http://npm.ximalaya.com/package/@xmly/react-native-shadow-2" },
  { name: 'react-native-shadow', suggestion: '请使用 @xmly/react-native-shadow-2，P90减少600毫秒', link: "http://npm.ximalaya.com/package/@xmly/react-native-shadow-2" }
];
const shouldUse: ShouldUse[] = [
  {
    name: 'react',
    minVersion: '16.13.1',
    maxVersion: '16.13.1'
  },
  {
    name: 'react-native@react-native-community/async-storage',
    minVersion: '1.12.0',
    maxVersion: '1.12.0'
  },
  {
    name: '@react-native-community/viewpager',
    minVersion: '3.3.0',
    maxVersion: '3.3.0'
  },
  {
    name: '@react-native-community/netinfo',
    minVersion: '5.9.6',
    maxVersion: '5.9.6'
  },
  {
    name: 'react-native-reanimated',
    minVersion: '1.12.0',
    maxVersion: '1.12.0'
  },
  {
    name: 'react-native-linear-gradient',
    minVersion: '2.5.6',
    maxVersion: '2.5.6'
  },
  {
    name: '@react-native-community/blur',
    minVersion: '3.3.1',
    maxVersion: '3.3.1'
  },
  {
    name: 'react-native-screens',
    minVersion: '2.10.1',
    maxVersion: '2.10.1'
  },
  {
    name: '@react-native-community/masked-view',
    minVersion: '0.1.10',
    maxVersion: '0.1.10'
  },
  {
    name: '@react-navigation/native',
    minVersion: '5.7.3',
    maxVersion: '5.7.3'
  },
  {
    name: '@react-navigation/stack',
    minVersion: '5.9.0',
    maxVersion: '5.9.0'
  },
  {
    name: 'react-native-safe-area-context',
    minVersion: '3.1.7',
    maxVersion: '3.1.7'
  },{
    name: 'react-native-webview',
    minVersion: '10.8.2',
    maxVersion: '10.8.2'
  },{
    name: 'react-native-gesture-handler',
    minVersion: '1.7.0',
    maxVersion: '1.7.0'
  },{
    name: 'react-native-permissions',
    minVersion: '2.2.0',
    maxVersion: '2.2.0'
  },{
    name: '@react-native-community/picker',
    minVersion: '1.7.1',
    maxVersion: '1.7.1'
  },{
    name: '@react-native-community/push-notification-ios',
    minVersion: '1.5.0',
    maxVersion: '1.5.0'
  },{
    name: '@react-native-community/cameraroll',
    minVersion: '4.0.0',
    maxVersion: '4.0.0'
  },
  {
    name: '@react-native-community/clipboard',
    minVersion: '1.2.3',
    maxVersion: '1.2.3'
  },
  {
    name: '@xmly/sentry-react-native',
    minVersion: '3.0.2',
  }
];

const pkgCheck = async () => {
  // 检查自身版本
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 3600 * 24 * 3,
    shouldNotifyInNpmScript: true
  });
  notifier.notify({message: 'RN 版本检测已经升级{currentVersion} -> {latestVersion} \n 包含更全面的版本校验，请运行 yarn upgrade @xmly/react-native-package-validator@^{latestVersion}'});

  let checkRes = true;
  // resolutions 检查
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    let resolutionsCheck = true;
    const pkgJson = require(pkgJsonPath);
    if (pkgJson['resolutions'] === undefined) {
      resolutionsCheck = false;
      checkRes = false;
    }
    if (resolutionsCheck && pkgJson['resolutions']['react-native'] === undefined) {
      resolutionsCheck = false;
      checkRes = false;
    }
    if (resolutionsCheck && pkgJson['resolutions']['react-native'] !== pkgJson['dependencies']['react-native']) {
      resolutionsCheck = false;
      checkRes = false;
    }

    console.error(`😱😱😱 package.json resolutions.react-native 配置错误 \n 请在 resolutions 中配置 react-native，且与dependencies.react-native 保持一致`);
  }

  // 安装了有问题的包
  let shouldNotUseRes = await envinfo.run({
    npmPackages: shouldNotUse.map((check) => check.name)
  },{
    json: true, showNotFound: true
  });
  shouldNotUseRes = JSON.parse(shouldNotUseRes);
  shouldNotUse.forEach((check) => {
    if (shouldNotUseRes.npmPackages[check.name] !== 'Not Found') {
      console.error(`😱😱😱 请不要使用 ${check.name}, ${check.suggestion}, 文档：${check.link}`);
      checkRes = false;
      return;
    }
  });

  // 使用了错误的版本
  let shouldUseRes = await envinfo.run({
    npmPackages: shouldUse.map((check) => check.name)
  },{
    json: true, showNotFound: true
  });
  shouldUseRes = JSON.parse(shouldUseRes);
  shouldUse.forEach((check) => {
    if (shouldUseRes.npmPackages[check.name] !== 'Not Found') {
      const version = shouldUseRes.npmPackages[check.name]['installed'];
      if ((check.minVersion && versionCompare(version, check.minVersion) === VersionIs.LessThan) ||
       (check.maxVersion && versionCompare(version, check.maxVersion) === VersionIs.GreaterThan)) {
        console.error(`😱😱😱 您使用了错误的版本 ${check.name}@${version}, minVersion: ${check.minVersion}, maxVersion: ${check.maxVersion}`);
        checkRes = false;
        return;
       }
    }
  });
  if (!checkRes) {
    const ans = await confirm({
      message: '😱😱😱 您的依赖包版本不符合发布要求，可能导致性能问题或者无法在线上环境运行，是否仍要继续?',
    });

    if (!ans) {
      process.exit(0);
    }
  }

  return checkRes;
}

export default pkgCheck;