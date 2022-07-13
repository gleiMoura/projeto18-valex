import joi from "joi";

const createSchema = joi.object({
    employeeId: joi.number().required(),
	type: joi.string().required()
});

export default createSchema;