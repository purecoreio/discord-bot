var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Core {
    constructor(key) {
        this.key = key;
    }
    getKey() {
        return this.key;
    }
    getElements() {
        return new Elements(this);
    }
    getInstance(instanceId, name, type) {
        return new Instance(this, instanceId, name, type);
    }
    fromDiscord(guildId, botToken, devkey) {
        return __awaiter(this, void 0, void 0, function* () {
            var obj = this;
            return new Promise(function (resolve, reject) {
                try {
                    var url = "https://api.purecore.io/rest/2/key/from/discord/?guildid=" + guildId + "&token=" + botToken;
                    if (devkey == true) {
                        url = "https://api.purecore.io/rest/2/key/from/discord/?guildid=" + guildId + "&token=" + botToken + "&devkey=true";
                    }
                    return fetch(url, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            obj.key = jsonresponse.hash;
                            resolve(obj);
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });
        });
    }
}
try {
    module.exports = Core;
}
catch (error) {
    console.log("[corejs] starting plain vanilla instance, as nodejs exports were not available");
}
class ConnectionHash extends Core {
    constructor(core, network, uuid, hash, player) {
        super(core.getKey());
        this.core = core;
        this.network = network;
        this.uuid = uuid;
        this.hash = hash;
        this.player = player;
    }
    fromArray(array) {
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        return this;
    }
    getPlayer() {
        return this.player;
    }
    getHash() {
        return this.hash;
    }
    getNetwork() {
        return this.network;
    }
    requestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            var core = this.core;
            var hash = this.hash;
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/session/hash/token/?key=" + key + "&hash=" + hash, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var player = new Player(core, jsonresponse.player.coreid, jsonresponse.player.username, jsonresponse.player.uuid, jsonresponse.player.verified);
                            var instance = new Network(core, new Instance(core, jsonresponse.network.uuid, jsonresponse.network.name, "NTW"));
                            var sessionRequest = new SessionRequest(core, jsonresponse.uuid, jsonresponse.token, jsonresponse.validated, player, instance, "player");
                            resolve(sessionRequest);
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });
        });
    }
}
class CheckoutElement extends Core {
    constructor(core, products, successFunction) {
        super(core.getKey());
        this.core = core;
        this.products = products;
        document.addEventListener("paymentSuccess", successFunction);
    }
    getJSON() {
        var finalProducts = new Array();
        this.products.forEach(product => {
            finalProducts.push(product.getId());
        });
        return JSON.stringify(finalProducts);
    }
    loadInto(selector) {
        var key = this.core.getKey();
        var products = this.getJSON();
        $.getScript("https://js.stripe.com/v3/", function (data, textStatus, jqxhr) {
            $(selector).load("https://api.purecore.io/rest/2/element/checkout/?key=" + key + "&items=" + products);
        });
    }
}
class Elements extends Core {
    constructor(core) {
        super(core.getKey());
        this.core = core;
    }
    getCheckoutElement(products, successFunction) {
        return new CheckoutElement(this.core, products, successFunction);
    }
}
class Instance extends Core {
    constructor(core, uuid, name, type) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.name = name;
        this.type = type;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.uuid;
    }
    asNetwork() {
        return new Network(this.core, this);
    }
}
class Network extends Core {
    constructor(core, instance) {
        super(core.getKey());
        this.core = core;
        this.uuid = instance.getId();
        this.name = instance.getName();
    }
    setGuild(discordGuildId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setguild/?key=" + key + "&guildid=" + discordGuildId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    setSessionChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/session/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    setDonationChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            try {
                return yield fetch("https://api.purecore.io/rest/2/instance/network/discord/setchannel/donation/?key=" + key + "&channelid=" + channelId, { method: "GET" }).then(function (response) {
                    return response.json();
                }).then(function (jsonresponse) {
                    if ("error" in jsonresponse) {
                        throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                    }
                    else {
                        return true;
                    }
                });
            }
            catch (e) {
                throw new Error(e.message);
            }
        });
    }
    getHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/session/hash/list/?key=" + key, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            var response = new Array();
                            jsonresponse.forEach(hashData => {
                                var hash = new ConnectionHash(new Core(key));
                                response.push(hash.fromArray(hashData));
                            });
                            resolve(response);
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });
        });
    }
}
class Session extends Core {
    constructor(core, uuid, hash, device, location, usage, network, player) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.hash = hash;
        this.device = device;
        this.location = location;
        this.usage = usage;
        this.network = network;
        this.player = player;
    }
    fromArray(array) {
        this.uuid = array.uuid;
        this.hash = array.hash;
        this.device = new SessionDevice(array.device.brand, array.device.device, array.device.model, array.device.os);
        this.location = new SessionLocation(array.location.city, array.location.state, array.location.country_code);
        this.usage = new SessionUsage(array.usage.creation, array.usage.uses);
        this.network = new Network(this.core, new Instance(this.core, array.network.uuid, array.network.name, "NTW"));
        this.player = new Player(this.core, array.player.coreid, array.player.username, array.player.uuid, array.player.verified);
        return this;
    }
}
class SessionDevice {
    constructor(brand, device, model, os) {
        this.brand = brand;
        this.device = device;
        this.model = model;
        this.os = os;
    }
}
class SessionLocation {
    constructor(city, state, country_code) {
        this.city = city;
        this.state = state;
        this.country_code = country_code;
    }
}
class SessionRequest extends Core {
    constructor(core, uuid, token, validated, player, network, type) {
        super(core.getKey());
        this.core = core;
        this.uuid = uuid;
        this.token = token;
        this.validated = validated;
        this.player = player;
        this.network = network;
        this.type = type;
    }
    isValidated() {
        return this.validated;
    }
    getValidationUrl() {
        return "https://api.purecore.io/link/discord/redirect/?uuid=" + this.uuid + "&hash=" + this.token;
    }
    getToken() {
        return this.token;
    }
    getSession() {
        return __awaiter(this, void 0, void 0, function* () {
            var key = this.core.getKey();
            var core = this.core;
            var token = this.token;
            return new Promise(function (resolve, reject) {
                try {
                    return fetch("https://api.purecore.io/rest/2/session/hash/token/exchange/?key=" + key + "&token=" + token, { method: "GET" }).then(function (response) {
                        return response.json();
                    }).then(function (jsonresponse) {
                        if ("error" in jsonresponse) {
                            throw new Error(jsonresponse.error + ". " + jsonresponse.msg);
                        }
                        else {
                            resolve(new Session(core).fromArray(jsonresponse));
                        }
                    }).catch(function (error) {
                        throw new Error(error);
                    });
                }
                catch (e) {
                    throw new Error(e.message);
                }
            });
        });
    }
}
class SessionUsage {
    constructor(creation, uses) {
        this.creation = creation;
        this.uses = uses;
    }
}
class StoreCategory {
    constructor(uuid, name, description, network, upgradable) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.network = network;
        this.upgradable = upgradable;
    }
}
class StoreItem {
    constructor(uuid, name, description, category, network, price, contextualizedPerks) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.category = category;
        this.network = network;
        this.price = price;
        this.perks = contextualizedPerks;
    }
    getId() {
        return this.uuid;
    }
}
class Perk {
    constructor(uuid, network, name, description, type, category) {
        this.uuid = uuid;
        this.network = network;
        this.name = name;
        this.description = description;
        this.type = type;
        this.category = category;
    }
}
class PerkCategory {
    constructor(uuid, name, network) {
        this.uuid = uuid;
        this.name = name;
        this.network = network;
    }
}
class PerkContextualized {
    constructor(perk, quantity) {
        this.perk = perk;
        this.quantity = quantity;
    }
}
class Player extends Core {
    constructor(core, id, username, uuid, verified) {
        super(core.getKey());
        this.core = core;
        this.id = id;
        this.username = username;
        this.uuid = uuid;
        this.verified = verified;
    }
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getUsername() {
        return this.username;
    }
}
