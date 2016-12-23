(function () {

    var root = this;

    var badCharater = [":", "@", "://"];

    var parserURI = function (url) {
        var firstSplit, lastSplit, parsing, urlObject;
        urlObject = {
            host: "",
            port: "",
            query: {},
            pathname: "",
            protocol: "",
            user: "",
            password: "",
            href: url,
            hash: ""
        };
        firstSplit = function (str, splitter) {
            var array;
            if (str.indexOf(splitter) !== -1) {
                array = [str.substring(0, str.indexOf(splitter)), str.substring(str.indexOf(splitter) + splitter.length)];
                return array;
            }
            return ["", str];
        };
        lastSplit = function (str, splitter) {
            var array;
            if (str.lastIndexOf(splitter) !== -1) {
                array = [str.substring(str.lastIndexOf(splitter) + splitter.length), str.substring(0, str.lastIndexOf(splitter))];
                return array;
            }
            return ["", str];
        };
        checkerBadCharater = function (str) {
            for (var index = 0; index < badCharater.length; index++) {
                if (str.indexOf(badCharater[index]) != -1) {
                    return false;
                }
            }
            return true;
        };
        parsing = function (uri, splitter, flag) {
            if (flag == null) {
                flag = false;
            }
            switch (splitter) {
                case "#":
                    if ((uri.lastIndexOf("#" + lastSplit(uri, splitter)[0]) == uri.length - lastSplit(uri, splitter)[0].length - splitter.length) && (checkerBadCharater(lastSplit(uri, splitter)[0]) == true)) {
                        urlObject.hash = lastSplit(uri, splitter)[0];
                        parsing(lastSplit(uri, splitter)[1], "@");
                    } else {
                        urlObject.hash = false;
                        parsing(uri, "@");
                    }

                    break;
                case "?":
                    urlObject.query = {};
                    lastSplit(uri, splitter)[0].split("&").forEach(function (elem) {
                        var element;
                        element = elem.split("=");
                        if (element[0] !== "") {
                            urlObject.query[element[0]] = element[1];
                        }
                    });
                    parsing(lastSplit(uri, splitter)[1], "/");
                    break;
                case "/":
                    if (firstSplit(uri, splitter)[0] === "") {
                        parsing(firstSplit(uri, splitter)[1], ":", true);
                        urlObject.pathname = "/" + firstSplit(uri, splitter)[0];
                    } else {
                        parsing(firstSplit(uri, splitter)[0], ":", true);
                        urlObject.pathname = "/" + firstSplit(uri, splitter)[1];
                    }
                    break;
                case "://":
                    urlObject.protocol = firstSplit(uri, splitter)[0];
                    parsing(firstSplit(uri, splitter)[1], "#");
                    break;
                case "@":
                    if (lastSplit(uri, splitter)[0] !== "") {
                        parsing(lastSplit(uri, splitter)[1], ":");
                        parsing(lastSplit(uri, splitter)[0], "?");
                    } else {
                        parsing(lastSplit(uri, splitter)[1], "?");
                    }
                    break;
                case ":":
                    if (flag) {
                        if (firstSplit(uri, splitter)[0] === "") {
                            urlObject.host = firstSplit(uri, splitter)[1];
                        } else {
                            urlObject.host = firstSplit(uri, splitter)[0];
                            urlObject.port = firstSplit(uri, splitter)[1];
                        }
                    } else {
                        if (firstSplit(uri, splitter)[0] === "") {
                            urlObject.user = firstSplit(uri, splitter)[1];
                        } else {
                            urlObject.user = firstSplit(uri, splitter)[0];
                            urlObject.password = firstSplit(uri, splitter)[1];
                        }
                    }
                    break;
            }
        };
        parsing(url, "://");
        urlObject.origin = (urlObject.protocol !== "" ? urlObject.protocol + "://" : "") + urlObject.host + (urlObject.port !== "" ? ":" + urlObject.port : "");
        return urlObject;
    };

    if (typeof exports !== 'undefined') {
        //supports node
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = parserURI;
        }
        exports.parserURI = parserURI;
    } else {
        //supports globals
        root.parserURI = parserURI;
    }

    return parserURI;
}).call(this);