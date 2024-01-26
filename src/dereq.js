export const makeOrigin = (ip, port = '', protocol = 'https') => 
    ({ip, port, protocol});

export const fmtOrigin = ({ip, port, protocol}) => 
    `${protocol}://${ip}${port ? `:${port}` : ''}`;

export const fmtPathName = (pathname) =>
    `${pathname.length !== 0 ? `/${pathname.join('/')}/` : '/'}`;

export const fmtURL = (origin, pathname, request, params = '') =>
    `${fmtOrigin(origin)}${fmtPathName(pathname)}${request}${params}`;

export const fmtBody = (origin, pathname, body) => {
    return Object.keys(body).reduce((acc, key) => {
        const value = body[key];

        if(typeof value === 'string') {
            acc[key] = fmtURL(origin, pathname, value);
        } else if(typeof value === 'function') {
            acc[key] = (...params) => fmtURL(origin, pathname, value(...params));
        } else if(typeof value === 'object') {
            acc[key] = fmtBody(origin, pathname, value);
        }

        return acc;
    }, {});
};

export const dereq = (address, requests) => {
    return Object.fromEntries(requests.reduce((acc, [pathname, body]) => {
        if(pathname.length === 0) {
            return [
                ...acc,
                Object.entries(fmtBody(address, pathname, body))
            ];
        } else {
            return acc
        }
    }
    , []));
};
