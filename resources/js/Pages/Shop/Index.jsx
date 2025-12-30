import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Index({ products, cartItems }) {
    const { errors } = usePage().props;
    const [productQuantities, setProductQuantities] = useState(() =>
        Object.fromEntries(products.map((product) => [product.id, 1])),
    );
    const [cartQuantities, setCartQuantities] = useState(() =>
        Object.fromEntries(cartItems.map((item) => [item.id, item.quantity])),
    );

    useEffect(() => {
        setCartQuantities(
            Object.fromEntries(
                cartItems.map((item) => [item.id, item.quantity]),
            ),
        );
    }, [cartItems]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = Number(item.product.price);
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const handleAddToCart = (productId) => {
        router.post(
            route('cart.store'),
            {
                product_id: productId,
                quantity: productQuantities[productId] ?? 1,
            },
            { preserveScroll: true },
        );
    };

    const handleUpdateCart = (cartItemId) => {
        router.patch(
            route('cart.update', cartItemId),
            {
                quantity: cartQuantities[cartItemId],
            },
            { preserveScroll: true },
        );
    };

    const handleRemoveCart = (cartItemId) => {
        router.delete(route('cart.destroy', cartItemId), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Shop
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Browse products and manage your cart.
                    </p>
                </div>
            }
        >
            <Head title="Shop" />

            <div className="py-12">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
                    <section className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col justify-between gap-4 rounded-lg bg-white p-6 shadow-sm sm:flex-row sm:items-center"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ${Number(product.price).toFixed(2)} ·{' '}
                                        {product.stock_quantity} in stock
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock_quantity}
                                        value={
                                            productQuantities[product.id] ?? 1
                                        }
                                        onChange={(event) =>
                                            setProductQuantities((prev) => ({
                                                ...prev,
                                                [product.id]:
                                                    Number(event.target.value) ||
                                                    1,
                                            }))
                                        }
                                        className="w-20 rounded-md border-gray-300 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddToCart(product.id)
                                        }
                                        className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <aside className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Your cart
                        </h3>
                        {errors.quantity && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.quantity}
                            </p>
                        )}

                        {cartItems.length === 0 ? (
                            <p className="mt-4 text-sm text-gray-500">
                                Your cart is empty.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-md border border-gray-100 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ${Number(
                                                        item.product.price,
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveCart(item.id)
                                                }
                                                className="text-sm text-red-600 hover:text-red-500"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.product.stock_quantity}
                                                value={
                                                    cartQuantities[item.id] ??
                                                    item.quantity
                                                }
                                                onChange={(event) =>
                                                    setCartQuantities((prev) => ({
                                                        ...prev,
                                                        [item.id]:
                                                            Number(
                                                                event.target
                                                                    .value,
                                                            ) || 1,
                                                    }))
                                                }
                                                className="w-20 rounded-md border-gray-300 text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateCart(item.id)
                                                }
                                                className="inline-flex items-center justify-center rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Update
                                            </button>
                                            <span className="ml-auto text-sm text-gray-500">
                                                Line total: $
                                                {(
                                                    Number(
                                                        item.product.price,
                                                    ) *
                                                    (cartQuantities[item.id] ??
                                                        item.quantity)
                                                ).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-gray-900">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
