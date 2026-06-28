const { spawn } = require('node:child_process');
const { networkInterfaces } = require('node:os');

process.env.APP_VARIANT = process.env.APP_VARIANT || 'development';

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const passthroughArgs = process.argv.slice(2);
const hasHostFlag = passthroughArgs.some(
  (arg) =>
    arg === '--host' ||
    arg.startsWith('--host=') ||
    arg === '--lan' ||
    arg === '--tunnel' ||
    arg === '--localhost'
);

const getRequestedHost = () => {
  for (let index = 0; index < passthroughArgs.length; index += 1) {
    const arg = passthroughArgs[index];
    if (arg === '--lan') return 'lan';
    if (arg === '--tunnel') return 'tunnel';
    if (arg === '--localhost') return 'localhost';
    if (arg === '--host') return passthroughArgs[index + 1];
    if (arg.startsWith('--host=')) return arg.slice('--host='.length);
  }
  return 'lan';
};

const getRequestedPort = () => {
  for (let index = 0; index < passthroughArgs.length; index += 1) {
    const arg = passthroughArgs[index];
    if (arg === '--port' || arg === '-p') return passthroughArgs[index + 1];
    if (arg.startsWith('--port=')) return arg.slice('--port='.length);
    if (arg.startsWith('-p=')) return arg.slice('-p='.length);
  }
  return '8081';
};

const getLanIpAddress = () => {
  const candidates = Object.entries(networkInterfaces()).flatMap(([name, addresses = []]) =>
    addresses
      .filter(
        (address) =>
          address.family === 'IPv4' && !address.internal && !address.address.startsWith('169.254.')
      )
      .map((address) => ({ name, address: address.address }))
  );

  const score = (candidate) => {
    const name = candidate.name.toLowerCase();
    const virtualPenalty = /default switch|docker|vethernet|virtualbox|vmware|wsl/.test(name)
      ? 10
      : 0;
    if (candidate.address.startsWith('192.168.')) return virtualPenalty;
    if (candidate.address.startsWith('10.')) return virtualPenalty + 1;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(candidate.address)) return virtualPenalty + 2;
    return virtualPenalty + 3;
  };

  return candidates.sort((left, right) => score(left) - score(right))[0]?.address;
};

const requestedHost = getRequestedHost();
const requestedPort = getRequestedPort();
const lanIpAddress = requestedHost === 'lan' ? getLanIpAddress() : undefined;
if (
  requestedHost === 'lan' &&
  lanIpAddress &&
  !process.env.REACT_NATIVE_PACKAGER_HOSTNAME &&
  !process.env.EXPO_PACKAGER_PROXY_URL
) {
  process.env.REACT_NATIVE_PACKAGER_HOSTNAME = lanIpAddress;
}
if (requestedHost === 'lan' && lanIpAddress && !process.env.EXPO_PACKAGER_PROXY_URL) {
  process.env.EXPO_PACKAGER_PROXY_URL = `http://${lanIpAddress}:${requestedPort}`;
}

const args = [
  'expo',
  'start',
  '--dev-client',
  ...(hasHostFlag ? [] : ['--host', 'lan']),
  ...passthroughArgs,
];

console.log('[EXPO_DEV_CLIENT] Starting Expo development client server', {
  appVariant: process.env.APP_VARIANT,
  host: requestedHost,
  packagerHost: process.env.REACT_NATIVE_PACKAGER_HOSTNAME || null,
  proxyUrl: process.env.EXPO_PACKAGER_PROXY_URL || null,
  args,
});

const child = spawn(command, args, {
  env: process.env,
  shell: process.platform === 'win32',
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
