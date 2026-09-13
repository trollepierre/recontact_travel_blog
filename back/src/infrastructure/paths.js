import path from 'path'

// Tous les points d'entrée documentés démarrent le back depuis `back/`
// (`cd back && node dist/index.js` en production, `cd back && nodemon --exec babel-node ./index.js`
// en dev), contrairement à `__dirname` qui change de profondeur selon que le fichier a été compilé
// par babel ou non.
const frontDistDir = path.resolve(process.cwd(), '..', 'front', 'dist')

export { frontDistDir }
