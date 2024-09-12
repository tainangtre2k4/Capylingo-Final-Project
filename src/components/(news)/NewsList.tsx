import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { NewsDataType } from '@/constants/types'
import { colors } from 'react-native-elements'
import Loading from './Loading'
import { Link } from 'expo-router'
import { TouchableOpacity } from 'react-native'

type Props = {
    newsList: Array<NewsDataType>
}

const NewsList = ({newsList}: Props) => {
  return (
    <View style={styles.container}>
        {newsList.length == 0 ? (
            <Loading size = {"large"}/>
        ) : (
        newsList.map((item, index)=> (
        <Link href={`/news/${item.article_id}?url=${encodeURIComponent(item.link)}`} asChild key = {index}> 
        <TouchableOpacity>
            <NewsItem item = {item} />
        </TouchableOpacity>
        </Link>
        ))
        )}
    </View>
  )
}

export const NewsItem =({item}: {item: NewsDataType}) => {
    return (
        <View style={styles.itemContainer}>
            <Image source={{uri:item.image_url}} style={styles.itemImg} />
            <View style = {styles.itemInfo}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemTitle}>{item.title}</Text>
                <View style = {styles.itemSourceInfo}>
                <Image source = {{uri: item.source_icon}} style = {styles.itemSourceImg}/>
                    <Text style = {styles.itemSourceName}>
                    {item.source_name}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default NewsList

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        flex: 1,
        gap: 10
    },
    itemImg: {
        width: 90,
        height: 100,
        borderRadius: 20,
        marginRight: 10
    },
    itemInfo: {
        flex: 1,
        gap: 10,
        justifyContent: 'space-between',
    },
    itemCategory: {
        fontSize: 12,
        color: colors.grey0,
        textTransform: 'capitalize'
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: colors.black
    },
    itemSourceInfo: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    },
    itemSourceImg: {
        width: 20,
        height: 20,
        borderRadius: 20
    },
    itemSourceName: {
        fontSize: 10,
        fontWeight: '400',
        color: colors.grey0
    }
})