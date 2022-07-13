import joi from "joi";

const blockSchema = joi.object({
    id: joi.number()
        .required(),
    password: joi.number()
        .min(4)
        .required()
});

export default blockSchema;