import { DefaultTheme } from "@react-navigation/native"
import { StyleSheet } from "react-native"

export const Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#adba94ff',
      background: '#adba94ff',
      dot: '#6c906dff',
      card: 'rgba(255, 255, 255, 0.3)',
      text: '#171a12',
      border: '#90ad87ff',
      notification: '#b3b8ab',
      headerTint: '#90ad87ff',
    },
    images: {
      background: require('../../assets/img/monstera.png'),
      lotusButton: require('../../assets/img/lotus.png'),
      addButton: require('../../assets/img/add_button.png'),
    },
    headerOptions: {    
      headerStyle: {
        backgroundColor: '#90ad87ff', // Theme.colors.border
      },
      headerTintColor: '#223221ff', // Theme.colors.headerTint      
    },
    styles: StyleSheet.create({
      bg: {
        resizeMode: "cover",
        height: "100%",
        width: "100%",
        //alignItems: 'center',
      },
      container: {
        flex: 0,
        backgroundColor: '#adba94ff',
        padding: 0,
        margin: 0,
        width: '100%',
        alignSelf: "stretch",
      },
      card: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Theme.colors.card,
        margin: 10,
        padding: 10,
        flexGrow: 0,
      },
      titleView: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'space-around'
      },
      title: {
        fontSize: 60,
        paddingBottom: 5
      },
      subtitle: {
        fontSize: 20,
        //fontStyle: "italic", 
        marginTop: -20,
      },
    })
  }