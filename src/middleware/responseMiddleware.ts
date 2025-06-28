const responseMiddleware = ({ set, response }: any) => {
  set.status = 200;
  //return response directly cause [object Object] when response refers to an object of typeorm entity
  return JSON.parse(JSON.stringify(response))
}
export default responseMiddleware;