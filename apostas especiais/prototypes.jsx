if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        if (typeof callback !== "function") {
            throw new TypeError(callback + " não é uma função");
        }

        var result = [];
        for (var i = 0; i < this.length; i++) {
            if (this.hasOwnProperty(i)) {
                result.push(callback.call(thisArg, this[i], i, this));
            }
        }
        return result;
    };
}

if (typeof JSON === "undefined") {
    JSON = {};
}

if (!JSON.parse) {
    JSON.parse = function(str) {
        return eval('(' + str + ')');
    };
}

if (!JSON.stringify) {
    JSON.stringify = function(obj) {
        var json = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                if (typeof value === "string") {
                    value = '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
                } else if (typeof value === "object" && value !== null) {
                    value = JSON.stringify(value);
                } else if (typeof value === "number" || typeof value === "boolean") {
                    value = String(value);
                } else {
                    value = "null";
                }
                json.push('"' + key + '":' + value);
            }
        }
        return '{' + json.join(',') + '}';
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0; // Define o valor padrão como 0 se não for fornecido
        return this.substring(position, position + searchString.length) === searchString;
    };
}

if (!String.prototype.includes) {
    String.prototype.includes = function(substring) {
        return this.indexOf(substring) !== -1;
    };
}