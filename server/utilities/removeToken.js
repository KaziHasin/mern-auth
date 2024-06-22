const removeToken = (res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return { status: true };
};

export default removeToken;
