const APP_REGEX = /^([a-z][a-z\-_]+[a-z])(?:\..+)?/;

export function getApplicationFromResource(resourceId) {
    const match = resourceId.match(APP_REGEX);
    return match ? match[1] : null;
}
