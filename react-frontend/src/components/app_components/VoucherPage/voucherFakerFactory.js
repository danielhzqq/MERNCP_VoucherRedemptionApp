
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
id: faker.lorem.sentence(1),
categoryid: faker.lorem.sentence(1),
points: faker.lorem.sentence(1),
title: faker.lorem.sentence(1),
image: faker.lorem.sentence(1),
description: faker.lorem.sentence(1),
termsandcondition: faker.lorem.sentence(1),
islatest: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
