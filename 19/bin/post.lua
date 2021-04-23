-- example HTTP POST script which demonstrates setting the
-- HTTP method, body, and adding a header

wrk.method = "POST"
wrk.body   = "{post_str}"
wrk.headers["Content-Type"] = "application/x-www-form-urlencoded"