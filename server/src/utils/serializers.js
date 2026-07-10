function publicUser(user) {
  if (!user) return null;
  const value = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  delete value.passwordHash;
  value.id = value.id || value._id?.toString();
  delete value._id;
  return value;
}

function publicListing(listing) {
  const value = typeof listing.toJSON === "function" ? listing.toJSON() : { ...listing };
  value.id = value.id || value._id?.toString();
  delete value._id;
  if (value.seller) value.seller = publicUser(value.seller);
  return value;
}

module.exports = { publicUser, publicListing };
