import path from 'path';

export default {
  process(src, filename) {
    return JSON.stringify(path.basename(filename));
  },
};
