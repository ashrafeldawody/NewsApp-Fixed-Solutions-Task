import Joi from 'joi';
import { IUser } from '../models/user.model';


export function userValidator(user: IUser, register: boolean = false): Joi.ValidationResult {
    const validationsRules = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(15).required(),
    };

    if (register) {
        Object.assign(validationsRules, {
            fullName: Joi.string().min(5).max(100).required(),
            password_confirmation: Joi.any().valid(Joi.ref('password')).required()
        });
    }

    const schema = Joi.object(validationsRules);
    return schema.validate(user);
}
