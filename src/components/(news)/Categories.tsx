import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { colors } from 'react-native-elements'
import newsCategoryList from '@/constants/types/Categories'

type Props = {
    onCategoryChanged: (category: string ) => void
}

const Categories = ({onCategoryChanged}: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const itemRef = useRef<TouchableOpacity[] | null[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelectCategory = (index: number) => {
        const selected = itemRef.current[index];
        setActiveIndex(index);

        selected?.measure((x) => {
            scrollRef.current?.scrollTo({x: x-20, y: 0, animated: true});
        });

        onCategoryChanged(newsCategoryList[index].slug)
    }
    return (
        <View>
            <Text style={styles.title}>Trending Right Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsWrapper}>
                {newsCategoryList.map((item, index) => (
                    <TouchableOpacity 
                    ref = {(el) => (itemRef.current[index] = el)}
                    key={index} 
                    style = {[styles.item, activeIndex === index && styles.itemActive]}
                    onPress = {() => handleSelectCategory(index)}
                    >
                        <Text style = {[
                            styles.itemText, 
                            activeIndex === index && styles.itemTextActive]}
                            >
                            {item.title}
                            
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Categories

const styles = StyleSheet.create({
    container:{
        marginBottom:10
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.black,
        marginBottom: 10,
        marginLeft: 20,
    },
    itemsWrapper: {
        gap: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    item: {
        borderWidth: 1,
        borderColor: colors.grey0,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    itemActive: {
        backgroundColor: "#3DB2FF",
        borderColor: "#3DB2FF",
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowColor: "black",
    },
    itemText: {
        fontSize: 14,
        color: colors.grey0,
        letterSpacing: 0.5
    },
    itemTextActive: {
        fontWeight: '600',
        color: colors.white,
    }
})