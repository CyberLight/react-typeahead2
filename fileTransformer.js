import path from 'path';

export default {
  process(src, filename, config, options) {
    return JSON.stringify(path.basename(filename));
  },
};
