const sessionIdToUserMap = new Map();

function setUser(sessionID, user) {
    sessionIdToUserMap.set(sessionID, user);
}

function getUser(sessionID) {
    return sessionIdToUserMap.get(sessionID);
}

module.exports = {
    setUser,
    getUser,
};
