const { Controller } = require('egg');

class APIController extends Controller {
  async heartbeat() {
    const { ctx } = this;
    const data = {
      modified_at: Date.now(),
    };
    // console.log('heart');
    ctx.body = data;
  }

  async register() {
    const { ctx, service } = this;
    const { username, password, auth_key } = ctx.request.body;
    ctx.body = await service.api.register(username, password, auth_key);
  }

  async login() {
    const { ctx, service } = this;
    console.log(ctx.request.body);
    const { username, password, id, uuid } = ctx.request.body;
    ctx.body = await service.api.login(username, password, id, uuid);
  }

  async logout() {
    const { ctx, service } = this;
    console.log(ctx.request.body);
    const { id, uuid } = ctx.request.body;
    ctx.body = await service.api.logout(id, uuid);
  }

  async Users() {
    const { ctx } = this;
    // console.log('Users', ctx.request);
    ctx.body = { code: 0, data: 'ok' };
  }

  async peers() {
    const { ctx } = this;
    // console.log('peer', ctx.request);
    ctx.body = { code: 0, data: 'ok' };
  }

  async sysinfo() {
    const { ctx } = this;
    // console.log(ctx.request.body);
    ctx.body = { code: 0, data: 'ok' };
  }

  async currentUser() {
    const { ctx } = this;

    // console.log(ctx.request.body);
    ctx.body = 'hi '; // await service.api.logout(id, uuid);
  }

  async ab() {
    const { ctx, service } = this;
    const { authorization } = ctx.request.headers;
    let token = authorization;
    if (token.indexOf('Bearer') >= 0) {
      token = token.replace('Bearer ', '');
    }

    const data = JSON.parse(ctx.request.body.data);
    const { tags, peers } = data;

    ctx.body = await service.api.ab(token, tags, peers);
  }

  async ab_get() {
    const { ctx, service } = this;
    let token = ctx.request.header.authorization;
    if (token.indexOf('Bearer') >= 0) {
      token = token.replace('Bearer ', '');
    }
    ctx.body = await service.api.ab_get(token);
  }
}

module.exports = APIController;
