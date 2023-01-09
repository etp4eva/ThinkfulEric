import { TouchableHighlight, Text, Image, ImageSourcePropType, View, StyleSheet, StyleProp, Pressable, ImageStyle, TextStyle } from 'react-native'

type Styles = {

}

type Params = {
    label?: string,
    image: ImageSourcePropType,
    onPress: () => void,
    imageStyle?: StyleProp<ImageStyle>,
    textStyle?: StyleProp<TextStyle>,
}

export const ImageButton = (params: Params) => {

    const label = (params.label) ? (
        <Text style={params.textStyle}>
            {params.label}
        </Text>
    ) : undefined

    return (
        <Pressable
            onPress={params.onPress}
            style={({pressed}) => [
                (pressed) ? styles.pressed : null
            ]}  
        >
            <View style={[styles.container]}>
                <Image
                    source={params.image}
                    style={params.imageStyle}
                />
                {label}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    pressed: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
})