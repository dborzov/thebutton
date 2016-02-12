curl -i \
    -H "Content-Type: application/json" \
    -X PUT -d '{"URL":"https://www.github.com/dborzov/lsp"}' \
    http://localhost:5000/shorted_url
