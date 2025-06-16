// src/api/services/serviceApi.ts
import axiosInstance from "./axiosInstance";
import type { Service } from "../../types";

export async function fetchServices(
  search: string = "",
  minPrice = "",
  maxPrice = ""
): Promise<Service[]> {
  try {
    const response = await axiosInstance.get("/api/services/", {
      params: {
        ...(search && { name: search }),
        ...(minPrice && { min_price: minPrice }),
        ...(maxPrice && { max_price: maxPrice }),
      },
    });

    return response.data;
  } catch (error) {
    console.warn("Using mock data due to error:", error);
    return [
      {
        id: 1,
        name: "Антивирусная защита",
        description: "Комплексная защита от вирусов",
        image: "",
        price: 10.0,
      },
      {
        id: 2,
        name: "Резервное копирование",
        description: "Автоматическое бэкапирование данных",
        image: "",
        price: 15.0,
      },
    ].filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }
}
