import path from 'path';
import fs from 'fs';

const ERR_MSG = `😱😱😱 package.json resolutions.react-native 配置错误 \n 请在 resolutions 中配置 react-native，且与dependencies.react-native 保持一致`;

// resolutions 检查
export default function resolutionsCheck() {
  const pkgJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    let resolutionsCheck = true;
    const pkgJson = require(pkgJsonPath);
    if (pkgJson['resolutions'] === undefined) {
      resolutionsCheck = false;
      return [ERR_MSG];
    }
    if (resolutionsCheck && pkgJson['resolutions']['react-native'] === undefined) {
      resolutionsCheck = false;
      return [ERR_MSG];
    }
    if (resolutionsCheck && pkgJson['resolutions']['react-native'] !== pkgJson['dependencies']['react-native']) {
      resolutionsCheck = false;
      return [ERR_MSG];
    }

    return [];
  }

  return [ERR_MSG];
}