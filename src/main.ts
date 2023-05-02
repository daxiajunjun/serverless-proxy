const proxy = require('express-http-proxy');
const app = require('express')();

function proxyOpenAIHost() {
  return 'https://api.openai.com';
}

app.use(
  '/proxy_openai/chat/completions',
  proxy(proxyOpenAIHost, {
    proxyReqPathResolver: function () {
      return '/v1/chat/completions';
    },
  }),
);

app.use('/', (req, res) => {
  res.send('hello world');
});

app.listen(3005);
