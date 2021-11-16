// @ts-ignore
import confirm from '@inquirer/confirm';
import selfVersionCheck from './selfVersionCheck';
import resolutionsCheck from './resolutionsCheck';
import shouldNotUseCheck from './shouldNotUseCheck';
import shouldUseCheck from './shouldUseCheck';

const pkgCheck = async () => {
  
  await selfVersionCheck();

  let checkRes: String[] = [];

  checkRes = checkRes.concat(resolutionsCheck());
  checkRes = checkRes.concat(await shouldNotUseCheck());
  checkRes = checkRes.concat(await shouldUseCheck());


  if (checkRes.length != 0) {
    checkRes.forEach(e => console.error(e));
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

export async function pkgCheckBundle() {
  await selfVersionCheck();
  let checkRes: String[] = [];
  checkRes = checkRes.concat(resolutionsCheck());
  checkRes = checkRes.concat(await shouldNotUseCheck());
  checkRes = checkRes.concat(await shouldUseCheck());
  return checkRes;
}