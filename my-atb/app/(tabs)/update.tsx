import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text, TouchableOpacity,
    View,
    Image
} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;
import FormField from "@/components/FormField";
import {useEffect, useState} from "react";
import slugify from "slugify";
import * as ImagePicker from 'expo-image-picker';
import {useUpdateCategoryMutation, useGetCategoryByIdQuery} from "@/services/categoryService";
import {router, useLocalSearchParams} from "expo-router";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function UpdateTabScreen() {

    const {id} = useLocalSearchParams<{ id: string }>();

    // конвертуємо у число
    const categoryId = id ? parseInt(id, 10) : undefined;

    const {
        data: category,
        isLoading: isLoadingCategory,
        isFetching: isFetchingCategory
    } = useGetCategoryByIdQuery(categoryId!, {
        skip: !categoryId, // щоб не викликало запит, якщо id немає
    });
    console.log(category);

    const [form, setForm] = useState({
        name: "",
        slug: "",
    });
    // коли category оновиться → синхронізуємо форму
    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                slug: category.slug,
            });
        }
    }, [category]);

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Потрібен доступ до галереї!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };
    const [updateCategory, {isLoading: isLoadingUpdate}] = useUpdateCategoryMutation();

    const updateHadler = async () => {
        const formData = new FormData();
        formData.append("Id", id);
        formData.append("Name", form.name);
        formData.append("Slug", form.slug);
        if (image) {
            const filename = image.split('/').pop()!;
            const match = /\.(\w+)$/.exec(filename);
            const ext = match?.[1];
            const mimeType = `image/${ext}`;

            formData.append("ImageFile", {
                uri: image,
                name: filename,
                type: mimeType,
            } as any);
        }
        try {
            const res = await updateCategory(formData).unwrap();
            setForm({
               name: "",
               slug: "",
            });
            setImage(null);
            console.log("Оновили категорію", res);
            router.replace("/");
        } catch (error) {
            console.error("Не оновили", error);
        }
    }
    console.log("is loading category", isFetchingCategory, isFetchingCategory);
    const isLoading = isFetchingCategory || isFetchingCategory || isLoadingUpdate;
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}
                        keyboardShouldPersistTaps="handled"
                    >

                        <View
                            className="w-full flex justify-center items-center my-6"
                            style={{
                                minHeight: Dimensions.get("window").height - 100,
                            }}
                        >
                            {isLoading ? (
                                <LoadingOverlay visible={isLoading}/>
                            ) : (
                                <>
                                    <Text className={"text-3xl font-bold mb-6 text-black"}>
                                        Оновлення категорію
                                    </Text>

                                    <FormField
                                        title={"Назва"}
                                        value={form.name}
                                        placeholder={"Назва категорії"}
                                        onChangeText={(text) => setForm({
                                            ...form,
                                            name: text,
                                            slug: slugify(text, {lower: true})
                                        })}
                                    />

                                    <FormField
                                        title={"Slug"}
                                        value={form.slug}
                                        placeholder={"Slug категорії"}
                                        onChangeText={(text) => setForm({...form, slug: text})}
                                    />

                                    <TouchableOpacity
                                        onPress={pickImage}
                                        className="w-full bg-indigo-300 p-3 rounded-lg mt-4"
                                    >
                                        <Text className="text-center text-white font-bold">Обрати фото</Text>
                                    </TouchableOpacity>

                                    {image && (
                                        <Image
                                            source={{uri: image}}
                                            style={{width: 100, height: 100, borderRadius: 50, marginTop: 10}}
                                        />
                                    )}
                                    <TouchableOpacity
                                        onPress={updateHadler}
                                        className="w-full bg-red-600 p-3 rounded-lg mt-4"
                                    >
                                        <Text className="text-center text-white font-bold">Зберегти</Text>
                                    </TouchableOpacity>
                                </>
                            )
                            }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


