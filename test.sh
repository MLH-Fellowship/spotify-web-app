function test {
    domain="https://spotime.duckdns.org"
    domain_insecure="http://spotime.duckdns.org"
    declare -a endpoints=("" "health" "home", "login")
    declare -a endpoints_insecure=(":8080", ":9090")

    for endpoint in "${endpoints[@]}"; do
        url="${domain}/${endpoint}"

        status=$(curl -s -o /dev/null -w "%{http_code}\n" "${url}")
        echo "Status Code [${status}] for ${url}"

    done
        for endpoint in "${endpoints_insecure[@]}"; do
        url_insecure="${domain_insecure}${endpoint}"

        status=$(curl -s -o /dev/null -w "%{http_code}\n" "${url_insecure}")
        echo "Status Code [${status}] for ${url_insecure}"

    done
}

test
