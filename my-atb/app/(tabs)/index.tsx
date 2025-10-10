import {View, Text, ScrollView} from 'react-native';
import {useGetCategoriesQuery} from "@/services/categoryService";
import LoadingOverlay from "@/components/LoadingOverlay";
import CategoryCard from "@/components/CategoryCard";
import {router} from "expo-router";


export default function HomeScreen() {

    const {data: categories, isLoading} = useGetCategoriesQuery();

    const onRemoveItem = (id: number) => {
        console.log("Remove item", id);
    }

    const goToCategoryProducts = (id: number, name: string) => {
        router.push({
            pathname: '/products',
            params: { categoryId: String(id), title: name },
        });
    };

    return (
        <>
            <LoadingOverlay visible={isLoading} />

            <View className={"pt-20"}>
                <Text className={"font-bold color-blue-800 text-3xl text-center"}>Категорії</Text>
            </View>

            <View className={"flex-1"}>
                <ScrollView className={"w-full"}>
                    <View className={"w-[93%] self-center my-4 gap-4 flex-row flex-wrap justify-between"}>
                        {categories?.map((category) =>
                            <CategoryCard key={category.id} onDelete={onRemoveItem}
                                          category={category}
                                          onPress={() => goToCategoryProducts(category.id, category.name)}
                            />)}
                    </View>
                </ScrollView>
            </View>
        </>
    );
}



