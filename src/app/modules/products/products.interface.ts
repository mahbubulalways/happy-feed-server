interface TColor {
  colorName: string;
  colorCode: string;
}
export interface IProduct {
  name: string;
  brand: string;
  productCode: string;
  image: string;
  images: string[];
  availability: "In stock" | "Out of stock";
  price: number;
  discount: number;
  offerPrice: number;
  productType: string;
  category: string;
  colors: TColor[];
  size: string[];
  features: string[];
  mainCategory: string;
  description: string;
  sellCount: number;
}

// {
//     "name": "UltraSoft Running Shoes",
//     "brand": "RunFast",
//     "productCode": "RS12345",
//     "image": "https://example.com/images/rs12345-main.jpg",
//     "images": [
//       "https://example.com/images/rs12345-1.jpg",
//       "https://example.com/images/rs12345-2.jpg",
//       "https://example.com/images/rs12345-3.jpg"
//     ],
//     "availability": "In stock",
//     "price": 99.99,
//     "discount": 10,
//     "offerPrice": 89.99,
//     "productType": "Footwear",
//     "category": "Sportswear",
//     "colors": [
//       {
//         "colorName": "Red",
//         "colorCode": "#FF0000"
//       },
//       {
//         "colorName": "Black",
//         "colorCode": "#000000"
//       },
//       {
//         "colorName": "White",
//         "colorCode": "#FFFFFF"
//       }
//     ],
//     "size": ["8", "9", "10", "11"],
//     "features": [
//       "Breathable mesh upper",
//       "EVA cushioning",
//       "Non-slip sole",
//       "Lightweight"
//     ],
//     "gender": "Unisex"
//   }
