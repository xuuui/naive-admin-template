import { runBuildGlobEnvConfig } from './buildConf'
import colors from 'picocolors'
import pkg from '../../package.json'

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)
    if (!argvList.includes('disabled-config')) {
      runBuildGlobEnvConfig()
    }
    console.log(`✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - build successfully!')
  } catch (error) {
    console.log(colors.red('vite build error:\n' + error))
    process.exit(1)
  }
}
runBuild()
