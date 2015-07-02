import koa from 'koa';
import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = koa();
const router = koaRouter();
const env = process.env.NODE_ENV || 'development';

// Load config for RethinkDB and koa
const config = require(__dirname + "/config.js")

const host = process.env.RETHINKDB_HOST;
if (host) {
  config.rethinkdb.host = host;
  console.log(host);
}
const thinky = require('thinky')(config.rethinkdb);
const r = thinky.r;
const type = thinky.type;

app.use(responseTime());
app.use(logger());
app.use(bodyParser());

// Create the model
var Article = thinky.createModel('articles', {
    id: type.string(),
    title: type.string(),
    content: type.string(),
    createdAt: type.date().default(r.now())
});

Article.ensureIndex("createdAt");

router.get('/articles', function*(next) {
  yield next;
  // try {
  // const result = yield Article.orderBy({index: 'createdAt'}).limit(20).run({useOutdated:true});

  const result = yield r.db('foobar').table('articles').orderBy({index: 'createdAt'}).limit(20).run({useOutdated:true});
  return this.body = result;
  // } catch (error) {
  //   return this.body = error;
  // }
});

router.post('/articles', function*(next){
  yield next;
  var article = new Article(this.request.body);
  const result = yield article.save();
  return this.body = result;
});

// working dash

// router.get('/articles', function*(next) {
//   const result = yield r.db('rethinkbench').table('articles').run();//Article.orderBy({index: "createdAt"});
//   return this.body = result;
// });

// router.post('/articles', function*(next){
//   console.log(this.request.body);
//   const result = yield r.db('rethinkbench').table('articles').insert(this.request.body).run()
//   return this.body = result//result;
// })

app
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Application started on port ${port}`);
if (process.send) {
  process.send('online');
}
