import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://ec2-54-146-132-147.compute-1.amazonaws.com:8080',
};
