# dai-plugin-portis

A [Dai.js][daijs] plugin for using [portis](portis.io/) in a browser environment.

## NEEDS TO BE TESTED

This plugin has been built to test the portis wallet integration into the oasis app. So far it works fine in the app, user can:

- login
- sign transactinos

However this has not been tested yet in production.

Current implemenation allows you to use this wallet for the kovan testnet. If you wan to use it for mainnet change the setup parameter to `mainnet` in : `const portis = new Portis('8d10d328-422d-43de-933a-e5932226d36c', 'kovan');`

### Example usage

This plugin is not yet published to npm. So use [link](https://www.npmjs.com/package/link) to use it in oasis app.

```js
import portisPlugin from '@makerdao/dai-plugin-portis';
import Maker from '@makerdao/dai';

const maker = await Maker.create('http', {
  plugins: [portisPlugin],
});

// this will not resolve until the account is set up
await maker.authenticate();

```

[daijs]: https://github.com/makerdao/dai.js
