import { valdiateEmail } from './validators.js'

it('Validate email', () => {
    expect(valdiateEmail('email@gmail.com')).toEqual(true)
    expect(valdiateEmail('err')).toEqual(false)
    expect(valdiateEmail('aa@e')).toEqual(false)
})