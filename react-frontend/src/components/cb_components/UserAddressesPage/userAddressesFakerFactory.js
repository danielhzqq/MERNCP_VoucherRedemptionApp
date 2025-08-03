import { faker } from "@faker-js/faker";
export default (user, count, userIdIds) => {
  let data = [];
  for (let i = 0; i < count; i++) {
    const fake = {
      userId: userIdIds[i % userIdIds.length],
      Street1: faker.lorem.sentence(1),
      Street2: faker.lorem.sentence(1),
      Poscode: faker.lorem.sentence(1),
      City: faker.lorem.sentence(1),
      State: faker.lorem.sentence(1),
      Province: faker.lorem.sentence(1),
      Country: faker.lorem.sentence(1),

      updatedBy: user._id,
      createdBy: user._id,
    };
    data = [...data, fake];
  }
  return data;
};
