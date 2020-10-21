import Portis from '@portis/web3';
import Web3 from 'web3';
import debug from 'debug'

const log = debug('dai:plugin:portis');

const ACCOUNT_TYPE_PORTIS = 'portis';

export default function (maker, _, pluginComfig = {}) {
    log('Plugin Initiated');

    maker.service('accounts', true).addAccountType(ACCOUNT_TYPE_PORTIS, async (settings) => {
        const portis = new Portis('8d10d328-422d-43de-933a-e5932226d36c', 'kovan');
        const web3 = new Web3(portis.provider);

        const subprovider = web3.currentProvider;
        
        const accounts = await web3.eth.getAccounts((error, accounts) => accounts);
        const [address] = accounts;
       

        // setEngine and handleRequest are expected by the web3ProviderEngine
        function setEngine(engine) {
            const self = this;
            if (self.engine) return;
            self.engine = engine;
            engine.on('block', function (block) {
                self.currentBlock = block;
            });

            engine.on('start', function () {
                self.start();
            });

            engine.on('stop', function () {
                self.stop();
            });
        }

        function handleRequest(payload, next, end) {
            const self = this;
            self.send(payload, (err, result) => {
                return result ? end(null, result.result) : end(err);
            });
        }


        subprovider.setEngine = setEngine;
        subprovider.handleRequest = handleRequest;


        return { subprovider, address }
    })
}