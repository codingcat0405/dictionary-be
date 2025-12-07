const responseMiddleware = ({ set, response, path }: any) => {
  // Skip middleware for static files (served by static plugin)
  if (path && path.startsWith('/public/')) {
    return response;
  }

  // Skip middleware for non-JSON responses (like files, buffers, etc.)
  if (response instanceof Buffer || response instanceof Uint8Array || typeof response === 'string') {
    return response;
  }

  set.status = 200;
  //return response directly cause [object Object] when response refers to an object of typeorm entity
  return JSON.parse(JSON.stringify(response))
}
export default responseMiddleware;