import Vue from 'vue';
import { getConfig, init, SentrySdk } from './sentry.client.shared';

const isBot = /googlebot|bingbot/i;

/** @type {import('@nuxt/types').Plugin} */
export default async function (ctx, inject) {
  if (isBot.test(navigator.userAgent)) {
    return;
  }

  const config = await getConfig(ctx);
  init({ Vue, ...config });
  inject('sentry', SentrySdk);
  ctx.$sentry = SentrySdk;
}
