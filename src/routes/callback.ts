import { Request } from 'itty-router';
import { config } from '../config';
import qs from 'qs';

function renderBody(
    status: string,
    content: {
        error?: string;
        token?: string;
        provider?: string;
    }
) {
    return `<html>
    <body>
        <script>
          const receiveMessage = (message) => {
            window.opener.postMessage(
              'authorization:${content.provider}:${status}:${JSON.stringify(content)}',
              message.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          window.opener.postMessage("authorizing:${content.provider}", "*");
        </script>
    </body>
    </html>`;
}

export default async (req: Request & { query: { code: string; provider: string } }, headers: Headers) => {
    const host = headers.get('host');

    if (!host) {
        return new Response('Missing host header!', { status: 400 });
    }

    const { code, provider } = req.query;
    const {
        auth: { tokenHost, tokenPath },
        client: { id: client_id, secret: client_secret },
    } = config(provider);

    const params = {
        client_id,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `https://${host}/callback?provider=${provider}`,
    };

    try {
        const response = await fetch(`${tokenHost}/${tokenPath}?${qs.stringify(params)}`, {
            method: 'post',
            headers: { Accept: 'application/json' },
            body: JSON.stringify(params),
        });

        const data = await response.json<{ access_token: string }>();

        return new Response(
            renderBody('success', {
                token: data.access_token,
                provider,
            }),
            {
                headers: { 'Content-Type': 'text/html' },
            }
        );
    } catch (error: any) {
        return new Response(renderBody('error', { error: error.toString() }), {
            headers: { 'Content-Type': 'text/html' },
        });
    }
};
