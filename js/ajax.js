function AJAX(config) {

    if( !(this instanceof AJAX ) ) {
        return new AJAX(config);
    }

    this._xhr = new XMLHttpRequest();
    this._config = this._extendOptions(config);

    this._assignEvents();

    this._beforeSend();

}

AJAX.prototype._extendOptions = function(config) {

    var defaultConfig = JSON.parse(JSON.stringify(this._defaultConfig));

    for(var key in defaultConfig) {

        if(key in config) {
            continue;
        }

        config[key] = defaultConfig[key];

    }

    return config;

};

AJAX.prototype._assignEvents = function() {

    this._xhr.addEventListener("readystatechange", this._handleResponse.bind(this), false);
    this._xhr.addEventListener("abort", this._handleError.bind(this), false);
    this._xhr.addEventListener("error", this._handleError.bind(this), false);
    this._xhr.addEventListener("timeout", this._handleError.bind(this), false);

};

AJAX.prototype._assignUserHeaders = function() {

    if(Object.keys(this._config.headers).length) {

        for(var key in this._config.headers) {
            this._xhr.setRequestHeader(key, this._config.headers[key]);
        }

    }

};

AJAX.prototype._open = function() {

    this._xhr.open(
        this._config.type,
        this._config.url,
        this._config.options.async,
        this._config.options.username,
        this._config.options.password
    );

    this._xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    this._xhr.timeout = this._config.options.timeout;

};

AJAX.prototype._beforeSend = function() {

    var isData = Object.keys(this._config.data).length > 0,
        data = null;

    if(this._config.type.toUpperCase() === "POST" && isData) {
        data = this._serializeFormData(this._config.data);
    } else if(this._config.type.toUpperCase() === "GET" && isData) {
        this._config.url += "?" + this._serializeData(this._config.data);
    }

    this._open();
    this._assignUserHeaders();
    this._send(data);

};

AJAX.prototype._send = function(data) {

    this._xhr.send(data);

};

AJAX.prototype._handleResponse = function(e) {

    if(this._xhr.readyState === 4 && this._xhr.status >= 200 && this._xhr.status < 400) {

        if(typeof this._config.success === "function") {
            this._config.success(this._xhr.response, this._xhr);
        }

    } else if(this._xhr.readyState === 4 && this._xhr.status >= 400) {

        this._handleError();

    }

};

AJAX.prototype._handleError = function(e) {

    if(typeof this._config.failure === "function") {
        this._config.failure(this._xhr);
    }

};

AJAX.prototype._serializeData = function(data) {

    var serialized = "";

    for(var key in data) {
        serialized += key + "=" + encodeURIComponent(data[key]) + "&";
    }

    return serialized.slice(0, serialized.length - 1);

};

AJAX.prototype._serializeFormData = function(data) {

    var serialized = new FormData();

    for(var key in data) {
        serialized.append(key, data[key]);
    }

    return serialized;

};

AJAX.prototype._defaultConfig = {
    type: "GET",
    url: window.location.href,
    data: {},
    options: {
        async: true,
        timeout: 0,
        username: null,
        password: null
    },
    headers: {}
};