import { Request, Response } from "express";
import { MemoryCache } from "bear-cache"
import { Application } from "express-serve-static-core";
import { request } from "https";

export class Routes {
    private randomIntFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public routes(app: Application): void {

        const cache = new MemoryCache()

        app.route('/')
            .get(async (req: Request, res: Response) => {
                const cacheKey = (req.query && req.query.key && typeof req.query.key === "string")
                    ? `RANDOM_KEY_${req.query.key}`
                    : 'RANDOM_KEY_DEFAULT'

                let ret = await cache.get(cacheKey)
                const isCached = !(ret === undefined)

                if(!isCached) {
                    ret = this.randomIntFromInterval(1, 100)
                    await cache.set(cacheKey, ret)
                }

                res.status(200).send({
                    message: {
                        key: cacheKey,
                        cached: isCached,
                        random: ret
                    }
                })
            })
    }
}