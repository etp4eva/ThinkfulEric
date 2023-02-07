import { Text, Button, FlatList, ListRenderItem, View, StyleProp, ViewStyle, StyleSheet, Pressable, TextStyle } from "react-native"

type Params = {
    data: any[];
    removeFn: (idx: number) => void;
    minItems?: number;
    textStyle?: StyleProp<TextStyle>;
}

export interface RemovableListItemInterface {
    labels: String[];
}

export const RemoveableItemList = (params: Params) => {
    const isRemoveRendered = (!params.minItems) || params.minItems < params.data.length;
    
    const renderItem = ({item, index}: {item: RemovableListItemInterface, index: number}) => {
        const hasSubLabel = item.labels.length > 1;        
        let removeButton;
        let subLabel;

        if (isRemoveRendered)
        {
            removeButton = (
                <Pressable
                    onPress={() => params.removeFn(index)}
                >
                    <Text style={{fontSize:25}}>❌</Text>
                </Pressable>
            )
        }

        if (hasSubLabel)
        {
            subLabel = (
                <Text style={params.textStyle}>{item.labels[1]}</Text>
            )
        }

        return (
            <View style={[styles.item, index % 2 === 1 ? styles.itemBackground : null]}>
                <Text style={[styles.label, params.textStyle]}>{item.labels[0]}</Text>
                {subLabel}
                {removeButton}
            </View>
        )
    }

    return (
        <FlatList 
            data={params.data}
            renderItem={renderItem}
            style={styles.list}
        />
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',       
        alignItems: 'center',        
    },
    itemBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    label: {
        width: '30%',
        textAlign: 'center',
    },
    list: {
        flexGrow: 0
    }
})