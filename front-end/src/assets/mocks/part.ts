import { TPart } from "@/types";
import { faker } from "@faker-js/faker";

const generateMockPart = (): TPart => ({
  part_id: faker.string.uuid(),
  part_no: faker.string.alphanumeric(10).toUpperCase(),
  part_name: faker.commerce.productName(),
  packing_std: faker.number.int({ min: 1, max: 100 }),
  picture_std: faker.image.urlLoremFlickr({ category: "industrial" }),
  q_point: faker.lorem.sentence(),
  packing: faker.commerce.productMaterial(),
  more_pictures: [
    faker.image.urlLoremFlickr({ category: "industrial" }),
    faker.image.urlLoremFlickr({ category: "industrial" }),
    faker.image.urlLoremFlickr({ category: "industrial" }),
  ],
  creator: faker.person.fullName(),
  create_at: faker.date.past().toISOString(),
  update_at: faker.date.recent().toISOString(),
});

export const mockPart = (length = 24) => {
  return Array.from({ length }, (_, i) => ({
    ...generateMockPart(),
    picture_std: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      i * 6 + 1
    }.png`,
    q_point: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      i * 6 + 2
    }.png`,
    packing: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
      i * 6 + 3
    }.png`,
    more_pictures: [
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        i * 6 + 4
      }.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        i * 6 + 5
      }.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        i * 6 + 6
      }.png`,
    ],
  }));
};
