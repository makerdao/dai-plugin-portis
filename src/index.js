import Portis from '@portis/web3';
import Web3 from 'web3';
import debug from 'debug'

const log = debug('dai:plugin:portis');

const ACCOUNT_TYPE_PORTIS = 'portis';

export default function (maker, _, pluginComfig = {}) {
    log('Plugin Initiated');

    maker.service('accounts', true).addAccountType(ACCOUNT_TYPE_PORTIS, async (settings) => {
        const networkName = maker.service('web3').networkName;
        const portis = new Portis('e0ac7d6b-a19b-4f61-928d-fb97b15c424a', networkName);
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