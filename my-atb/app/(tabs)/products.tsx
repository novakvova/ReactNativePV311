// app/(tabs)/products.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import axios from "axios";
import { Image } from "expo-image";

type Product = {
    id: number;
    name: string;
    price?: number;
    productImages?: string[];

};

const API_BASE = "http://10.0.2.2:5285";

export default function ProductsByCategoryScreen() {
    const { categoryId, title } = useLocalSearchParams<{ categoryId: string; title?: string }>();

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const headerTitle = useMemo(() => title ?? "Товари", [title]);

    const fetchData = useCallback(async () => {
        if (!categoryId) return;
        try {
            const { data } = await axios.get<Product[]>(
                `${API_BASE}/api/Products/by-category/${categoryId}`
            );
            setItems(data ?? []);
        } catch (e) {
            console.log("Load products error", e);
            setItems([]);
        }
    }, [categoryId]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        })();
    }, [fetchData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    const renderItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            className="bg-white rounded-2xl p-3 mb-3 mx-4 border border-gray-200"
            onPress={() => {

            }}
        >
            <View className="flex-row gap-3">
                <Image
                    source={{
                        uri: item.productImages
                            ? `${API_BASE}${item.productImages[0]}`
                            : `${API_BASE}/images/placeholder.png`,
                    }}
                    contentFit="cover"
                    style={{ width: 84, height: 84, borderRadius: 12 }}
                />
                <View className="flex-1">
                    <Text className="text-base font-semibold" numberOfLines={2}>
                        {item.name}
                    </Text>
                    {typeof item.price !== "undefined" && (
                        <Text className="mt-1 text-gray-700">{item.price} ₴</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
                <Text className="mt-3">Завантаження товарів…</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 pt-16">

            <View className="px-4 mb-3 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-3 py-2 rounded-xl border border-gray-300"
                >
                    <Text>Назад</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-bold flex-1 text-center" numberOfLines={1}>
                    {headerTitle}
                </Text>

                <View style={{ width: 64 }} />
            </View>

            <FlatList
                data={items}
                keyExtractor={(it) => String(it.id)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 24 }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-600">Немає товарів у цій категорії.</Text>
                    </View>
                }
            />
        </View>
    );
}
