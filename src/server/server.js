import path from 'path'
import express from 'express'

import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)


//Pour utiliser le webpack middleware sur lequel repose le hot reaload (en dev seulement)
if(process.env.NODE_ENV === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    logLevel: 'warn', publicPath: config.output.publicPath
  }))
  
  //Utiliser le hot reload
  app.use(webpackHotMiddleware(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
  }))
}

//Gérer le header des requêtes 
if(process.env.NODE_ENV === 'production') {//Portion de sécurité seulement nécessaire en production
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "*.amazonaws.com"]
      }
  }));
  app.use(compress()); //compresser les requêtes pour qu’elles soient plus légères à envoyer
  app.use(cors()); //allow cross origin
}
app.use(helmet.referrerPolicy({ policy: 'same-origin' })) //add XSS protection tactic


//Lorsque le client se connecte pour la première fois (tombe sur le path '/'), 
//on lui renvoie le fichier index.html compilé dans le dossier de distribution
app.get('*', (req, res, next) => {
    res.sendFile(HTML_FILE)
})

//Port d'écoute des requêtes (si une requête provient d'un autre port, on n'en tiendra pas compte)
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})