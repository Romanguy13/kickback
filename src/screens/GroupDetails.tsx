import React from "react";
import {Text, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {GroupReturnModel} from "../resources/schema/group.model";
import NavBar from "./NavBar";


type GroupDetailsProps = StackScreenProps<
    { GroupDetails: { group: GroupReturnModel } },
    'GroupDetails'
>;

export default function GroupDetails({ navigation, route }: GroupDetailsProps) {
    const { group } = route.params;

    return (
        <View style={{
            flex: 1,
        }}>
            <Text>{group.name}</Text>
            <NavBar navigation={navigation} />
        </View>
    );
}