import { Request, Response, Router } from 'express';
import UserModel from '../models/user.model';
import { compare,hash } from 'bcrypt';
import { userValidator } from '../validators/user.validator';
import {auth} from '../middleware/auth.middleware';

export const userRouter = Router();

userRouter.post('/login', async (req: Request, res: Response) => {
    const {error} = userValidator(req.body);

    if (error)
        return res.status(400).send({error: error});

    const user: any = await UserModel.findOne({email: req.body.email});

    if (!user)
        return res.status(400).send({error: 'Invalid email or password'});

    const validPassword = await compare(req.body.password, user.password);

    if (!validPassword)
        return res.status(400).send({error: 'Invalid email or password'});

    const token = user.generateToken();

    res.send({token: token});
});

userRouter.post('/register', async (req: Request, res: Response) => {
    const {error} = userValidator(req.body,true);

    if (error)
        return res.status(400).send({error: error});

    const user: any = await UserModel.findOne({email: req.body.email});

    if (user)
        return res.status(400).send({error: 'Email already exists'});
    const hashedPassword = await hash(req.body.password, 10);

    await UserModel.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
        })
        .then(() => {
            res.send({'message': 'User created successfully'});
        })
        .catch(error => {
            console.error(error);
            return res.status(500).send({error: 'Error creating user'});
        })
});

userRouter.get('', auth, async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await UserModel.findById(req.user._id).select('-password');
    res.send(user);
});

