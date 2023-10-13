export const errors = {
    MONGODB_CONNECTION_ERROR: {
      errorCode: 500,
      status: "MongoDB Connect Error!",
    },
    USER_ALREADY_EXIST: {
      errorCode: 409,
      status: "User Already Exist!",
    },
    USER_NOT_FOUND: {
      errorCode: 404,
      status: "User Does not Exist!",
    },
    INVALID_PASSWORD: {
      errorCode: 401,
      status: "Invalid Password!",
    },
  };
  