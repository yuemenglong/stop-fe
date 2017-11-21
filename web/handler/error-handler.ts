export function errorHandler(err: Error, req: any, res: any, next: Function) {
    res.set("content-type", "text/html").status(500).end(err.message)
}