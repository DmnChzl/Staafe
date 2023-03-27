module.exports = {
  apps: [
    {
      name: 'staafe',
      script: './server.ts',
      interpreter: 'deno',
      interpreterArgs: 'run --import-map=import_map.json --allow-net server.ts --host=127.0.0.1 --port=1271 --cors'
    }
  ]
};
