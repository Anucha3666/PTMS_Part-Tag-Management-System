import { TPart } from "@/types";
import { faker } from "@faker-js/faker";

const generateMockPart = (): TPart => ({
  part_id: faker.string.uuid(),
  part_no: faker.string.alphanumeric(10).toUpperCase(),
  part_name: faker.commerce.productName(),
  packing_std: faker.number.int({ min: 1, max: 100 }),
  customer_name: faker.commerce.productName(),
  picture_std: faker.datatype.boolean()
    ? faker.image.urlLoremFlickr({ category: "industrial" })
    : null,
  q_point: faker.datatype.boolean() ? faker.lorem.sentence() : null,
  packing: faker.datatype.boolean() ? faker.commerce.productMaterial() : null,
  more_pictures: [
    faker.image.urlLoremFlickr({ category: "industrial" }),
    faker.image.urlLoremFlickr({ category: "industrial" }),
    faker.image.urlLoremFlickr({ category: "industrial" }),
  ],
  created_by: faker.person.fullName(),
  created_at: faker.date.past().toISOString(),
  is_deleted: false,
  deleted_at: null,
  deleted_by: null,
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
