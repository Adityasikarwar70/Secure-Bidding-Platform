// {
//   "title": "string",
//   "description": "string",
//   "expectedPrice": 0,
//   "categoryId": 0,
//   "durationDays": 0,
//   "imageUrls": [
//     "string"
//   ]
// }

import DotNetAxiosInstance from "../../../Shared/Ajax/DotNetAjax";

export async function getAllCategories() {
  const response = await DotNetAxiosInstance.get("categories");
  return response.data;
}

export async function createProduct(form,images) {
  const response = await DotNetAxiosInstance.post(
    "products",

    {
      Title: form.title,
      Description: form.description,
      ExpectedPrice: form.expectedPrice,
      CategoryId: form.categoryId,
      DurationDays: form.durationDays,
      ImageUrls: images,
    },
  );

    return response.data;
}
