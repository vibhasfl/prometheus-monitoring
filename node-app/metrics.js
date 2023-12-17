const express = require('express')
const client = require('prom-client')
const app = express()
const pport = process.env.PPORT

const register = new client.Registry()

register.setDefaultLabels({
  app: 'apollo'
})

const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: [ 'method', 'route', 'status_code' ],
  buckets: [ 0.5, 1, 5, 10, 30, 60 ]
})

register.registerMetric(restResponseTimeHistogram)

// export const databaseResponseTimeHistogram = new client.Histogram({
//   name: "db_response_time_duration_seconds",
//   help: "Database response time in seconds",
//   labelNames: ["operation", "success"],
// });

const startMetricsServer = () => {
  const collectDefaultMetrics = client.collectDefaultMetrics({
    register
    // app: 'node-application-monitoring-app',
    // prefix: 'node_',
    // timeout: 10000,
    // gcDurationBuckets: [ 0.001, 0.01, 0.1, 1, 2, 5 ]
  })

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType)
    res.send(await register.metrics())
  })

  app.listen(process.env.PPORT, () => {
    console.log(`Metrics server started at http://localhost:${pport}`)
  })
}

module.exports = { startMetricsServer, restResponseTimeHistogram }
