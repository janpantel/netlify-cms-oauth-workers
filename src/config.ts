export const config = (provider: string) => {
    const client: Record<string, any> = {
        github: {
            id: OAUTH_GITHUB_CLIENT_ID,
            secret: OAUTH_GITHUB_CLIENT_SECRET,
        },
        gitlab: {
            id: OAUTH_GITLAB_CLIENT_ID,
            secret: OAUTH_GITLAB_CLIENT_SECRET,
        },
    };

    const auth: Record<string, any> = {
        github: {
            tokenHost: 'https://github.com',
            tokenPath: '/login/oauth/access_token',
            authorizePath: '/login/oauth/authorize',
        },
        gitlab: {
            tokenHost: 'https://gitlab.com',
            tokenPath: '/oauth/token',
            authorizePath: '/oauth/authorize',
        },
    };

    return {
        client: {
            id: client[provider].id,
            secret: client[provider].secret,
        },
        auth: {
            tokenHost: auth[provider].tokenHost,
            tokenPath: auth[provider].tokenPath,
            authorizePath: auth[provider].authorizePath,
        },
    };
};
