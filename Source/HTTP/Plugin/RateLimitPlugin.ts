import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

import { I18n } from '@/Common/Tools';
import { IPlugin } from '@/HTTP/Interface';

export class RateLimitPlugin implements IPlugin {
    public configure(app: FastifyInstance): void {
        app.register(rateLimit, {
            max: 100,
            timeWindow: 5000,
            addHeadersOnExceeding: {
                'x-ratelimit-limit': true,
                'x-ratelimit-remaining': true,
                'x-ratelimit-reset': true
            },
            addHeaders: {
                'x-ratelimit-limit': true,
                'x-ratelimit-remaining': true,
                'x-ratelimit-reset': true,
                'retry-after': true
            },
            errorResponseBuilder: (request): { code : number, message: string } => {
                return {
                    code: 429,
                    message: I18n.translate('http.plugin.RateLimitPlugin.RATE_LIMIT', request.headers['accept-language'], {
                        max: 100,
                        timeWindow: 5000,
                    })
                };
            }
        });
    }
}
