import { NextFunction, Request  } from 'express'
import { AppResponse } from '../types';
import { error } from '../types/error';

function errorHandler(err : error, req : Request, res : AppResponse, next : NextFunction){

    
    return res.status(err.status)
    .json({
        success : false,
        error : err.message
    })

}

export { errorHandler }