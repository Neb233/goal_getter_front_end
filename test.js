const { addFriend } = require("./utils/api.js");

console.log(
  addFriend("jeff", "susan")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
);
