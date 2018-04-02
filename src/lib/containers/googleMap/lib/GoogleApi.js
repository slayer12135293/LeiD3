import invariant from 'invariant'

export const GoogleApi = function(opts) {
    opts = opts || {}

    invariant(
        opts.hasOwnProperty('apiKey'),
        'You must pass an apiKey to use GoogleApi'
    )

    const apiKey = opts.apiKey
    const libraries = opts.libraries || [ 'places' ]
    const client = opts.client
    const URL = opts.url || 'https://maps.googleapis.com/maps/api/js'

    const googleVersion = opts.version || '3.31'

    const script = null
    const google = window.google || null
    const loading = false
    const channel = null
    const language = opts.language
    const region = null

    const onLoadEvents = []

    const url = () => {
        const url = URL
        const params = {
            key: apiKey,
            callback: 'CALLBACK_NAME',
            libraries: libraries.join(','),
            client: client,
            v: googleVersion,
            channel: channel,
            language: language,
            region: region,
        }

        const paramStr = Object.keys(params)
            .filter(k => !!params[k])
            .map(k => `${k}=${params[k]}`)
            .join('&')

        return `${url}?${paramStr}`
    }

    return url()
}

export default GoogleApi
