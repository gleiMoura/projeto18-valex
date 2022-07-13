import joi from "joi";

const activateSchema = joi.object({
    id: joi.number()
        .required(),
    securityCode: joi.string()
        .required(),
    password: joi.string()
        .min(4)
        .required()
});

export default activateSchema;