const proxy = require('express-http-proxy');
const app = require('express')();
const cors = require('cors');
const helmet = require('helmet');

function proxyOpenAIHost() {
  return 'https://api.openai.com';
}
app.use(helmet());
app.use(cors());
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
console.log('server open');
