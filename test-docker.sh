docker run \
    -it \
    -e YTENV_KIO_BASE_URL=http://localhost:5000 \
    -e YTENV_TWINTIP_BASE_URL=http://localhost:5001 \
    -e YTENV_DOCKER_REGISTRY=docker.io \
    -e YTENV_SERVICE_URL_TLD=example.com \
    -e YTENV_OAUTH_CLIENT_ID=yourturn \
    -e YTENV_OAUTH_AUTH_URL=http://localhost:5002/auth \
    -e YTENV_OAUTH_REDIRECT_URI=http://localhost:3000/oauth \
    -e YTENV_OAUTH_SCOPES=uid \
    -e YTENV_OAUTH_TOKENINFO_URL=http://localhost:5006/tokeninfo \
    -e YTENV_TEAM_BASE_URL=http://localhost:5005 \
    -e YTENV_MINT_BASE_URL=http://localhost:5004 \
    -e YTENV_ESSENTIALS_BASE_URL=http://localhost:5003 \
    -e YTENV_PIERONE_BASE_URL=http://localhost:5007/v1 \
    -p 8080:8080 \
    -u 998 \
    <image>