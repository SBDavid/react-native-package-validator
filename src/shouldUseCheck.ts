// @ts-ignore
import envinfo from 'envinfo';

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
    name: '@babel/core',
    minVersion: '7.11.6',
    maxVersion: '7.11.6'
  },
  {
    name: '@babel/runtime',
    minVersion: '7.11.2',
    maxVersion: '7.11.2'
  },
  {
    name: '@xmly/sentry-react-native',
    minVersion: '3.0.2',
  }
];

// 使用了错误的版本
export default async function shouldUseCheck() {

  const ret: String[] = [];

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
        ret.push(`😱😱😱 您使用了错误的版本 ${check.name}@${version}, minVersion: ${check.minVersion}, maxVersion: ${check.maxVersion}`);
       }
    }
  });

  return ret;
}