---
title: Set Up a GitHub Mirror Site
date: 2026-06-11T00:00:00.000Z
description: Using Nginx to set up a GitHub mirror site for faster access
tags: [website, mirror]
---

I've set up a GitHub mirror site with moderate bandwidth for general accelerated access:

> **URL:** <https://github.rayou.me>

---

## ⚠️ Security Notice

Although the site supports login, it is **strongly recommended NOT to log in** to prevent credential leaks!

---

## Tools Used

- [Nginx](https://nginx.org/)

## Nginx Configuration

```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  github.rayou.me;

    return 301 https://$host$request_uri;
}

server {
    listen       443 ssl;
    listen       [::]:443 ssl;
    server_name  github.rayou.me;

    # SSL certificate
    ssl_certificate      /home/dragonren/.tls/cert-rayou;
    ssl_certificate_key  /home/dragonren/.tls/key-rayou;

    # SSL protocols and ciphers
    ssl_protocols             TLSv1.2 TLSv1.3;
    ssl_ciphers               ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout       1d;
    ssl_session_cache         shared:SSL:10m;

    # Logging
    access_log  /var/log/nginx/github_proxy_access.log;
    error_log   /var/log/nginx/github_proxy_error.log info;

    location / {
        proxy_pass  https://github.com;

        # Buffer settings
        proxy_buffer_size       128k;
        proxy_buffers           4 256k;
        proxy_busy_buffers_size 256k;

        # DNS resolution
        resolver         8.8.8.8 1.1.1.1 valid=300s ipv6=off;
        resolver_timeout 5s;

        # SSL proxy settings
        proxy_ssl_server_name on;
        proxy_ssl_name        github.com;
        proxy_ssl_protocols   TLSv1.2 TLSv1.3;
        proxy_ssl_session_reuse on;

        # Request headers
        proxy_set_header Host            github.com;
        proxy_set_header Origin          https://github.com;
        proxy_set_header Referer         $http_referer;
        proxy_set_header X-Real-IP       "";
        proxy_set_header X-Forwarded-For "";
        proxy_set_header X-Forwarded-Proto  "";
        proxy_set_header X-Forwarded-Host   "";
        proxy_set_header User-Agent      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        proxy_set_header Accept-Encoding "";

        # Redirects and cookies
        proxy_redirect     https://github.com/ https://github.rayou.me/;
        proxy_cookie_domain github.com github.rayou.me;

        # Timeouts and buffering
        proxy_buffering    off;
        proxy_read_timeout 600s;
        proxy_send_timeout 600s;

        # Content substitution
        sub_filter         'github.com' 'github.rayou.me';
        sub_filter_once    off;
        sub_filter_types   text/css text/xml application/javascript application/json;
    }
}
```
