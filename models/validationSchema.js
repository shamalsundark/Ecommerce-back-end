const joi = require('@hapi/joi')

const authSchema = joi.object({
    name: joi.string(),
    email: joi.string(),
    username:joi.string().alphanum().min(5).max(15).required(),
    password: joi.string().min(5).required(),
})


module.exports = {
    authSchema,
}