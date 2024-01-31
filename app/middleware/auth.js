/**
 * @param {Egg.Application} app - egg application
 */
module.exports = () => {
  return function* auth(next) {
    yield next;
    console.log('test', this.path);
  };
};
