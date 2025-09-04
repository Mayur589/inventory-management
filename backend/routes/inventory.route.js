import express from 'express';
import { getAllItems, createItem, updateItem, deleteItem } from '../controllers/manage_item_data.controller.js';
import { validateItem } from '../middleware/validate.middleware.js';

import { upsertSession, getSessionByDate, getSessionsByRange, deleteSession} from '../controllers/mange_trx_data.controller.js';
import { validateTransaction } from '../middleware/validate.middleware.js';

const router = express.Router();

//item data malupilation
router.get('/items', getAllItems);
router.post("/items", validateItem, createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);


//transaction routes
router.get('/transactions/:date/:session', getSessionByDate);
router.get('/transactions/range', getSessionsByRange);
router.post('/transactions', validateTransaction, upsertSession);
router.delete('/transactions/:date/:session', deleteSession);

export default router