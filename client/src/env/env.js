import { prop } from 'ramda'

import * as window from './window'

export default key => prop(key, window.get('env'))
