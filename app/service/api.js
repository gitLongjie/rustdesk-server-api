// app/service/token.js

'use strict';

const Service = require('egg').Service;
const utility = require('utility');

const AUTH_KEY = '1234567890';

function generate_token(lens) {
  let info = '';
  const pattern = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < lens; ++i) {
    const randomCharIndex = Math.floor(Math.random() * pattern.length);
    const randomChar = pattern[randomCharIndex];
    info = info + randomChar;
  }
  return info;
}

class APIService extends Service {
  async register(username, password, auth_key) {
    const { app } = this;

    if (auth_key !== AUTH_KEY) {
      console.log('register failed, auth_key !== AUTH_KEY');
      return { code: -99, msg: 'register failed' };
    }

    try {
      const result = await app.mysql.select('rustdesk_users', {
        where: {
          username,
        },
      });
      if (result.length >= 1) {
        return { code: -99, msg: 'register failed, user is exits' };
      }

      const res = await app.mysql.insert('rustdesk_users', { username, password: utility.md5(password + 'brige'), create_time: app.mysql.literals.now });
      return { code: 0, msg: 'register success' };
    } catch (error) {
      console.log(error);
    }
    return { code: -99, msg: 'register failed' };
  }

  async login(username, password, id, uuid) {
    const { app } = this;

    try {
      const user_query = {
        where: {
          username,
          password: utility.md5(password + 'brige'),
        },
      };
      const result = await app.mysql.select('rustdesk_users', user_query);
      if (result.length !== 1) {
        return { error: 'username or password error' };
      }

      // 删除旧token 防止重复登录导致的登录失败
      await app.mysql.delete('rustdesk_token', { username, id, uuid });
      const token = generate_token(16);
      const uid = result[0].id;
      await app.mysql.insert('rustdesk_token', { username, uid, id, uuid, access_token: token });
      return {
        type: 'access_token',
        access_token: token,
        user: { name: username },
      };
    } catch (error) {
      console.log(error);
    }
    return { error: 'login failed' };
  }

  async logout(id, uuid) {
    const { app } = this;

    try {
      const result = await app.mysql.delete('rustdesk_token', { id, uuid });
      if (result) {
        return { code: 0, data: 'logout success' };
      }
      return { code: -1, data: 'logout failed' };
    } catch (error) {
      console.log(error);
    }
    return { code: -1, data: 'logout failed' };
  }

  async ab(token, tags, peers) {
    const { app } = this;

    try {
      const query = {
        where: {
          access_token: token,
        },
      };
      const result = await app.mysql.select('rustdesk_token', query);
      if (result.length <= 0) {
        return { code: -1, data: 'wrong credentials', msg: 'token is valid' };
      }
      await app.mysql.delete('rustdesk_tags', { uid: result[0].uid });
      for (let i = 0; i < tags.length; ++i) {
        const tag = tags[i];
        await app.mysql.insert('rustdesk_tags', { uid: result[0].uid, tag });
      }

      await app.mysql.delete('rustdesk_peers', { uid: result[0].uid });
      for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        await app.mysql.insert('rustdesk_peers', { uid: result[0].uid, id: peer.id, username: peer.username,
          hostname: peer.hostname, alias: peer.alias, platform: peer.platform, tags: JSON.stringify(peer.tags) });
      }

      return { code: 0, data: 'success' };
    } catch (error) {
      console.log(error);
    }
    return { code: -1, data: 'failed' };
  }

  async ab_get(token) {
    const { app } = this;

    try {
      const query = {
        where: {
          access_token: token,
        },
      };
      const result = await app.mysql.select('rustdesk_token', query);
      if (result.length <= 0) {
        return { error: 'wrong credentials', msg: 'token is valid' };
      }
      const tags = [];
      const tag_rows = await app.mysql.select('rustdesk_tags', { where: { uid: result[0].uid } });
      for (let row = 0; row < tag_rows.length; ++row) {
        tags.push(tag_rows[row].tag);
      }

      const peers = [];
      const peers_rows = await app.mysql.select('rustdesk_peers', { where: { uid: result[0].uid } });
      for (let i = 0; i < peers_rows.length; ++i) {
        const row = peers_rows[i];
        peers.push({
          id: row.id,
          username: row.username,
          hostname: row.hostname,
          alias: row.alias,
          platform: row.platform,
          tags: JSON.parse(row.tags),
          forceAlwaysRelay: row.forceAlwaysRelay,
          rdpPort: row.rdpPort,
          rdpUsername: row.rdpUsername,
        });
      }

      return { data: JSON.stringify({ tags, peers }) };
    } catch (error) {
      console.log(error);
    }
    return { code: -1, data: 'logout failed' };
  }
}

module.exports = APIService;
