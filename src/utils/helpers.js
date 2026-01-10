export const bdPhone = (num) => /^(\+8801)[3-9][0-9]{8}$/.test(num);
export const publicImage = (query) => `/${query.toLowerCase()}.jpg`;
