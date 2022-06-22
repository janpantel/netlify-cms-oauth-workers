import { config } from '../config';
import { scopes } from '../scopes';
import qs from 'qs';
import { Request } from 'itty-router';

export default async (request: Request, headers: Headers) => {
    const host = headers.get('host');

    if (!host) {
        return new Response('Missing host header', { status: 400 });
    }

    const provider = request.query?.provider;

    if (!provider) {
        return new Response('Missing provider parameter.', { status: 400 });
    }

    const oauthConfig = config(provider);

    const params = {
        scope: scopes[provider],
        redirect_uri: `https://${host}/callback?provider=${provider}`,
        client_id: oauthConfig.client.id,
        response_type: 'code',
    };

    const authorizationUri = `${oauthConfig.auth.tokenHost}/${oauthConfig.auth.authorizePath}?${qs.stringify(params)}`;

    return Response.redirect(authorizationUri);
};
