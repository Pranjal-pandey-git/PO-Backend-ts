import { Request, Response } from 'express';
import { getAllPOItems, getDetailsWithID, insert, updatePOData, xldownload } from '../services';
import xlsx from 'sheetjs-style';
import {  UpdateDetails } from '../types';

export const podetails = async (req: Request, res: Response) => {
    try {
        const details = JSON.parse(req.body.details);
        if (req.file) {
            insert(details, req.file)
            res.sendStatus(201).json({ msg: 'Created Successfully' });
        }
        else {
            res.sendStatus(404).json({ msg: 'Not Created' });
        }
    } catch (err) {
        console.log(err, 'Podetails Function');
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
}

export const getAllPO = async (req: Request, res: Response) => {
    try {
        const data = await getAllPOItems();
        if (data) {
            res.status(200).send(data.Items);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        console.log(err, 'Podetails Function');
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
}

export const getDetails = async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id;
        const data  = await getDetailsWithID(id);
        if (data) {
            res.status(200).send(data.Item);
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
}
export const updateDetails = async (req: Request, res: Response) => {
    try {
        const id:string = req.params.id;
        const data:UpdateDetails[] = req.body;
        updatePOData(id, data);
        res.status(200).send('Updated successfully.');

    } catch (err) {

        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
}

export const xlDownloadAllData = (async (req: Request, res: Response) => {
    try {
        const data:xlsx.WorkBook =  await xldownload()
        res.status(200).send(data);
    } catch (err) {
        res.sendStatus(404).json({ msg: 'File Not Found' });
    }
});






