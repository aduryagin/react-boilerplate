import webpack from 'webpack';
import webpackConfig from './webpack.config';

webpack(webpackConfig).run((err, stats) => {
  if (err) {
    return console.error(err);
  }

  console.info(stats.toString(webpackConfig[0].stats));
});
