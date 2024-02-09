import Vue from 'vue';
import { getConfig, init, SentrySdk } from './sentry.client.shared';
import { isBot } from '../utils';

/** @type {import('@nuxt/types').Plugin} */
export default async function (ctx, inject) {
  if (isBot(navigator.userAgent)) {
    return;
  }

  const config = await getConfig(ctx);
  init({ Vue, ...config });
  inject('sentry', SentrySdk);
  ctx.$sentry = SentrySdk;
}
