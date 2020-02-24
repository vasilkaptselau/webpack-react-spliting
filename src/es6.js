async function promo() {
    return await Promise.resolve('ES6 works with babel')
}
promo().then(console.log)
class DateID {
    static id = Date.now()
}
console.log('Date ID:', DateID.id)

import('lodash').then(_ => {
    console.log('Lodash', _.random(0, 42, true))
})