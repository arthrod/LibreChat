import { atom, selector } from 'recoil';
import { EModelEndpoint } from 'librechat-data-provider';
import type { TEndpointsConfig } from 'librechat-data-provider';

const defaultConfig: TEndpointsConfig = {
  cicero: {
    iconURL: './client/public/favicon.ico',
    order: -1,
    userProvide: false,
    modelDisplayLabel: 'Cicero',
    version: '1',
    name: 'cicero',
  },
  azureOpenAI: null,
  azureAssistants: null,
  assistants: null,
  agents: null,
  openAI: null,
  bingAI: null,
  chatGPTBrowser: null,
  gptPlugins: null,
  google: null,
  anthropic: null,
  custom: null,
  bedrock: null,
};

const endpointsConfig = atom<TEndpointsConfig>({
  key: 'endpointsConfig',
  default: defaultConfig,
});

const endpointsQueryEnabled = atom<boolean>({
  key: 'endpointsQueryEnabled',
  default: true,
});

const plugins = selector({
  key: 'plugins',
  get: ({ get }) => {
    const config = get(endpointsConfig) || {};
    return config?.gptPlugins?.plugins || {};
  },
});

const endpointsFilter = selector({
  key: 'endpointsFilter',
  get: ({ get }) => {
    const config = get(endpointsConfig) || {};

    const filter = {};
    for (const key of Object.keys(config)) {
      filter[key] = !!config[key];
    }
    return filter;
  },
});

export default {
  plugins,
  endpointsConfig,
  endpointsFilter,
  defaultConfig,
  endpointsQueryEnabled,
};
