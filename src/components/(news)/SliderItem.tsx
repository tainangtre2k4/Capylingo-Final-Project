// import { Dimensions, StyleSheet, Text, View, Image, Animated } from 'react-native'
// import React from 'react'
// import { NewsDataType } from '@/constants/types'
// import { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
// import { LinearGradient } from 'expo-linear-gradient'
// import { colors } from 'react-native-elements'

// type Props = {
//     slideItem: NewsDataType
//     index: number
//     scrollX: SharedValue<number>
// }

// const {width} = Dimensions.get('screen')

// const SliderItem = ({slideItem, index, scrollX}: Props) => {
//     const rnStyle = useAnimatedStyle(() => {
//         return {
//         transform: [
//         {
//             translateX: interpolate(
//                 scrollX.value,
//                 [(index - 1) * width, index * width, (index + 1) * width],
//                 [-width * 0.15,0, width* 0.15],
//                 Extrapolation.CLAMP
//             ),
//         },
//         {
//             scale: interpolate(
//                 scrollX.value,
//                 [(index - 1) * width, index * width, (index + 1) * width],
//                 [0.9, 1, 0.9],
//                 Extrapolation.CLAMP
//             ),
//         },
//     ],
//     };
//     });
//   return (
//     <Animated.View style = {[styles.itemWrapper, rnStyle]} key ={slideItem.article_id}>
//       <Image source = {{uri: slideItem.image_url}} style = {styles.image} />
//       <LinearGradient colors ={["transparent", 'rgba(0,0,0,0.8']} style = {styles.background}>
//         <View style = {styles.sourceInfo}>
//                 {slideItem.source_icon && (
//                     <Image 
//                     source={{uri: slideItem.source_icon}} 
//                     style = {styles. sourceIcon} 
//                     />
//                 )}
//                 <Text style = {styles.sourceName}>{slideItem.source_name}</Text>
//         </View>
//         <Text style = {styles.title} numberOfLines={2}> {slideItem.title} </Text>
//       </LinearGradient>
//     </Animated.View>
//   )
// }

// export default SliderItem

// const styles = StyleSheet.create({
//     itemWrapper: {
//         position: 'relative',
//         width: width,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     image: {
//         width: width - 60,
//         height: 100,
//         borderRadius: 20
//     },
//     background: {
//         position: 'absolute',
//         left: 30,
//         right: 0,
//         top: 0,
//         width: width - 60,
//         height: 180,
//         borderRadius: 20
//     },
//     sourceName: {
//         color: colors.white,
//         fontSize: 12,
//         fontWeight: '600'
//     },
//     sourceIcon:{
//         width: 25,
//         height: 25,
//         borderRadius: 20,
//     },
//     sourceInfo: {
//         flexDirection: 'row',
//         position: 'absolute',
//         top: 85,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//         gap: 10
//     },
//     title: {
//         fontSize: 14,
//         color: colors.white,
//         position: 'absolute',
//         top: 120,
//         paddingHorizontal: 20,
//         fontWeight: '600'
//     }
// })
import { Dimensions, StyleSheet, Text, View, Image, Animated, TouchableOpacity } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/constants/types'
import { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from 'react-native-elements'
import { Link } from 'expo-router'


type Props = {
    slideItem: NewsDataType
    index: number
    scrollX: SharedValue<number>
}

const {width} = Dimensions.get('screen')


const SliderItem = ({slideItem, index, scrollX}: Props) => {
  return (
    <Link href={`/news/${slideItem.article_id}?url=${encodeURIComponent(slideItem.link)}`} asChild> 
    <TouchableOpacity 
     //onPress={() => WebBrowser.openBrowserAsync(slideItem.link)}
    >
    <Animated.View 
        style = {[styles.itemWrapper]} 
        key ={slideItem.article_id}>
      <Image source = {{uri: slideItem.image_url}} style = {styles.image} />
      <LinearGradient colors ={["transparent", "transparent"]} style = {styles.background}>
        <View style = {styles.sourceInfo}>
                {slideItem.source_icon && (
                    <Image 
                    source={{uri: slideItem.source_icon}} 
                    style = {styles. sourceIcon} 
                    />
                )}
                <Text style = {styles.sourceName}>{slideItem.source_name}</Text>
        </View>
        <Text style = {styles.title} numberOfLines={2}> {slideItem.title} </Text>
      </LinearGradient>
    </Animated.View>
    </TouchableOpacity>
    </Link>
  )
}

export default SliderItem

const styles = StyleSheet.create({
    itemWrapper: {
        position: 'relative',
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: width - 60,
        height: 180,
        borderRadius: 20
    },
    background: {
        position: 'absolute',
        left: 30,
        right: 0,
        top: 0,
        width: width - 60,
        height: 180,
        borderRadius: 20
    },
    sourceName: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600'
    },
    sourceIcon:{
        width: 25,
        height: 25,
        borderRadius: 20,
    },
    sourceInfo: {
        flexDirection: 'row',
        position: 'absolute',
        top: 85,
        paddingHorizontal: 20,
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 14,
        color: colors.white,
        position: 'absolute',
        top: 120,
        paddingHorizontal: 20,
        fontWeight: '600'
    }
})
