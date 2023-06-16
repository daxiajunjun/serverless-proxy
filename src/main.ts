const proxy = require('express-http-proxy');
const app = require('express')();
const cors = require('cors');
const helmet = require('helmet');

function proxyHost(req) {
  return req.query.host;
}
app.use(helmet());
app.use(cors());
app.use(
  '/proxy_any_host',
  proxy((req) => req.query.host, {
    proxyReqPathResolver: function (req) {
      console.log(req._parsedUrl.path);
      return req._parsedUrl.path.replace(/host=[^&]+&?/, '');
    },
  }),
);

app.use('/', (req, res) => {
  res.send('hello world');
});

app.listen(3005);
console.log('server open');
