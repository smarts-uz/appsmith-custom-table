import "../tailwind.css";
import type { Schema } from "../types";
import { ItemSize } from "../constants";
import { faker } from "@faker-js/faker";

export const mockSchema: Schema = {
  customer_name: {
    title: { uz: "Mijoz Ismi", ru: "Имя клиента" },
  },
  delivery_location: {
    title: { uz: "Yetkazish Manzili", ru: "Адрес доставки" },
    type: "url",
  },
  start_date: {
    title: { uz: "Sana", ru: "Дата" },
    type: "date",
  },
  total_lost_qty: {
    title: { uz: "Qolgan maxsulot soni", ru: "Количество оставшихся товаров" },
    size: ItemSize.sm,
  },
  used_days: {
    title: { uz: "Foydalanilgan kun", ru: "Количество дней использования" },
    size: ItemSize.sm,
  },
  debt_amount: {
    title: { uz: "Qarz", ru: "Долг" },
    type: "currency",
  },
  customer_phone: {
    title: { uz: "Telefon Raqam", ru: "Телефон номер" },
    type: "phone",
  },
  total_payment_amount: {
    title: { uz: "Ummiy tolangan", ru: "Общий платеж" },
    type: "currency",
  },
};

export const generateData = (count: number) =>
  Array.from({ length: count }).map(() => ({
    customer_name: faker.person.fullName(),
    delivery_location: `${faker.location.streetAddress()}|||${faker.internet.url()}`,
    start_date: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
    total_lost_qty: faker.number.int({ max: 999 }),
    used_days: faker.number.int({ max: 365 }),
    debt_amount: faker.number.int({ max: 999999999 }),
    customer_phone: faker.phone.number({ style: "international" }),
    total_payment_amount: faker.number.int({ max: 999999999 }),
  }));
