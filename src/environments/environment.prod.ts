import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://ec2-15-188-147-109.eu-west-3.compute.amazonaws.com:8080',
};
