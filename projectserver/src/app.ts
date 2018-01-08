import * as express from 'express';
import { Router } from 'express';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this._routes();
    }

    private _routes() {
        let router = express.Router();
        router.get('/', (request, response, next) => {
            response.send(`
            <HTML>
                <HEAD>
                    <TITLE>Hello World</TITLE>
                </HEAD>
                <BODY>
                    <H1>Hello World</H1>
                </BODY>
            </HTML>
            `);
        });

        this.express.use('/', router);
    }
}

export default new App().express;