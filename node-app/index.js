const express = require('express')
const { startMetricsServer, restResponseTimeHistogram } = require('./metrics')
const responseTime = require('response-time')

const app = express()
const port = process.env.PORT

const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

app.use(
  responseTime((req, res, time) => {
    if (req?.route?.path) {
      console.log({ method: req.method, route: req.route.path, status_code: res.statusCode, time })
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time
      );
    }
  })
);

app.get('/', (req, res) => {
  console.log('hello')
  return res.send('Hello World!')
})

app.get('/health-check', (req, res) => {
  console.log('health-check')
  return res.send('health-check')
})


app.get('/delay', async (req, res) => {
  await sleep(3000)
  return res.status(200).send('3s delay route')
})

app.get('/delay6', async (req, res) => {
  await sleep(6000)
  return res.status(200).send('6s delay route')
})

app.get('/error', async (req, res) => {
  return res.status(500).send('error route')
})

app.get('/crash', async (req, res) => {
  const mylist = []
  
    mylist.push({
      name: 'server',
      arr: new Array(100000)
    })
    res.status(200).send({ message: 'crash' })
  
})

app.get('/crash2', async (req, res) => {
  const list = [];
setInterval(()=> {
        const record = new MyRecord();
        list.push(record);
},10);
function MyRecord() {
        var x='hii';
        this.name = x.repeat(10000000);
        this.id = x.repeat(10000000);
        this.account = x.repeat(10000000);
}
setInterval(()=> {
        console.log(process.memoryUsage())
},100);

      res.status(200).send({ message: 'crash2' })

})

app.get('*', function (req, res) {
  return res.status(404).send('No route found')
})

app.use((err, req, res, next) => {
  return res.status(500).send('Error')
})

app.listen(port, () => {
  startMetricsServer()
  console.log(`Example app listening on port ${port}`)
})
