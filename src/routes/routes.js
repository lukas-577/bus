
import {Router}from 'express';
import { getDatos } from '../controller/controller.index.js';
const router = Router();


router.get('/datos/:paradero',getDatos)

export default router;
