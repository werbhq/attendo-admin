// eslint-disable-next-line no-unused-vars
interface String {
    toProperCase(): string;
}

// eslint-disable-next-line no-extend-native
String.prototype.toProperCase = function properCase() {
    return this.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
