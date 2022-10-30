import { pageable } from "../types";
import { Request } from "express";


function getPageable (req : Request):pageable{

  let page = req.query.page ? JSON.parse(req.query.page.toString())  : 0;
  const limit = req.query.limit ? JSON.parse(req.query.limit.toString()) : 10;

  page = page > 0 ?page * limit : 0;

  return {
    limit : limit,
    page : page
  }
}

export { getPageable }