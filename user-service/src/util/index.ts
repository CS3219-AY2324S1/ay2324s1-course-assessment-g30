import { Response } from 'express';
import { HTTP_ERROR_CODES, REQUEST_ERROR_MESSAGES } from '../constants';

const sendErrResponse = (
  res: Response,
  httpErrCode: number,
  errMessage: string
) => {
  res.status(httpErrCode).json({ err: errMessage, res: '' });
};

const sendSuccessResponse = (
  res: Response,
  resMessage: string | Record<never, never>
) => {
  res.json({ err: '', res: resMessage });
};

const sendBadRequestResponse = (res: Response, errMessage: string) => {
  sendErrResponse(res, HTTP_ERROR_CODES.BAD_REQUEST, errMessage);
};

const sendInternalServerErrorResponse = (res: Response, errMessage: string) => {
  sendErrResponse(res, HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR, errMessage);
};

const sendUnexpectedMissingUserResponse = (res: Response) => {
  sendErrResponse(
    res,
    HTTP_ERROR_CODES.INTERNAL_SERVER_ERROR,
    REQUEST_ERROR_MESSAGES.MISSING_USER
  );
};

const sendForbiddenErrorResponse = (res: Response, errMessage: string) => {
  sendErrResponse(res, HTTP_ERROR_CODES.FORBIDDEN, errMessage);
};

export {
  sendErrResponse,
  sendSuccessResponse,
  sendBadRequestResponse,
  sendInternalServerErrorResponse,
  sendForbiddenErrorResponse,
  sendUnexpectedMissingUserResponse
};
