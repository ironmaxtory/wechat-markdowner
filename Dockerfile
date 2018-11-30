FROM node:10.14.0-alpine as builder

COPY . /wechat-markdowner

WORKDIR /wechat-markdowner

RUN npm install \
    && npm run build

FROM nginx:1.14.1-alpine

LABEL maintainer="mritd <mritd1234@gmail.com>"

ARG TZ="Asia/Shanghai"

ENV TZ ${TZ}

RUN apk upgrade --update \
    && apk add bash tzdata \
    && rm -rf /usr/share/nginx/html \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && rm -rf /var/cache/apk/*

COPY --from=builder /wechat-markdowner/md /usr/share/nginx/html

CMD ["nginx","-g","daemon off;"]
