const Package = require('./package');

exports.config = {
  app_name: [Package.name],
  agent_enabled: true,
  high_security: false,
  labels: {
    Type: 'Service',
  },
  logging: {
    level: 'info',
    filepath: 'stdout',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
  distributed_tracing: {
    enabled: true,
  },
  error_collector: {
    enabled: true,
    ignore_status_codes: [404],
  },
  transaction_tracer: {
    enabled: true,
    explain_threshold: 500,
    record_sql: 'obfuscated',
    hide_internals: true,
  },
};
