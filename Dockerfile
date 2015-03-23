FROM nginx:1.7

RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/example_ssl.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist/ /www/html/dist/
COPY ./index.html /www/html/

EXPOSE 8080

