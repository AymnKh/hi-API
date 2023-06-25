class User {
  constructor() {
    this.globalArray = [];
  }

  addUser(socketId, userId, room) {
    const user = { socketId, userId, room }; //short hand es6
    this.globalArray.push(user);
    return user;
  }

  getUser(socketId) {
    const user = this.globalArray.filter(
      (user) => user.socketId === socketId
    )[0];
    return user; // return data of user depending on his socket id
  }

  removeUser(socketId) {
    const user = this.getUser(socketId);
    if (user) {
      this.globalArray = this.globalArray.filter(
        (user) => user.socketId !== socketId
      );
    }
    return user; // return data of removed user
  }

  getUsers(room) {
    const usersInRoom = this.globalArray.filter((user) => user.room === room);
    const onlineUsersIds = usersInRoom.map((user) => user.userId);
    return onlineUsersIds; // return Array of online users identifiers
  }
}

export default User ;
