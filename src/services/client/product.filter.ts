import { prisma } from "config/client";

const userFilter = async (usernameInput: string) => {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: usernameInput,
      },
    },
  });
};

const getProductWithFilter = async (
  page: number,
  pageSize: number,
  factory: string,
  target: string,
  price: string,
  sort: string,
) => {
  // Build where query
  let whereClause: any = {};

  if (factory) {
    const factoryInput = factory.split(",");
    whereClause.factory = {
      in: factoryInput,
    };
  }

  // whereClause = {
  //   factory: {...}
  // }

  if (target) {
    const targetInput = target.split(",");
    whereClause.target = {
      in: targetInput,
    };
  }

  //   whereClause = {
  //        factory: {...},
  //        target: {...}
  // }

  if (price) {
    const priceInput = price.split(",");
    const priceCondition = [];

    for (let i = 0; i < priceInput.length; i++) {
      if (priceInput[i] === "duoi-10-trieu") {
        priceCondition.push({
          price: {
            lte: 10000000,
          },
        });
      }
      if (priceInput[i] === "10-15-trieu") {
        priceCondition.push({
          price: {
            gte: 10000000,
            lte: 15000000,
          },
        });
      }
      if (priceInput[i] === "15-20-trieu") {
        priceCondition.push({
          price: {
            gte: 15000000,
            lte: 20000000,
          },
        });
      }
      if (priceInput[i] === "tren-20-trieu") {
        priceCondition.push({
          price: {
            gte: 20000000,
          },
        });
      }
    }

    whereClause.OR = priceCondition;
  }

  // Build sort query
  let orderByClause: any = {};
  if (sort) {
    if (sort === "gia-tang-dan") {
      orderByClause = {
        price: "asc",
      };
    }
    if (sort === "gia-giam-dan") {
      orderByClause = {
        price: "desc",
      };
    }
  }
  const skip = (page - 1) * pageSize;

  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: skip,
      take: pageSize,
      where: whereClause,
      orderBy: orderByClause,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(count / pageSize);

  return {
    products,
    totalPages,
  };
};

/*
Yêu cầu 1: http://localhost:8080/products?minPrice=1000000
Lấy ra tất cả sản phẩm có giá (price) tối thiểu là 1.000.000 (vnd)
 */
const productFilterMinPrice = async (price: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: +price,
      },
    },
  });
};

/*
Yêu cầu 2: http://localhost:8080/products?maxPrice=15000000
Lấy ra tất cả sản phẩm có giá (price) tối đa  là 15.000.000 (vnd)

 */
const productFilterMaxPrice = async (price: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        lte: +price,
      },
    },
  });
};

/*
Yêu cầu 3: http://localhost:8080/products?factory=APPLE
Lấy ra tất cả sản phẩm có hãng sản xuất = APPLE

 */
const productFactory = async (factory: string) => {
  const factoryList = factory.split(",");

  return await prisma.product.findMany({
    where: {
      factory: {
        in: factoryList,
      },
    },
  });
};

// const filterByPriceRange = async (price: string) => {
//   const [minStr, maxStr] = price.split("-toi-");

//   const min = Number(minStr) * 1000000; // đổi "10" thành 10 triệu
//   const max = Number(maxStr.replace("-trieu", "")) * 1000000;

//   return await prisma.product.findMany({
//     where: {
//       AND: [
//         {
//           price: {
//             gte: min,
//           },
//         },
//         {
//           price: {
//             lte: max,
//           },
//         },
//       ],
//     },
//   });
// };

const parsePriceRanges = (rangesStr: string) => {
  const ranges = rangesStr.split(","); // ["10-toi-15-trieu", "16-toi-20-trieu"]

  return ranges.map(range => {
    const [minStr, maxStr] = range.split("-toi-");

    const min = Number(minStr) * 1_000_000;
    const max = Number(maxStr.replace("-trieu", "")) * 1_000_000;

    return { min, max };
  });
};
const filterByPriceRange = async (price: string) => {
  const ranges = parsePriceRanges(price);
  const orConditions = ranges.map(r => ({
    price: {
      gte: r.min,
      lte: r.max,
    },
  }));

  return await prisma.product.findMany({
    where: {
      OR: orConditions,
    },
  });
};

const parseSort = (sortStr: string) => {
  const [field, direction] = sortStr.split(",");
  return {
    field,
    direction: direction === "desc" ? "desc" : "asc", // mặc định asc
  };
};
const productSort = async (sort: string) => {
  const { field, direction } = parseSort(sort);

  return await prisma.product.findMany({
    orderBy: {
      [field]: direction,
    },
  });
};

export { userFilter, getProductWithFilter };
