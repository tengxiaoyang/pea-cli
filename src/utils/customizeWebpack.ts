import { join } from 'path'
import { Configuration } from 'webpack'

import { webpackConfigPath, srcDir } from './paths'
import { override } from './webpackOverride'
import { alias } from './overrideAlias'
import { overrideWebpackExclude } from './overrideWebpackExclude'
import { getPeaConfig } from './getPeaConfig'
import WebpackBar from 'webpackbar'

function resolve(path: string) {
  return join(srcDir, path)
}

export const customizeWebpack = () => {
  const webpackConfig = require(webpackConfigPath)
  require.cache[require.resolve(webpackConfigPath)].exports = (env: string) => {
    const config: Configuration = webpackConfig(env)

    if (config.plugins) {
      config.plugins.push(new WebpackBar())
    }

    let newConfig = override(config, env).pipe(
      overrideWebpackExclude(),
      alias({
        '@utils': resolve('utils/'),
        '@common': resolve('common/'),
        '@config': resolve('config/'),
        '@services': resolve('services/'),
        '@stores': resolve('stores/'),
        '@components': resolve('components/'),
        '@layouts': resolve('layouts/'),
        '@pages': resolve('pages/'),
        '@modals': resolve('modals/'),
        '@drawers': resolve('drawers/'),
        '@hooks': resolve('hooks/'),
        '@dto': resolve('dto/'),
        '@bo': resolve('bo/'),
        '@do': resolve('do/'),
        '@constants': resolve('constants/'),
        '@images': resolve('images/'),
        '@css': resolve('css/'),
        '@stylesheets': resolve('/stylesheets'),
        '@fonts': resolve('fonts/'),
        '@locales': resolve('locales/'),
        '@interfaces': resolve('interfaces/'),
        '@typings': resolve('typings/'),
      }),
    )

    const peaConfig = getPeaConfig()

    // handle config.plugins
    if (peaConfig && peaConfig.plugins) {
      for (const plugin of peaConfig.plugins) {
        if (plugin.webpack) {
          newConfig = plugin.webpack(newConfig, env)
        }
      }
    }

    // handle config.webpack
    if (peaConfig && peaConfig.webpack) {
      return peaConfig.webpack(newConfig, env)
    }
    return newConfig
  }
}