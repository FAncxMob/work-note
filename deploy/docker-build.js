/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const Docker = require('dockerode');
require('colors');

const appName = require('../package.json').name;
const tagName = require('../package.json').version;

const devRepo = 'bs-devops:5000';
// const devRepo = 'bysun-sit:5000';
const prdRepo = 'bysun:5000';

const dockerode = new Docker({
  host: 'http://bs-devops',
  port: 2375,
});
const isStream = true;

const imageName = `${appName}:${tagName}`;

async function build() {
  console.log(`制作镜像: ${devRepo}/${imageName}`.green);
  let stream = await dockerode.buildImage(
    {
      context: __dirname,
      src: ['Dockerfile', '../dist', '../app'],
    },
    { t: `${devRepo}/${imageName}`, nocache: true },
  );
  if (isStream) {
    stream.pipe(process.stdout);
  }
  await new Promise((resolve, reject) => {
    dockerode.modem.followProgress(stream, (err, res) => (err ? reject(err) : resolve(res)));
  });

  console.log(`制作镜像完成， 开始推送镜像`.green);
  const image = dockerode.getImage(`${devRepo}/${imageName}`);
  stream = await image.push({ stream: !!isStream, authconfig: { key: 'EOF' } });
  if (isStream) {
    stream.pipe(process.stdout);
    await new Promise((resolve, reject) => {
      dockerode.modem.followProgress(stream, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }
  console.log(`镜像推送完成: ${devRepo}/${imageName}`.green);
}

async function push() {
  console.log(`镜像Tag`.green);
  let image = dockerode.getImage(`${devRepo}/${imageName}`);
  await image.tag({ tag: tagName, repo: `${prdRepo}/${appName}` });
  console.log(`镜像Tag完成`.green);
  image = dockerode.getImage(`${prdRepo}/${imageName}`);
  const stream = await image.push({ stream: !!isStream, authconfig: { key: 'EOF' } });
  if (isStream) {
    stream.pipe(process.stdout);
    await new Promise((resolve, reject) => {
      dockerode.modem.followProgress(stream, (err, res) => (err ? reject(err) : resolve(res)));
    });
  }
  console.log(`镜像推送完成: ${prdRepo}/${imageName}`.green);
}

if (process.env.PUSH === '1') {
  push().catch((e) => {
    console.error(`发布正式环境失败: ${prdRepo}/${imageName}`.red, e);
  });
} else {
  build().catch((e) => {
    console.error(`发布测试环境失败: ${devRepo}/${imageName}`.red, e);
  });
}
