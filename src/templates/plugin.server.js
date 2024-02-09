<% if (options.tracing) { %>
import { getActiveSpan, getDynamicSamplingContextFromSpan, spanToTraceHeader } from '~@sentry/core'
import { dynamicSamplingContextToSentryBaggageHeader } from '~@sentry/utils'
<% } %>

const isBot = /googlebot|bingbot/i;

/** @type {import('@nuxt/types').Plugin} */
export default function (ctx, inject) {
  if (isBot.test(ctx.req.headers['user-agent'].userAgent)) {
    return;
  }
  
  const sentry = process.sentry || null
  if (!sentry) {
    return
  }
  inject('sentry', sentry)
  ctx.$sentry = sentry
  <% if (options.tracing) { %>
  connectBackendTraces(ctx)
  <% } %>
  <% if (options.lazy) { %>
  const sentryReady = () => Promise.resolve(sentry)
  inject('sentryReady', sentryReady)
  ctx.$sentryReady = sentryReady
  <% } %>
}

<% if (options.tracing) { %>
/** @param {import('@nuxt/types').Context} ctx */
function connectBackendTraces (ctx) {
  const { head } = ctx.app
  if (!head || head instanceof Function) {
    console.warn('[@nuxtjs/sentry] can not connect backend and frontend traces because app.head is a function or missing!')
    return
  }
  const span = getActiveSpan()
  if (!span) {
    return
  }
  head.meta = head.meta || []
  head.meta.push({ hid: 'sentry-trace', name: 'sentry-trace', content: spanToTraceHeader(span) })
  const dsc = getDynamicSamplingContextFromSpan(span)
  if (dsc) {
    const baggage = dynamicSamplingContextToSentryBaggageHeader(dsc)
    if (baggage) {
      head.meta.push({ hid: 'sentry-baggage', name: 'baggage', content: baggage })
    }
  }
}
<% } %>
