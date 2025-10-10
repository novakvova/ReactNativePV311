import {ICategoryItem} from "@/interfaces/category/ICategoryItem";
import {Image, View, Text, TouchableOpacity, Pressable} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {router} from "expo-router";
import {useState} from "react";
import {Confirmation} from "@/components/Confirmation";

interface Props {
    category: ICategoryItem,
    onDelete: (id:number) => void,
    onPress?: () => void;
}


const CategoryCard : React.FC<Props> = ({category, onDelete, onPress}) => {

    const [viewModal, setViewModal] = useState<boolean>(false);

    const confirmDelete = (id: number) => {
        if(onDelete)
            onDelete(id);
        setViewModal(false);
    }

    return (
        <>
            <View style={{width: "47%"}}
                className={"bg-gray-300 elevation-xl border-gray-500 rounded-md overflow-hidden"}>

                <Confirmation
                    isVisible={viewModal}
                    title={`Ви впевненні що бажаєте видалити "${category.name}" ?`}
                    onConfirm={() => confirmDelete(category.id)}
                    onCancel={() => setViewModal(false)} />

                <Pressable onPress={onPress}>
                    <Image className="w-full aspect-[16/12]"
                           resizeMode={"cover"}
                           source={{uri: `http://10.0.2.2:5285/images/200_${category.image}`}} />
                </Pressable>
                <View className='flex flex-row  justify-between'>

                    <TouchableOpacity className=' self-center mx-1' onPress={() => setViewModal(true)}>
                        <MaterialIcons name="clear" size={24} color="red" />
                    </TouchableOpacity>

                    <Text className='self-center m-3 flex-shrink'>{category.name}</Text>

                    <TouchableOpacity className=' self-center mx-2' onPress={() => router.push(`/update?id=${category.id}`)}>
                        <MaterialIcons name="edit-square" size={24} color="green" />
                    </TouchableOpacity>
                </View>

            </View>
        </>
    )
}

export default CategoryCard;