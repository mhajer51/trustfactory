import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Index({ products, cartItems }) {
    const { errors, flash } = usePage().props;
    const [productQuantities, setProductQuantities] = useState(() =>
        Object.fromEntries(products.data.map((product) => [product.id, 1])),
    );
    const [cartQuantities, setCartQuantities] = useState(() =>
        Object.fromEntries(cartItems.map((item) => [item.id, item.quantity])),
    );
    const [isLoading, setIsLoading] = useState(false);
    const notification = flash?.notification;

    useEffect(() => {
        setProductQuantities(
            Object.fromEntries(products.data.map((product) => [product.id, 1])),
        );
    }, [products.data]);

    useEffect(() => {
        setCartQuantities(
            Object.fromEntries(
                cartItems.map((item) => [item.id, item.quantity]),
            ),
        );
    }, [cartItems]);

    useEffect(() => {
        const startLoading = () => setIsLoading(true);
        const stopLoading = () => setIsLoading(false);

        router.on('start', startLoading);
        router.on('finish', stopLoading);

        return () => {
            router.off('start', startLoading);
            router.off('finish', stopLoading);
        };
    }, []);

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
                        <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow-sm">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Product catalog
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Keep your assortment fresh by adding new
                                    items.
                                </p>
                            </div>
                            <Link
                                href={route('products.create')}
                                className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >
                                Add product
                            </Link>
                        </div>
                        <div className="relative">
                            {isLoading && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/70 backdrop-blur">
                                    <div className="flex items-center gap-3 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-lg">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                                        Loading updates...
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4">
                                {products.data.map((product) => (
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
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                            <span>
                                Showing {products.meta.from ?? 0}-
                                {products.meta.to ?? 0} of {products.meta.total}{' '}
                                products
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {products.links.map((link) => {
                                    const label = link.label
                                        .replace('&laquo;', '←')
                                        .replace('&raquo;', '→');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={link.label}
                                                className="inline-flex items-center rounded-lg border border-gray-100 px-3 py-1 text-sm font-semibold text-gray-300"
                                            >
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.url}
                                            className={`inline-flex items-center rounded-lg border px-3 py-1 text-sm font-semibold transition ${
                                                link.active
                                                    ? 'border-indigo-600 bg-indigo-600 text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
                                            }`}
                                            preserveScroll
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-indigo-100/50 ring-1 ring-gray-100 backdrop-blur lg:sticky lg:top-8">
                        {notification && (
                            <div
                                className={`mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                                    notification.type === 'success'
                                        ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                                        : notification.type === 'info'
                                          ? 'border-blue-100 bg-blue-50 text-blue-700'
                                          : 'border-gray-100 bg-gray-50 text-gray-700'
                                }`}
                            >
                                <span className="text-lg">
                                    {notification.type === 'success'
                                        ? '✅'
                                        : notification.type === 'info'
                                          ? 'ℹ️'
                                          : '💬'}
                                </span>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide">
                                        Notification
                                    </p>
                                    <p className="mt-1 text-sm font-medium">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                                    Summary
                                </p>
                                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                    Shopping cart
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Review, edit, and checkout with confidence.
                                </p>
                            </div>
                            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 px-3 py-2 text-center text-white shadow-md">
                                <p className="text-xs uppercase tracking-widest text-indigo-100">
                                    Items
                                </p>
                                <p className="text-lg font-semibold">
                                    {cartItems.length}
                                </p>
                            </div>
                        </div>
                        {errors.quantity && (
                            <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {errors.quantity}
                            </p>
                        )}

                        {cartItems.length === 0 ? (
                            <div className="mt-6 rounded-3xl border border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-white px-5 py-8 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                                    <span className="text-lg">🛒</span>
                                </div>
                                <p className="mt-4 text-sm font-semibold text-gray-900">
                                    Your cart is empty
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Add products from the catalog to start
                                    building your order.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product.name}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    ${Number(
                                                        item.product.price,
                                                    ).toFixed(2)}
                                                    <span className="mx-1 text-gray-300">
                                                        •
                                                    </span>
                                                    {item.product.stock_quantity}{' '}
                                                    in stock
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveCart(item.id)
                                                }
                                                className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-200 hover:bg-red-100"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-2 py-1">
                                                <span className="text-xs font-medium text-gray-500">
                                                    Qty
                                                </span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={
                                                        item.product
                                                            .stock_quantity
                                                    }
                                                    value={
                                                        cartQuantities[
                                                            item.id
                                                        ] ?? item.quantity
                                                    }
                                                    onChange={(event) =>
                                                        setCartQuantities(
                                                            (prev) => ({
                                                                ...prev,
                                                                [item.id]:
                                                                    Number(
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    ) || 1,
                                                            }),
                                                        )
                                                    }
                                                    className="w-16 rounded-xl border border-transparent bg-transparent text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleUpdateCart(item.id)
                                                }
                                                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                Update
                                            </button>
                                            <span className="ml-auto text-sm font-semibold text-gray-900">
                                                $
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
                                <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-white to-indigo-50 p-5">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-base font-semibold text-gray-900">
                                        <span>Total</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-4 w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-500"
                                    >
                                        Proceed to checkout
                                    </button>
                                    <p className="mt-3 text-center text-xs text-gray-500">
                                        Taxes calculated at checkout
                                    </p>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
