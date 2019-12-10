const router = require('koa-router')();
const Bull = require('bull');
const myFirstQueue = new Bull('my-first-queue');
router.delay = async (interval) => {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
};

myFirstQueue.process( async (job) => {
  for(let i = 0; i < 10; i++){
    await router.delay(1000);
    console.log(i + JSON.stringify(job));
  }
  return {ret:"ret"};
});

// Define a local completed event
myFirstQueue.on('completed', (job, result) => {
  console.log(`Job completed with result ${JSON.stringify(result)}`);
  job.remove();
});

router.get('/', async (ctx, next) => {
  const job = await myFirstQueue.add({
    foo: 'bar'
  });
  await ctx.render('index', {
    title: JSON.stringify(job)
  })
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
