import {Pressable, View, Text} from "react-native";
import {GroupReturnModel} from "../resources/schema/group.model";

interface GroupCardProps {
    group: GroupReturnModel;
    navigation: any;
}

export default function GroupCard({group, navigation}: GroupCardProps) {
    const onPressAction = () => {
        navigation.navigate('GroupDetails', {
            group,
        });
    }

    return (
        <Pressable onPress={onPressAction}>
            <View>
                <Text>{group.name}</Text>
            </View>
        </Pressable>
    );
}