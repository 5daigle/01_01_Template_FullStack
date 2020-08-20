import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

//Pour utiliser le webpack middleware sur lequel repose le hot reaload (en dev seulement)
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

//Utiliser le hot reload
app.use(webpackHotMiddleware(compiler))

//Lorsque le client se connecte pour la première fois (tombe sur le path '/'), 
//on lui renvoie le fichier index.html compilé dans le dossier de distribution
app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

//Port d'écoute des requêtes (si une requête provient d'un autre port, on n'en tiendra pas compte)
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})