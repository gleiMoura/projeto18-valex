import joi from "joi";

const shoppigSchema = joi.object({
    id: joi.number()
        .required(),
    password: joi.string()
        .required(),
    businessId: joi.number()
        .required(),
    amount: joi.number()
        .min(1)
        .required()
});

export default shoppigSchema;