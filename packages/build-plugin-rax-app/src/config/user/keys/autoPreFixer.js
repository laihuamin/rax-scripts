const { WEB, MINIAPP, WECHAT_MINIPROGRAM } = require('../../../constants');

const webStandardList = [
  WEB,
];

const miniappStandardList = [
  MINIAPP,
  WECHAT_MINIPROGRAM,
];

module.exports = {
  defaultValue: true,
  validation: 'boolean',
  configWebpack: (config, value, context) => {
    setCSSRule(config.module.rule('css').test(/\.css?$/), context, value);
    setCSSRule(config.module.rule('less').test(/\.less?$/), context, value);
  },
};

function setCSSRule(configRule, context, value) {
  const { taskName } = context;
  const isWebStandard = webStandardList.includes(taskName);
  const isMiniAppStandard = miniappStandardList.includes(taskName);
  if (isWebStandard || isMiniAppStandard) {
    // extract css file in web while inlineStyle is disabled
    const postcssConfig = {
      ident: 'postcss',
      plugins: () => {
        const plugins = [
        ];
        if (isWebStandard) {
          plugins.push(require('postcss-plugin-rpx2vw')());
        }
        return plugins;
      },
    };

    configRule
      .oneOf('normal')
      .use('postcss')
      .loader(require.resolve('postcss-loader'))
      .tap(() => postcssConfig);
  }
}