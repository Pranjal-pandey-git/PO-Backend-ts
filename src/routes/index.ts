
import express, { Request, Response } from 'express';
import { getAllPO, getDetails, podetails, updateDetails } from '../controllers';
import { upload } from '../utils/uploadPdf';
const router = express.Router();

router.get('/hi', (req: Request, res: Response) => {
    res.send("hello router1")
})

//routes for Home Page in frontend


//insert Po details
router.post('/poDetails',upload, podetails)

//routes for RaiseDMR
router.get('/getAllItems',getAllPO);

router.get('/getdetails/:id',getDetails);
router.patch('/poDetails/:id',updateDetails);






export { router };