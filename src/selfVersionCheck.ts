const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

// 检查自身版本
export default async function check() {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 3600 * 24 * 3,
    shouldNotifyInNpmScript: true
  });
  notifier.notify({message: 'RN 版本检测已经升级{currentVersion} -> {latestVersion} \n 包含更全面的版本校验，请配置 package.json: resolutions @xmly/react-native-package-validator@{latestVersion}'});
}