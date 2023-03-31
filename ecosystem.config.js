module.exports = {
  apps: [
    {
      name: 'staysafe',
      script: './server.ts',
      interpreter: 'deno',
      interpreterArgs: 'run --allow-net server.ts --host=127.0.0.1 --port=1271'
    }
  ]
};
