import { prisma } from "config/client";

const getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};
const getProductById = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
  });
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
          decrement: 1,
        },
      },
    });
  }
};

const updateCartDetailBeforeCheckOut = async (data: { id: string; quantity: string }[]) => {
  for (let i = 0; i < data.length; i++) {
    await prisma.cartDetail.update({
      where: {
        id: +data[i].id,
      },
      data: {
        quantity: +data[i].quantity,
      },
    });
  }
};

const handlerPlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
  totalPrice: number,
) => {
  const cart = await prisma.cart.findUnique({
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
    await prisma.order.create({
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
    await prisma.cartDetail.deleteMany({
      where: { cartId: cart.id },
    });
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
};

export {
  getProducts,
  getProductById,
  addProductToCart,
  getProductInCart,
  deleteProductInCart,
  updateCartDetailBeforeCheckOut,
  handlerPlaceOrder,
};
