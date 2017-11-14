import rimraf from 'rimraf';

export default (path, options = {}, callback = () => {}) => rimraf(path, options, callback);
