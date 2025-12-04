import { prisma } from "config/client";

const getProducts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  return products;
};
const getProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

const countTotalProductClientPages = async (pageSize: number) => {
  const totalItems = await prisma.product.count();

  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages;
};

const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (cart) {
    // Update
    // Cập nhật sum giỏ hàng
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: {
          increment: quantity,
        },
      },
    });
    // Cập nhật cart-detail
    // Nếu chưa có, tạo mới. Có rồi, cập nhật quantity
    // Update + insert
    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: {
        productId: productId,
        cartId: cart.id,
      },
    });

    await prisma.cartDetail.upsert({
      where: {
        id: currentCartDetail?.id ?? 0,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        price: product.price,
        quantity: quantity,
        productId: productId,
        cartId: cart.id,
      },
    });
  } else {
    // Create
    await prisma.cart.create({
      data: {
        sum: quantity,
        userId: user.id,
        cartDetails: {
          create: [
            {
              price: product.price,
              quantity: quantity,
              productId: productId,
            },
          ],
        },
      },
    });
  }
};

const getProductInCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (cart) {
    const currentCartDetail = await prisma.cartDetail.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    return currentCartDetail;
  }
  return [];
};

const deleteProductInCart = async (cartDetailId: number, userId: number, sumCart: number) => {
  // Xóa cart-detail
  const currentCartDetail = await prisma.cartDetail.findUnique({
    where: { id: cartDetailId },
  });
  const quantity = currentCartDetail.quantity;

  await prisma.cartDetail.delete({
    where: { id: cartDetailId },
  });

  if (sumCart === 1) {
    // Delete cart
    await prisma.cart.delete({
      where: { userId },
    });
  } else {
    // Update cart
    await prisma.cart.update({
      where: { userId },
      data: {
        sum: {
          decrement: quantity,
        },
      },
    });
  }
};

const updateCartDetailBeforeCheckOut = async (
  data: { id: string; quantity: string }[],
  cartId: string,
) => {
  let quantity = 0;

  for (let i = 0; i < data.length; i++) {
    quantity += +data[i].quantity;
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: {
        quantity: +data[i].quantity,
      },
    });
  }

  // Update cart sum
  await prisma.cart.update({
    where: {
      id: +cartId,
    },
    data: {
      sum: quantity,
    },
  });
};

const handlerPlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number,
) => {
  try {
    // Tạo transaction
    await prisma.$transaction(async tx => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          cartDetails: true,
        },
      });

      if (cart) {
        // Create order
        const dataOrderDetail =
          cart?.cartDetails?.map(item => ({
            price: item.price,
            quantity: item.quantity,
            productId: item.productId,
          })) ?? [];

        await tx.order.create({
          data: {
            receiverName,
            receiverAddress,
            receiverPhone,
            paymentMethod: "COD",
            paymentStatus: "PAYMENT_UNPAID",
            status: "PENDING",
            totalPrice: totalPrice,
            userId,
            orderDetails: {
              create: dataOrderDetail,
            },
          },
        });

        // Remove cart detail + cart
        await tx.cartDetail.deleteMany({
          where: { cartId: cart.id },
        });
        await tx.cart.delete({
          where: { id: cart.id },
        });

        // Check product
        for (let i = 0; i < cart.cartDetails.length; i++) {
          const productId = cart.cartDetails[i].productId;
          const product = await tx.product.findUnique({
            where: { id: productId },
          });

          if (!product || product.quantity < cart.cartDetails[i].quantity) {
            throw new Error(`Sản phẩm ${product?.name} không tồn tại hoặc không đủ số lượng`);
          }

          await tx.product.update({
            where: { id: productId },
            data: {
              quantity: {
                decrement: cart.cartDetails[i].quantity,
              },
              sold: {
                increment: cart.cartDetails[i].quantity,
              },
            },
          });
        }
      }
    });
    return "";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const getOrderHistory = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
};

export {
  getProducts,
  getProductById,
  addProductToCart,
  getProductInCart,
  deleteProductInCart,
  updateCartDetailBeforeCheckOut,
  handlerPlaceOrder,
  getOrderHistory,
  countTotalProductClientPages,
};
