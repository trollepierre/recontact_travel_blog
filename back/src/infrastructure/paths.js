import path from 'path'

// Every documented entry point starts the back from `back/`
// (`cd back && node dist/index.js` in production, `cd back && nodemon --exec babel-node ./index.js`
// in dev), unlike `__dirname`, whose depth changes depending on whether babel compiled the file.
const frontDistDir = path.resolve(process.cwd(), '..', 'front', 'dist')

export { frontDistDir }
