const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //Clear the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room == room && user.username == username
    });

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room };
    users.push(user);
    return { user }
};

const removeUser = (id) => {
    const index = users.find((user) => {
        return user.id === id
    })
    
    if (index !== -1) {
            return users.splice(index, 1)[0]
    }
};

const getUser = (id) => {
  return users.find((user) => { return user.id === id }) 
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) =>  { return user.room === room} )
}

// addUser({
//     id: 1,
//     username: 'vova',
//     room: 'gym'
// })

// addUser({
//     id: 4,
//     username: 'luck',
//     room: 'gym'
// })

// addUser({
//     id: 7,
//     username: 'nuv',
//     room: 'hk'
// })

// console.log(getUsersInRoom('gym'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}