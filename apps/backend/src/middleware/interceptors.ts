/* eslint-disable func-names */
import { type RequestHandler } from 'express';

interface FormattedBody<T> {
  status: number,
  data?: T,
  error?: string,
  meta?: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  },
  links?: {
    first?: string,
    previous?: string,
    next?: string,
    last?: string,
  },
}

const responseInterceptor: RequestHandler = (req, res, next) => {
  const oldDotJson = res.json;
  const oldStatusCode = res.status;

  let { statusCode } = res;

  res.status = function (code) {
    statusCode = code;
    return oldStatusCode.call(this, code);
  };

  res.json = function (body) {
    const formattedBody: FormattedBody<typeof body> = {
      status: statusCode,
    };

    if (statusCode >= 400) {
      formattedBody.error = body;
    } else {
      formattedBody.data = body.data;

      if (body.meta) {
        formattedBody.meta = body.meta;
      }

      if (body.links) {
        formattedBody.links = body.links;
      }
    }
    // Call the original res.send method with the formatted body
    return oldDotJson.call(res, formattedBody);
  };

  next();
};

export default responseInterceptor;
